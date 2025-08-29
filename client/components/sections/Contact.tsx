import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const waMessage = encodeURIComponent(
    `Hola M’E Store, soy ${name || "cliente"}. Tel: ${phone || ""}. ${message || "Quiero más información."}`,
  );

  return (
    <section id="contacto" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border">
          <iframe
            title="Ubicación M’E Store"
            src="https://www.google.com/maps?q=Cra.+81+%2343-72,+Local+1158+Laureles+-+Estadio,+Medell%C3%ADn,+Laureles,+Medell%C3%ADn,+Antioquia&output=embed"
            width="100%"
            height="380"
            loading="lazy"
            style={{ border: 0 }}
            allowFullScreen
          />
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Contacto rápido</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Envíanos un mensaje y te responderemos a la brevedad.
          </p>
          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(`https://wa.me/?text=${waMessage}`, "_blank");
            }}
          >
            <div>
              <label className="text-sm">Nombre</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
                required
              />
            </div>
            <div>
              <label className="text-sm">Teléfono</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
              />
            </div>
            <div>
              <label className="text-sm">Mensaje</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 h-24 w-full resize-none rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="shine-on-hover btn-glow">
                Enviar por WhatsApp
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:contacto@me-store.com">Enviar por correo</a>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
