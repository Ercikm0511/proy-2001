import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, Smartphone, Moon, Sun, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/state/cart";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = { theme: "light" | "dark"; onToggleTheme: () => void };

export default function Header({ theme, onToggleTheme }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
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
          <button
            onClick={() => setLoginOpen(true)}
            aria-label="Abrir inicio de sesión"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <Smartphone className="h-5 w-5" />
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="text-lg font-semibold tracking-tight"
          >
            M’E Store
          </button>
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
          <a
            href="/tienda"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Tienda
          </a>
          <a
            href="#testimonios"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Testimonios
          </a>
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
      {/* Login Modal */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Iniciar Sesión (Administración)</DialogTitle>
          </DialogHeader>
          <LoginForm
            onSuccess={() => {
              setLoginOpen(false);
              navigate("/admin");
            }}
          />
        </DialogContent>
      </Dialog>

      {open && (
        <div className="md:hidden">
          <div className="glass mx-4 mb-4 space-y-2 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                Modo {theme === "dark" ? "Noche" : "Día"}
              </span>
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
            <a
              onClick={() => setOpen(false)}
              href="#servicios"
              className="block text-sm"
            >
              Servicios
            </a>
            <a
              onClick={() => setOpen(false)}
              href="#galeria"
              className="block text-sm"
            >
              Galería
            </a>
            <a
              onClick={() => setOpen(false)}
              href="/tienda"
              className="block text-sm"
            >
              Tienda
            </a>
            <a
              onClick={() => setOpen(false)}
              href="#testimonios"
              className="block text-sm"
            >
              Testimonios
            </a>
            <a
              onClick={() => setOpen(false)}
              href="#contacto"
              className="block text-sm"
            >
              Contacto
            </a>
            <button
              onClick={() => {
                setCartOpen(true);
                setOpen(false);
              }}
              className="mt-2 w-full rounded-lg border p-2 text-sm"
            >
              Ver carrito
            </button>
            <Button className="w-full mt-2" asChild>
              <a href="#contacto">Agenda tu reparación</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (email === "Mestore1204@gmail.com" && pass === "St0r3.1204") {
          localStorage.setItem("isAdmin", "true");
          setError(null);
          onSuccess();
        } else {
          setError("Credenciales inválidas");
        }
      }}
    >
      <div>
        <label className="text-sm">Correo</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
          required
        />
      </div>
      <div>
        <label className="text-sm">Contraseña</label>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
          required
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" className="w-full">
        Entrar
      </Button>
      <p className="text-xs text-muted-foreground">
        Acceso administrativo. No compartas estas credenciales.
      </p>
    </form>
  );
}
