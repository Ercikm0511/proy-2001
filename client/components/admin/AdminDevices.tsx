import React, { useMemo, useState } from "react";
import { useDevices } from "@/state/devices";
import { Button } from "@/components/ui/button";

export default function AdminDevices() {
  const { devices, addDevice, removeDevice } = useDevices();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ brand: "", model: "", category: "" });

  const filtered = useMemo(() => devices.filter((d) => d.brand.toLowerCase().includes(query.toLowerCase()) || d.model.toLowerCase().includes(query.toLowerCase())), [devices, query]);

  return (
    <div>
      <h3 className="text-lg font-medium">Dispositivos</h3>
      <p className="text-xs text-muted-foreground">Marcas y modelos registrados.</p>
      <div className="mt-3 flex gap-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar marca o modelo..." className="rounded-xl border bg-background px-3 py-2 text-sm" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <form onSubmit={(e) => { e.preventDefault(); if (!form.brand || !form.model) return; addDevice({ brand: form.brand, model: form.model, category: form.category }); setForm({ brand: "", model: "", category: "" }); }} className="space-y-2">
            <input placeholder="Marca" value={form.brand} onChange={(e) => setForm((s) => ({ ...s, brand: e.target.value }))} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
            <input placeholder="Modelo" value={form.model} onChange={(e) => setForm((s) => ({ ...s, model: e.target.value }))} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
            <input placeholder="Categoría" value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
            <div className="flex gap-2">
              <Button type="submit">Agregar</Button>
            </div>
          </form>
        </div>

        <div>
          <div className="space-y-2">
            {filtered.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <div className="font-medium">{d.brand} {d.model}</div>
                  <div className="text-xs text-muted-foreground">{d.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => removeDevice(d.id)}>Eliminar</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
