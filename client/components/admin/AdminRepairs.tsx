import React, { useMemo, useState } from "react";
import { useRepairs } from "@/state/repairs";
import { useClients } from "@/state/clients";
import { Button } from "@/components/ui/button";

export default function AdminRepairs() {
  const { repairs, addRepair, updateRepair, removeRepair } = useRepairs();
  const { clients } = useClients();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<any>({ clientId: "", device: "", description: "", parts: "", price: 0 });

  const filtered = useMemo(() => repairs.filter((r) => (r.device || "").toLowerCase().includes(query.toLowerCase())), [repairs, query]);

  return (
    <div>
      <h3 className="text-lg font-medium">Reparaciones</h3>
      <p className="text-xs text-muted-foreground">Registro y seguimiento de reparaciones.</p>
      <div className="mt-3 flex gap-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por dispositivo..." className="rounded-xl border bg-background px-3 py-2 text-sm" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <form onSubmit={(e) => { e.preventDefault(); if (!form.device) return; addRepair({ clientId: form.clientId || undefined, device: form.device, description: form.description, parts: form.parts ? form.parts.split(",").map((s:string)=>s.trim()) : [], price: Number(form.price) }); setForm({ clientId: "", device: "", description: "", parts: "", price: 0 }); }} className="space-y-2">
            <select value={form.clientId} onChange={(e)=>setForm((s:any)=>({...s, clientId:e.target.value}))} className="w-full rounded-xl border bg-background px-3 py-2 text-sm">
              <option value="">Sin cliente</option>
              {clients.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Dispositivo" value={form.device} onChange={(e)=>setForm((s:any)=>({...s, device:e.target.value}))} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
            <input placeholder="Descripción" value={form.description} onChange={(e)=>setForm((s:any)=>({...s, description:e.target.value}))} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
            <input placeholder="Repuestos (coma separado)" value={form.parts} onChange={(e)=>setForm((s:any)=>({...s, parts:e.target.value}))} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
            <input placeholder="Valor servicio" type="number" value={form.price} onChange={(e)=>setForm((s:any)=>({...s, price:Number(e.target.value)}))} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
            <div className="flex gap-2"><Button type="submit">Agregar reparación</Button></div>
          </form>
        </div>

        <div>
          <div className="space-y-2">
            {filtered.map(r=> (
              <div key={r.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.device} • <span className="text-xs text-muted-foreground">{r.status}</span></div>
                    <div className="text-xs text-muted-foreground">{r.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={()=> updateRepair(r.id,{ status: r.status === 'pendiente' ? 'en proceso' : r.status === 'en proceso' ? 'finalizado' : 'finalizado' })}>Avanzar estado</Button>
                    <Button size="sm" variant="outline" onClick={()=> removeRepair(r.id)}>Eliminar</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
