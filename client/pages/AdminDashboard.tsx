import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Services from "@/components/sections/Services";
import Inventory from "@/components/sections/Inventory";

export default function AdminDashboard() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(localStorage.getItem("isAdmin") === "true");
  }, []);
  if (!ok) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 md:px-6">
        <h1 className="text-2xl font-semibold">Acceso restringido</h1>
        <p className="mt-2 text-muted-foreground">Inicia sesión como administrador para ver este panel.</p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Panel Administrativo</h1>
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem("isAdmin");
            window.location.href = "/";
          }}
        >
          Cerrar sesión
        </Button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Puedes previsualizar y gestionar secciones clave. Para cambios avanzados, indícame qué deseas editar.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border p-4">
          <h2 className="text-lg font-semibold">Servicios</h2>
          <p className="text-xs text-muted-foreground">Vista previa inmediata.</p>
          <Services />
        </div>
        <div className="rounded-2xl border p-4">
          <h2 className="text-lg font-semibold">Inventario</h2>
          <p className="text-xs text-muted-foreground">Catálogo actual.</p>
          <div className="max-h-[60vh] overflow-auto pr-2">
            <Inventory />
          </div>
        </div>
      </div>
    </div>
  );
}
