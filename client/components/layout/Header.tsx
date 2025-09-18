import { cn } from "@/lib/utils";
import { Menu, Smartphone, Moon, Sun, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/state/cart";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Props = { theme: "light" | "dark"; onToggleTheme: () => void };

export default function Header({ theme, onToggleTheme }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items, setOpen: setCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all",
        scrolled ? "glass" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <Link
            to="/admin-login"
            aria-label="Abrir inicio de sesión"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <Smartphone className="h-5 w-5" />
          </Link>
          <Link to="/" aria-label="Inicio" className="text-lg font-semibold tracking-tight">
            <span className="sr-only">Inicio</span>
          </Link>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#servicios"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Servicios
          </a>
          <a
            href="#galeria"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Galería
          </a>
          <Link to="/tienda" className="text-sm text-muted-foreground hover:text-foreground">
            Tienda
          </Link>
          <a
            href="#testimonios"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Testimonios
          </a>
          <Link to="/seguimiento" className="text-sm text-muted-foreground transition hover:text-foreground">
            Seguimiento
          </Link>
          <a
            href="#contacto"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Contacto
          </a>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={onToggleTheme}
            aria-label="Cambiar tema"
            className="rounded-full border bg-background/60 p-2 text-muted-foreground transition hover:text-foreground"
          >
            {theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Abrir carrito"
            className="relative rounded-full border bg-background/60 p-2 text-muted-foreground transition hover:text-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
            {items.length > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                {items.length}
              </span>
            )}
          </button>
          <Button className="shine-on-hover btn-glow" asChild>
            <a href="#contacto">Agenda tu reparación</a>
          </Button>
        </div>
        <button
          className="md:hidden"
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {open && (
        <div className="md:hidden">
          <div className="glass mx-4 mb-4 space-y-2 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Modo {theme === "dark" ? "Noche" : "Día"}</span>
              <button
                onClick={() => {
                  onToggleTheme();
                  setOpen(false);
                }}
                aria-label="Cambiar tema"
                className="rounded-full border bg-background/60 p-2 text-muted-foreground"
              >
                {theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </button>
            </div>
            <a onClick={() => setOpen(false)} href="#servicios" className="block text-sm">
              Servicios
            </a>
            <a onClick={() => setOpen(false)} href="#galeria" className="block text-sm">
              Galería
            </a>
            <Link onClick={() => setOpen(false)} to="/tienda" className="block text-sm">
              Tienda
            </Link>
            <a onClick={() => setOpen(false)} href="#testimonios" className="block text-sm">
              Testimonios
            </a>
            <a onClick={() => setOpen(false)} href="#contacto" className="block text-sm">
              Contacto
            </a>
            <Link onClick={() => setOpen(false)} to="/seguimiento" className="block text-sm">
              Seguimiento
            </Link>
            <Button className="w-full mt-2" asChild>
              <a href="#contacto">Agenda tu reparación</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
