import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useCart } from "@/state/cart";

type Product = {
  id: string;
  name: string;
  price: number;
  category: "móviles" | "accesorios" | "repuestos";
  image: string;
};

const PRODUCTS: Product[] = [
  { id: "p1", name: "iPhone 13 Pro", price: 16999, category: "móviles", image: "https://images.unsplash.com/photo-1631380739856-c5b32b67fb7f?q=80&w=1200&auto=format&fit=crop" },
  { id: "p2", name: "Samsung Galaxy S23", price: 15999, category: "móviles", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1200&auto=format&fit=crop" },
  { id: "p3", name: "Cargador 20W USB‑C", price: 499, category: "accesorios", image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?q=80&w=1200&auto=format&fit=crop" },
  { id: "p4", name: "Cable Lightning trenzado", price: 349, category: "accesorios", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1200&auto=format&fit=crop" },
  { id: "p5", name: "Pantalla OLED iPhone 12", price: 2899, category: "repuestos", image: "https://images.unsplash.com/photo-1510936111840-65e151ad71bb?q=80&w=1200&auto=format&fit=crop" },
  { id: "p6", name: "Batería original Samsung", price: 1499, category: "repuestos", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop" },
  { id: "p7", name: "Case MagSafe", price: 699, category: "accesorios", image: "https://images.unsplash.com/photo-1601435119439-c1f5f950b35e?q=80&w=1200&auto=format&fit=crop" },
  { id: "p8", name: "Pixel 8 Pro", price: 17499, category: "móviles", image: "https://images.unsplash.com/photo-1603808033070-24bb34d4a703?q=80&w=1200&auto=format&fit=crop" },
];

export default function Inventory() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<"todos" | Product["category"]>("todos");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCat = cat === "todos" || p.category === cat;
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [query, cat]);

  const { add } = useCart();

  return (
    <section id="tienda" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Tienda</h2>
        <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full rounded-xl border bg-background px-4 py-2 text-sm outline-none ring-primary/30 focus:ring-2 sm:w-72"
          />
          <div className="flex rounded-xl border p-1">
            {(["todos", "móviles", "accesorios", "repuestos"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={
                  "rounded-lg px-3 py-1 text-sm capitalize transition " +
                  (cat === c
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary")
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            className="group overflow-hidden rounded-2xl border bg-card shadow-sm"
          >
            <div className="relative">
              <img src={p.image} alt={p.name} className="h-56 w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
              <span className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs capitalize backdrop-blur">
                {p.category}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{p.name}</h3>
                <span className="text-sm text-muted-foreground">${p.price.toLocaleString()}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="shine-on-hover" onClick={() => add({ id: p.id, name: p.name, price: p.price, image: p.image })}>
                  Agregar al carrito
                </Button>
                <Button size="sm" variant="outline">Detalles</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
