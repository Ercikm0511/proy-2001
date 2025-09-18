import React, { useMemo, useState } from "react";
import { useClients, Client } from "@/state/clients";
import { Button } from "@/components/ui/button";

export default function AdminClients() {
  const { clients, addClient, updateClient, removeClient } = useClients();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return clients.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || (c.email || "").toLowerCase().includes(query.toLowerCase()) || (c.phone || "").includes(query));
  }, [clients, query]);

  const [form, setForm] = useState<Partial<Client>>({});

  return (
    <div>
      <h3 className="text-lg font-medium">Clientes</h3>
      <p className="text-xs text-muted-foreground">Registrar y gestionar clientes.</p>
      <div className="mt-3 flex gap-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar clientes..." className="rounded-xl border bg-background px-3 py-2 text-sm" />
        <Button onClick={() => setForm({})} size="sm">Nuevo cliente</Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <form onSubmit={(e) => { e.preventDefault(); if (!form.name) return; if (editing) { updateClient(editing, form as any); setEditing(null); } else { addClient(form as any); } setForm({}); }} className="space-y-2">
            <input placeholder="Nombre" value={form.name || ""} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
            <input placeholder="Documento" value={form.document || ""} onChange={(e) => setForm((s) => ({ ...s, document: e.target.value }))} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
            <input placeholder="Correo" value={form.email || ""} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
            <input placeholder="Teléfono" value={form.phone || ""} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
            <input placeholder="Dirección" value={form.address || ""} onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
            <textarea placeholder="Observaciones" value={form.notes || ""} onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))} className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
            <div className="flex gap-2">
              <Button type="submit">{editing ? "Guardar" : "Agregar"}</Button>
              {editing && <Button variant="outline" onClick={() => { setEditing(null); setForm({}); }}>Cancelar</Button>}
            </div>
          </form>
        </div>

        <div>
          <div className="space-y-2">
            {filtered.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.email} • {c.phone}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => { setEditing(c.id); setForm(c); }}>Editar</Button>
                  <Button size="sm" variant="outline" onClick={() => removeClient(c.id)}>Eliminar</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
