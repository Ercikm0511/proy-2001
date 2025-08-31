import { Facebook, Instagram, Phone, ShieldCheck } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M168.1 32c8.6 14.4 22.4 26.1 39.9 30.7v33.2c-14.7-1-28.5-5.7-40.8-13.1v55.2c0 34.8-28.2 63-63 63s-63-28.2-63-63 28.2-63 63-63c3.1 0 6.1.2 9.1.7v33.9a29.5 29.5 0 0 0-9.1-1.4c-16.2 0-29.3 13.1-29.3 29.3s13.1 29.3 29.3 29.3 29.3-13.1 29.3-29.3V32h34.6z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-4 md:px-6">
        <div>
          <h3 className="text-lg font-semibold">M’E Store</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Tecnología premium a tu alcance: reparación profesional, venta de
            equipos móviles certificados y accesorios de la mas alta calidad.
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
            <a aria-label="TikTok" href="#" className="hover:text-foreground">
              <TikTokIcon className="h-5 w-5" />
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
