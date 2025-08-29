import { Facebook, Instagram, Phone, ShieldCheck, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-4 md:px-6">
        <div>
          <h3 className="text-lg font-semibold">M’E Store</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Tecnología premium a tu alcance: reparación profesional, móviles
            certificados y accesorios de alta calidad.
          </p>
          <div className="mt-4 flex items-center gap-3 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span className="text-sm">Atención personalizada</span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-sm">Garantía oficial</span>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Empresa</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#sobre" className="hover:text-foreground">
                Sobre nosotros
              </a>
            </li>
            <li>
              <a href="#politicas" className="hover:text-foreground">
                Políticas
              </a>
            </li>
            <li>
              <a href="#soporte" className="hover:text-foreground">
                Soporte
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Servicios</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#servicios" className="hover:text-foreground">
                Reparaciones
              </a>
            </li>
            <li>
              <a href="#tienda" className="hover:text-foreground">
                Móviles
              </a>
            </li>
            <li>
              <a href="#tienda" className="hover:text-foreground">
                Accesorios
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Síguenos</h4>
          <div className="mt-3 flex gap-3 text-muted-foreground">
            <a
              aria-label="Instagram"
              href="https://www.instagram.com/me_store_co"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a aria-label="Twitter" href="#" className="hover:text-foreground">
              <Twitter className="h-5 w-5" />
            </a>
            <a aria-label="Facebook" href="#" className="hover:text-foreground">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl px-4 md:px-6">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} M’E Store. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
