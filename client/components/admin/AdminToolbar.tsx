import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Menu, Smartphone, Moon, Sun, ShoppingCart } from "lucide-react";
import { useState } from "react";

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
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all bg-background/80 backdrop-blur")}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <a href="/admin-login" aria-label="Abrir inicio de sesión" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Smartphone className="h-5 w-5" />
          </a>
          <button onClick={() => (window.location.href = "/")} className="text-lg font-semibold tracking-tight" aria-label="Ir al menú principal">
            M’E Store
          </button>

          <nav className="hidden ml-6 items-center gap-4 md:flex">
            <button className={cn("rounded-md px-3 py-1", currentTab === "inventory" ? "bg-primary text-primary-foreground" : "border")} onClick={() => onTabChange("inventory")}>
              Inventario
            </button>
            <button className={cn("rounded-md px-3 py-1", currentTab === "store" ? "bg-primary text-primary-foreground" : "border")} onClick={() => onTabChange("store")}>
              Tienda
            </button>
          </nav>

          <div className="ml-4 hidden md:block">
            <Button size="sm" onClick={onAddClick}>Agregar producto</Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} aria-label="Cambiar tema" className="rounded-full border bg-background/60 p-2 text-muted-foreground transition hover:text-foreground">
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>


          <div className="hidden md:flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => alert("Función de importar/exportar no implementada")}>Import/Export</Button>
            <Button size="sm" variant="destructive" onClick={logout}>Cerrar sesión</Button>
          </div>

          <button className="md:hidden" aria-label="Abrir menú" onClick={() => setOpen((v) => !v)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden">
          <div className="glass mx-4 mb-4 space-y-2 rounded-xl p-4">
            <a onClick={() => setOpen(false)} href="#servicios" className="block text-sm">Servicios</a>
            <a onClick={() => setOpen(false)} href="#galeria" className="block text-sm">Galería</a>
            <a onClick={() => setOpen(false)} href="#testimonios" className="block text-sm">Testimonios</a>
            <a onClick={() => setOpen(false)} href="#contacto" className="block text-sm">Contacto</a>
            <Link onClick={() => setOpen(false)} to="/seguimiento" className="block text-sm">Seguimiento</Link>
            <Button className="w-full mt-2" asChild>
              <a href="#contacto">Agenda tu reparación</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
