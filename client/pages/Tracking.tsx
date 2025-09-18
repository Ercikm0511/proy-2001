import { useState } from "react";

export default function Tracking() {
  const [name, setName] = useState("");
  const [doc, setDoc] = useState("");
  const [guide, setGuide] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!name.trim() || !doc.trim() || !guide.trim()) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/rastreo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: name.trim(), documento: doc.trim(), guiaFactura: guide.trim() }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "No encontrado");
      setResult(j);
    } catch (err: any) {
      setError(err.message || "Los datos ingresados no corresponden a un pedido o reparación válida.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-xl border bg-muted/50 p-6 shadow">
        <h1 className="mb-4 text-xl font-semibold">Seguimiento de pedido / reparación</h1>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm">Nombre y Apellido</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
              placeholder="Tu nombre completo"
              required
            />
          </div>
          <div>
            <label className="text-sm">Número de Documento</label>
            <input
              value={doc}
              onChange={(e) => setDoc(e.target.value)}
              className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
              placeholder="CC / DNI / Pasaporte"
              required
            />
          </div>
          <div>
            <label className="text-sm">Número de Guía o Factura</label>
            <input
              value={guide}
              onChange={(e) => setGuide(e.target.value)}
              className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
              placeholder="Ej: FAC-00123 / GUIA-ABC"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow disabled:opacity-50"
          >
            {loading ? "Buscando..." : "Rastrear ahora"}
          </button>
        </form>
        {result && (
          <div className="mt-4 rounded-xl border p-4">
            <h4 className="text-sm font-semibold">Resultado</h4>
            <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Tipo</span>
                <p className="font-medium">{result.tipo}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha</span>
                <p className="font-medium">{new Date(result.fecha).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Estado</span>
                <p className="font-medium">{result.estado}</p>
              </div>
              {result.estimado && (
                <div>
                  <span className="text-muted-foreground">Estimación</span>
                  <p className="font-medium">{result.estimado}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
