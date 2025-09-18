import { useEffect, useState } from "react";
import Services from "@/components/sections/Services";
import Inventory from "@/components/sections/Inventory";
import { Button } from "@/components/ui/button";
import AdminInventory from "@/components/admin/AdminInventory";
import AdminStore from "@/components/admin/AdminStore";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<"inventory" | "store">("inventory");

  useEffect(() => {
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  }, []);

  if (!isAdmin) {
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

      <p className="mt-2 text-sm text-muted-foreground">Puedes previsualizar y gestionar secciones clave. Para cambios avanzados, indícame qué deseas editar.</p>

      <div className="mt-6 flex items-center gap-2">
        <button className={`rounded-md px-3 py-1 ${tab === "inventory" ? "bg-primary text-primary-foreground" : "border"}`} onClick={() => setTab("inventory")}>
          Inventario
        </button>
        <button className={`rounded-md px-3 py-1 ${tab === "store" ? "bg-primary text-primary-foreground" : "border"}`} onClick={() => setTab("store")}>
          Tienda
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border p-4">
          {tab === "inventory" ? (
            <>
              <h2 className="text-lg font-semibold">Administrar Inventario</h2>
              <p className="text-xs text-muted-foreground">Agrega y administra productos en el inventario.</p>
              <div className="mt-4">
                <AdminInventory />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold">Tienda</h2>
              <p className="text-xs text-muted-foreground">Vista y ajustes de la tienda sincronizados con el inventario.</p>
              <div className="mt-4">
                <AdminStore />
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl border p-4">
          <h2 className="text-lg font-semibold">Preview</h2>
          <p className="text-xs text-muted-foreground">Vista previa del catálogo público.</p>
          <div className="max-h-[60vh] overflow-auto pr-2 mt-4">
            <Inventory />
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border p-4">
        <h2 className="text-lg font-semibold">Servicios</h2>
        <p className="text-xs text-muted-foreground">Vista previa inmediata.</p>
        <div className="mt-4">
          <Services />
        </div>
      </div>
    </div>
  );
}
