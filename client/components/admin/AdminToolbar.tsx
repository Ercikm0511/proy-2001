import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Menu, Smartphone, Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function AdminToolbar({
  currentTab,
  onTabChange,
  onTogglePreview,
  showPreview,
}: {
  currentTab: "inventory" | "store" | "clients" | "devices" | "repairs" | "sales";
  onTabChange: (t: "inventory" | "store" | "clients" | "devices" | "repairs" | "sales") => void;
  onTogglePreview: () => void;
  showPreview: boolean;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => (typeof window !== "undefined" && (localStorage.getItem("theme") as "light" | "dark")) || "light");

  const logout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      const root = document.documentElement;
      if (next === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
      localStorage.setItem("theme", next);
    } catch (e) {}
  };

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all glass") }>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:px-6">
        <div className="flex items-center gap-2">
          <a href="/admin-login" aria-label="Abrir inicio de sesión" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Smartphone className="h-4 w-4" />
          </a>

          {/* compact nav: smaller buttons that blend into header */}
          <nav className="hidden ml-4 items-center gap-2 md:flex">
            <button className={cn("rounded px-2 py-1 text-sm", currentTab === "inventory" ? "bg-primary text-primary-foreground" : "border/0 text-muted-foreground hover:text-foreground")} onClick={() => onTabChange("inventory")}>
              Inventario
            </button>
            <button className={cn("rounded px-2 py-1 text-sm", currentTab === "store" ? "bg-primary text-primary-foreground" : "border/0 text-muted-foreground hover:text-foreground")} onClick={() => onTabChange("store")}>
              Tienda
            </button>
            <button className={cn("rounded px-2 py-1 text-sm", currentTab === "clients" ? "bg-primary text-primary-foreground" : "border/0 text-muted-foreground hover:text-foreground")} onClick={() => onTabChange("clients")}>
              Clientes
            </button>
            <button className={cn("rounded px-2 py-1 text-sm", currentTab === "devices" ? "bg-primary text-primary-foreground" : "border/0 text-muted-foreground hover:text-foreground")} onClick={() => onTabChange("devices")}>
              Dispositivos
            </button>
            <button className={cn("rounded px-2 py-1 text-sm", currentTab === "repairs" ? "bg-primary text-primary-foreground" : "border/0 text-muted-foreground hover:text-foreground")} onClick={() => onTabChange("repairs")}>
              Reparaciones
            </button>
            <button className={cn("rounded px-2 py-1 text-sm", currentTab === "sales" ? "bg-primary text-primary-foreground" : "border/0 text-muted-foreground hover:text-foreground")} onClick={() => onTabChange("sales")}>
              Ventas
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} aria-label="Cambiar tema" className="rounded-full border bg-background/60 p-2 text-muted-foreground transition hover:text-foreground">
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <div className="hidden md:flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => alert("Función de importar/exportar no implementada")}>
              Import/Export
            </Button>
            <Button size="sm" variant="destructive" onClick={logout}>Cerrar sesión</Button>
          </div>

          <button className="md:hidden" aria-label="Abrir menú" onClick={() => setOpen((v) => !v)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden">
          <div className="glass mx-4 mb-4 space-y-2 rounded-xl p-3">
            <button onClick={() => { onTabChange("clients"); setOpen(false); }} className="block text-sm">Clientes</button>
            <button onClick={() => { onTabChange("devices"); setOpen(false); }} className="block text-sm">Dispositivos</button>
            <button onClick={() => { onTabChange("repairs"); setOpen(false); }} className="block text-sm">Reparaciones</button>
            <button onClick={() => { onTabChange("sales"); setOpen(false); }} className="block text-sm">Ventas</button>
            <Button className="w-full mt-2" asChild>
              <a href="#contacto">Agenda tu reparación</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
