import { useInventory } from "@/state/inventory";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useInventory, Product } from "@/state/inventory";

export default function AdminStore() {
  const { products, updateStock, removeProduct, updateProduct } = useInventory();
  const [editingStock, setEditingStock] = useState<Record<string, number>>({});
  const [editingData, setEditingData] = useState<Record<string, Partial<Product>>>({});

  return (
    <div>
      <h3 className="text-lg font-medium">Tienda (sincronizada con inventario)</h3>
      <p className="text-xs text-muted-foreground">Aquí puedes ver y ajustar el stock y los detalles de los productos.</p>
      <div className="mt-3 space-y-3">
        {products.map((p) => {
          const edit = editingData[p.id];
          return (
            <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <img src={(edit && edit.image) || p.image} alt={p.name} className="h-12 w-12 rounded-md object-cover" />
                <div className="w-[320px]">
                  {edit ? (
                    <>
                      <input className="w-full rounded-xl border bg-background px-2 py-1 text-sm" value={edit.name ?? p.name} onChange={(e) => setEditingData((s) => ({ ...s, [p.id]: { ...(s[p.id] || {}), name: e.target.value } }))} />
                      <div className="mt-1 flex gap-2">
                        <input type="number" className="w-24 rounded-xl border bg-background px-2 py-1 text-sm" value={edit.price ?? p.price} onChange={(e) => setEditingData((s) => ({ ...s, [p.id]: { ...(s[p.id] || {}), price: Number(e.target.value) } }))} />
                        <select className="rounded-xl border bg-background px-2 py-1 text-sm" value={edit.category ?? p.category} onChange={(e) => setEditingData((s) => ({ ...s, [p.id]: { ...(s[p.id] || {}), category: e.target.value as any } }))}>
                          <option value="móviles">móviles</option>
                          <option value="accesorios">accesorios</option>
                        </select>
                      </div>
                      <input className="mt-1 w-full rounded-xl border bg-background px-2 py-1 text-sm" placeholder="Imagen URL" value={edit.image ?? p.image} onChange={(e) => setEditingData((s) => ({ ...s, [p.id]: { ...(s[p.id] || {}), image: e.target.value } }))} />
                    </>
                  ) : (
                    <>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.category} • ${p.price.toLocaleString()}</div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editingStock[p.id] ?? p.stock}
                  onChange={(e) => setEditingStock((s) => ({ ...s, [p.id]: Number(e.target.value) }))}
                  className="w-20 rounded-xl border bg-background px-3 py-2 text-sm"
                />

                {edit ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => {
                        const patch = editingData[p.id] || {};
                        if (typeof editingStock[p.id] === "number") patch.stock = Math.max(0, Math.floor(editingStock[p.id]!));
                        updateProduct(p.id, patch as Partial<Omit<Product, "id">>);
                        setEditingData((s) => ({ ...s, [p.id]: undefined }));
                        setEditingStock((s) => ({ ...s, [p.id]: undefined }));
                      }}
                    >
                      Guardar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingData((s) => ({ ...s, [p.id]: undefined }))}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" onClick={() => setEditingData((s) => ({ ...s, [p.id]: { name: p.name, price: p.price, category: p.category, image: p.image } }))}>
                      Editar
                    </Button>
                    <Button
                      onClick={() => {
                        const qty = editingStock[p.id];
                        if (typeof qty === "number") updateStock(p.id, Math.max(0, Math.floor(qty)));
                        setEditingStock((s) => ({ ...s, [p.id]: undefined }));
                      }}
                      size="sm"
                    >
                      Guardar stock
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => removeProduct(p.id)}>
                      Eliminar
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
