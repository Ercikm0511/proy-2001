import { useEffect, useState } from "react";
import Services from "@/components/sections/Services";
import Inventory from "@/components/sections/Inventory";
import { Button } from "@/components/ui/button";
import AdminInventory from "@/components/admin/AdminInventory";
import AdminStore from "@/components/admin/AdminStore";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<"inventory" | "store">("inventory");
  const [showPreview, setShowPreview] = useState(true);
  const inventoryRef = React.createRef<HTMLDivElement>();

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

  const scrollToInventory = () => {
    if (inventoryRef.current) inventoryRef.current.scrollIntoView({ behavior: "smooth" });
    setTab("inventory");
  };

  return (
    <div className="mx-auto max-w-7xl px-0 py-4 md:px-0">
      {/* Admin toolbar */}
      <AdminToolbar currentTab={tab} onTabChange={setTab} onAddClick={scrollToInventory} onTogglePreview={() => setShowPreview((s) => !s)} showPreview={showPreview} />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h1 className="text-2xl font-semibold">Panel Administrativo</h1>
        <p className="mt-2 text-sm text-muted-foreground">Puedes previsualizar y gestionar secciones clave. Para cambios avanzados, indícame qué deseas editar.</p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border p-4">
            {tab === "inventory" ? (
              <>
                <h2 className="text-lg font-semibold">Administrar Inventario</h2>
                <p className="text-xs text-muted-foreground">Agrega y administra productos en el inventario.</p>
                <div ref={inventoryRef} className="mt-4">
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

          {showPreview && (
            <div className="rounded-2xl border p-4">
              <h2 className="text-lg font-semibold">Preview</h2>
              <p className="text-xs text-muted-foreground">Vista previa del catálogo público.</p>
              <div className="max-h-[60vh] overflow-auto pr-2 mt-4">
                <Inventory />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-2xl border p-4">
          <h2 className="text-lg font-semibold">Servicios</h2>
          <p className="text-xs text-muted-foreground">Vista previa inmediata.</p>
          <div className="mt-4">
            <Services />
          </div>
        </div>
      </div>
    </div>
  );
}
