import React, { useEffect, useState, useRef } from "react";
import Services from "@/components/sections/Services";
import Inventory from "@/components/sections/Inventory";
import AdminInventory from "@/components/admin/AdminInventory";
import AdminStore from "@/components/admin/AdminStore";
import AdminToolbar from "@/components/admin/AdminToolbar";
import AdminClients from "@/components/admin/AdminClients";
import AdminDevices from "@/components/admin/AdminDevices";
import AdminRepairs from "@/components/admin/AdminRepairs";
import AdminSales from "@/components/admin/AdminSales";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<"inventory" | "store" | "clients" | "devices" | "repairs" | "sales">("inventory");
  const [showPreview, setShowPreview] = useState(true);
  const inventoryRef = useRef<HTMLDivElement | null>(null);

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
    <div className="mx-auto max-w-7xl px-0 py-4 md:px-0">
      {/* Admin toolbar */}
      <AdminToolbar currentTab={tab} onTabChange={setTab} onTogglePreview={() => setShowPreview((s) => !s)} showPreview={showPreview} />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h1 className="text-xl font-medium">Panel administrativo</h1>
        <p className="mt-1 text-xs text-muted-foreground">Gestión rápida y minimalista — sincronizado con la tienda pública.</p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-background/50 p-3">
            {tab === "inventory" && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Inventario</h2>
                  <span className="text-xs text-muted-foreground">Administrar productos</span>
                </div>
                <div ref={inventoryRef} className="mt-3">
                  <AdminInventory />
                </div>
              </>
            )}

            {tab === "store" && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Tienda</h2>
                  <span className="text-xs text-muted-foreground">Ajustes públicos</span>
                </div>
                <div className="mt-3">
                  <AdminStore />
                </div>
              </>
            )}

            {tab === "clients" && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Clientes</h2>
                  <span className="text-xs text-muted-foreground">Contactos</span>
                </div>
                <div className="mt-3">
                  <AdminClients />
                </div>
              </>
            )}

            {tab === "devices" && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Dispositivos</h2>
                  <span className="text-xs text-muted-foreground">Modelos</span>
                </div>
                <div className="mt-3">
                  <AdminDevices />
                </div>
              </>
            )}

            {tab === "repairs" && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Reparaciones</h2>
                  <span className="text-xs text-muted-foreground">Seguimiento</span>
                </div>
                <div className="mt-3">
                  <AdminRepairs />
                </div>
              </>
            )}

            {tab === "sales" && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Ventas</h2>
                  <span className="text-xs text-muted-foreground">Reportes</span>
                </div>
                <div className="mt-3">
                  <AdminSales />
                </div>
              </>
            )}
          </div>

          {showPreview && (
            <div className="rounded-xl border bg-background/50 p-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">Preview</h2>
                <button className="text-xs text-muted-foreground" onClick={() => setShowPreview(false)}>Ocultar</button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Vista previa del catálogo público.</p>
              <div className="max-h-[60vh] overflow-auto pr-2 mt-3">
                <Inventory />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-xl border bg-background/50 p-3">
          <h2 className="text-sm font-medium">Servicios</h2>
          <p className="text-xs text-muted-foreground">Vista previa inmediata.</p>
          <div className="mt-3">
            <Services />
          </div>
        </div>
      </div>
    </div>
  );
}
