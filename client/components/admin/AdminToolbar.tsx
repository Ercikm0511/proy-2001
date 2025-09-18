import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AdminToolbar({
  currentTab,
  onTabChange,
  onAddClick,
  onTogglePreview,
  showPreview,
}: {
  currentTab: "inventory" | "store";
  onTabChange: (t: "inventory" | "store") => void;
  onAddClick: () => void;
  onTogglePreview: () => void;
  showPreview: boolean;
}) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  return (
    <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur py-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              className={`rounded-md px-3 py-1 ${currentTab === "inventory" ? "bg-primary text-primary-foreground" : "border"}`}
              onClick={() => onTabChange("inventory")}
            >
              Inventario
            </button>
            <button
              className={`rounded-md px-3 py-1 ${currentTab === "store" ? "bg-primary text-primary-foreground" : "border"}`}
              onClick={() => onTabChange("store")}
            >
              Tienda
            </button>
          </div>

          <Button size="sm" onClick={onAddClick}>Agregar producto</Button>

          <Button size="sm" variant="outline" onClick={() => navigate("/tienda")}>Ver tienda</Button>

          <Button size="sm" variant="ghost" onClick={onTogglePreview}>
            {showPreview ? "Ocultar preview" : "Mostrar preview"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => alert("Función de importar/exportar no implementada")}>Import/Export</Button>
          <Button size="sm" variant="ghost" onClick={() => navigate("/admin/users")}>Usuarios</Button>

          <Button size="sm" variant="destructive" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
