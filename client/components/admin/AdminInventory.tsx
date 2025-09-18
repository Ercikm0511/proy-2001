import React, { useState } from "react";
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
      <h3 className="text-sm font-medium">Agregar producto</h3>
      <form onSubmit={submit} className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="col-span-1">
          <label className="text-xs">Nombre</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border bg-background px-2 py-2 text-sm" />
        </div>
        <div className="col-span-1">
          <label className="text-xs">Precio</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 w-full rounded-lg border bg-background px-2 py-2 text-sm" />
        </div>
        <div className="col-span-1">
          <label className="text-xs">Categoría</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="mt-1 w-full rounded-lg border bg-background px-2 py-2 text-sm">
            <option value="móviles">móviles</option>
            <option value="accesorios">accesorios</option>
          </select>
        </div>
        <div className="col-span-1">
          <label className="text-xs">Stock</label>
          <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="mt-1 w-full rounded-lg border bg-background px-2 py-2 text-sm" />
        </div>
        <div className="col-span-2">
          <label className="text-xs">Imagen (URL)</label>
          <input value={image} onChange={(e) => setImage(e.target.value)} className="mt-1 w-full rounded-lg border bg-background px-2 py-2 text-sm" placeholder="https://..." />
        </div>
        {msg && <p className="text-xs text-muted-foreground col-span-2">{msg}</p>}
        <div className="col-span-2 flex justify-end">
          <Button type="submit" size="sm">Agregar</Button>
        </div>
      </form>
    </div>
  );
}
