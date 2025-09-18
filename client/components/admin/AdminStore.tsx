import { useInventory } from "@/state/inventory";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminStore() {
  const { products, updateStock, removeProduct } = useInventory();
  const [editing, setEditing] = useState<Record<string, number>>({});

  return (
    <div>
      <h3 className="text-lg font-medium">Tienda (sincronizada con inventario)</h3>
      <p className="text-xs text-muted-foreground">Aquí puedes ver y ajustar el stock que se muestra en la tienda.</p>
      <div className="mt-3 space-y-3">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <img src={p.image} alt={p.name} className="h-12 w-12 rounded-md object-cover" />
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.category} • ${p.price.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editing[p.id] ?? p.stock}
                onChange={(e) => setEditing((s) => ({ ...s, [p.id]: Number(e.target.value) }))}
                className="w-20 rounded-xl border bg-background px-3 py-2 text-sm"
              />
              <Button
                onClick={() => {
                  const qty = editing[p.id];
                  if (typeof qty === "number") updateStock(p.id, Math.max(0, Math.floor(qty)));
                  setEditing((s) => ({ ...s, [p.id]: undefined }));
                }}
                size="sm"
              >
                Guardar
              </Button>
              <Button size="sm" variant="outline" onClick={() => removeProduct(p.id)}>
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
