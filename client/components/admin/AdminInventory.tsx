import { useState } from "react";
import { useInventory } from "@/state/inventory";
import { Button } from "@/components/ui/button";

export default function AdminInventory() {
  const { addProduct } = useInventory();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState<"móviles" | "accesorios">("móviles");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState(1);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setMsg("Nombre requerido");
    if (price <= 0) return setMsg("Precio debe ser mayor a 0");
    addProduct({ name: name.trim(), price: Math.round(price), category, image: image.trim() || "", stock: Math.max(0, Math.floor(stock)) });
    setMsg("Producto agregado");
    setName("");
    setPrice(0);
    setImage("");
    setStock(1);
  };

  return (
    <div>
      <h3 className="text-lg font-medium">Agregar producto</h3>
      <form onSubmit={submit} className="mt-3 space-y-3">
        <div>
          <label className="text-sm">Nombre</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm">Precio</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm">Categoría</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm">
            <option value="móviles">móviles</option>
            <option value="accesorios">accesorios</option>
          </select>
        </div>
        <div>
          <label className="text-sm">Imagen (URL)</label>
          <input value={image} onChange={(e) => setImage(e.target.value)} className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm" placeholder="https://..." />
        </div>
        <div>
          <label className="text-sm">Stock</label>
          <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm" />
        </div>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <div>
          <Button type="submit">Agregar producto</Button>
        </div>
      </form>
    </div>
  );
}
