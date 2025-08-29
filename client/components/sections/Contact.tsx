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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60118.65234323572!2d-99.2410845089997!3d19.43260773484456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff36f23d5799%3A0xdefd41e4b18a2393!2sPolanco%2C%20Mexico%20City!5e0!3m2!1sen!2smx!4v1700000000000!5m2!1sen!2smx"
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
