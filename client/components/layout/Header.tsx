import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        <a href="#top" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Smartphone className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">M’E Store</span>
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#servicios" className="text-sm text-muted-foreground hover:text-foreground">Servicios</a>
          <a href="#galeria" className="text-sm text-muted-foreground hover:text-foreground">Galería</a>
          <a href="#inventario" className="text-sm text-muted-foreground hover:text-foreground">Inventario</a>
          <a href="#testimonios" className="text-sm text-muted-foreground hover:text-foreground">Testimonios</a>
          <a href="#contacto" className="text-sm text-muted-foreground hover:text-foreground">Contacto</a>
        </nav>
        <div className="hidden md:block">
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
            <a onClick={() => setOpen(false)} href="#servicios" className="block text-sm">Servicios</a>
            <a onClick={() => setOpen(false)} href="#galeria" className="block text-sm">Galería</a>
            <a onClick={() => setOpen(false)} href="#inventario" className="block text-sm">Inventario</a>
            <a onClick={() => setOpen(false)} href="#testimonios" className="block text-sm">Testimonios</a>
            <a onClick={() => setOpen(false)} href="#contacto" className="block text-sm">Contacto</a>
            <Button className="w-full mt-2" asChild>
              <a href="#contacto">Agenda tu reparación</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
