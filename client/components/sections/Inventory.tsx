import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useCart } from "@/state/cart";

import { RefObject } from "react";
import { useInventory } from "@/state/inventory";

export default function Inventory({ cartTargetRef }: { cartTargetRef?: RefObject<HTMLElement | SVGElement | HTMLButtonElement | null> } = {}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<"todos" | "móviles" | "accesorios">("todos");

  const { products, decrementStock } = useInventory();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = cat === "todos" || p.category === cat;
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [query, cat, products]);

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
            {(["todos", "móviles", "accesorios"] as const).map((c) => (
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
              <img
                src={p.image}
                alt={p.name}
                className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs capitalize backdrop-blur">
                {p.category}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{p.name}</h3>
                <span className="text-sm text-muted-foreground">
                  ${p.price.toLocaleString()}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  className="shine-on-hover"
                  onClick={(e) => {
                    if (p.stock <= 0) return;
                    add({ id: p.id, name: p.name, price: p.price, image: p.image });
                    decrementStock(p.id, 1);
                    const target = cartTargetRef?.current as HTMLElement | SVGElement | null;
                    const fromEl = (e.currentTarget?.closest(".group") as HTMLElement) || (e.currentTarget as HTMLElement);
                    if (!target || !fromEl) return;
                    const imgEl = fromEl.querySelector("img") as HTMLImageElement | null;
                    const startRect = (imgEl || fromEl).getBoundingClientRect();
                    const endRect = (target as any).getBoundingClientRect();
                    const clone = document.createElement("img");
                    clone.src = p.image;
                    clone.alt = p.name;
                    clone.style.position = "fixed";
                    clone.style.left = `${startRect.left}px`;
                    clone.style.top = `${startRect.top}px`;
                    clone.style.width = `${startRect.width}px`;
                    clone.style.height = `${startRect.height}px`;
                    clone.style.borderRadius = "12px";
                    clone.style.zIndex = "9999";
                    clone.style.pointerEvents = "none";
                    document.body.appendChild(clone);
                    const dx = endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
                    const dy = endRect.top + endRect.height / 2 - (startRect.top + startRect.height / 2);
                    const scale = Math.max(0.2, Math.min(0.35, (endRect.width / startRect.width) * 0.6));
                    clone.animate([
                      { transform: "translate(0,0) scale(1)", opacity: 1 },
                      { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.3 },
                    ], { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }).onfinish = () => clone.remove();
                  }}
                  disabled={p.stock <= 0}
                >
                  {p.stock > 0 ? "Agregar al carrito" : "Sin stock"}
                </Button>
                <Button size="sm" variant="outline">
                  Detalles
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
