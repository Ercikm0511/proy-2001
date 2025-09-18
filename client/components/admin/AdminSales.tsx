import React, { useMemo, useState } from "react";
import { useSales } from "@/state/sales";
import { Button } from "@/components/ui/button";

export default function AdminSales() {
  const { sales, addSale, removeSale } = useSales();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => sales.filter(s => s.items.some(i => i.name.toLowerCase().includes(query.toLowerCase()))), [sales, query]);

  return (
    <div>
      <h3 className="text-lg font-medium">Ventas</h3>
      <p className="text-xs text-muted-foreground">Historial de ventas e informes básicos.</p>
      <div className="mt-3 flex gap-3">
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar producto en ventas..." className="rounded-xl border bg-background px-3 py-2 text-sm" />
      </div>

      <div className="mt-4 space-y-3">
        {filtered.map(s => (
          <div key={s.id} className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{new Date(s.createdAt).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total: ${s.total.toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => removeSale(s.id)}>Eliminar</Button>
              </div>
            </div>
            <div className="mt-2 text-sm">
              {s.items.map(it => (
                <div key={it.productId} className="flex items-center justify-between">
                  <div>{it.name} x{it.qty}</div>
                  <div>${(it.price * it.qty).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
