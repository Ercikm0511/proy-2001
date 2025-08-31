import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import CommentBox from "@/components/sections/CommentBox";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [brandOpen, setBrandOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [brands, setBrands] = useState<{ name: string; slug: string }[]>([]);
  const [models, setModels] = useState<{ name: string; slug: string }[]>([]);
  const [brand, setBrand] = useState<{ name: string; slug: string } | null>(null);
  const [model, setModel] = useState<{ name: string; slug: string } | null>(null);
  const [brandQuery, setBrandQuery] = useState("");
  const [modelQuery, setModelQuery] = useState("");

  useEffect(() => {
    if (!brandOpen || brands.length) return;
    fetch("/api/phone/brands").then(r => r.json()).then(j => setBrands(j.brands || [])).catch(() => setBrands([]));
  }, [brandOpen, brands.length]);

  useEffect(() => {
    if (!brand) { setModels([]); setModel(null); return; }
    if (!modelOpen) return;
    const url = new URL(window.location.origin + "/api/phone/models");
    url.searchParams.set("brand", brand.slug);
    if (modelQuery) url.searchParams.set("q", modelQuery);
    fetch(url.toString()).then(r => r.json()).then(j => setModels(j.models || [])).catch(() => setModels([]));
  }, [brand, modelOpen, modelQuery]);

  const waMessage = encodeURIComponent(
    `Hola M’E Store, soy ${name || "cliente"}. Tel: ${phone || ""}. Marca: ${brand?.name || ""}. Modelo: ${model?.name || ""}. ${message || "Quiero más información."}`,
  );
  const emailSubject = `Nuevo contacto M’E Store — ${name || "cliente"}`;
  const emailBody = `Nombre: ${name || ""}\nTeléfono: ${phone || ""}\nMarca: ${brand?.name || ""}\nModelo: ${model?.name || ""}\nMensaje: ${message || ""}`;

  const phoneOnChange = (v: string) => setPhone(v.replace(/[^\d]/g, ""));

  return (
    <section id="contacto" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border">
          <div className="flex flex-col">
            <div className="h-48 md:h-64">
              <iframe
                title="Ubicación M’E Store"
                src="https://www.google.com/maps?q=Cra.+81+%2343-72,+Local+1158+Laureles+-+Estadio,+Medell%C3%ADn,+Laureles,+Medell%C3%ADn,+Antioquia&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
            <div className="border-t p-4">
              <h4 className="text-sm font-semibold">Comentarios y/o Sugerencias</h4>
              <p className="mt-1 text-xs text-muted-foreground">Por favor inicia sesión con tu cuenta de Gmail para dejar tu comentario o sugerencia. Tu experiencia nos ayuda a mejorar.</p>
              <CommentBox />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Contacto rápido</h3>
          <p className="mt-1 text-sm text-muted-foreground">Envíanos un mensaje y te responderemos a la brevedad.</p>
          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => { e.preventDefault(); window.open(`https://wa.me/?text=${waMessage}`, "_blank"); }}
          >
            <div>
              <label className="text-sm">Nombre y Apellido</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre y Apellido"
                className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
                required
              />
            </div>
            <div>
              <label className="text-sm">Número de Teléfono</label>
              <input
                value={phone}
                onChange={(e) => phoneOnChange(e.target.value)}
                placeholder="Número de Teléfono"
                inputMode="numeric"
                pattern="\\d+"
                className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
                required
              />
            </div>
            <div>
              <label className="text-sm">Marca de Teléfono</label>
              <Popover open={brandOpen} onOpenChange={setBrandOpen}>
                <PopoverTrigger asChild>
                  <button type="button" className="mt-1 flex w-full items-center justify-between rounded-xl border bg-background px-3 py-2 text-left text-sm">
                    <span>{brand?.name || "Selecciona una marca"}</span>
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[360px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar marca..." value={brandQuery} onValueChange={setBrandQuery} />
                    <CommandList>
                      <CommandEmpty>No se encontraron marcas</CommandEmpty>
                      <CommandGroup>
                        {(brands || []).filter(b => !brandQuery || b.name.toLowerCase().includes(brandQuery.toLowerCase())).map((b) => (
                          <CommandItem key={b.slug} onSelect={() => { setBrand(b); setBrandOpen(false); setModel(null); }}>
                            <Check className={cn("mr-2 h-4 w-4", brand?.slug === b.slug ? "opacity-100" : "opacity-0")} />
                            {b.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm">Modelo de Teléfono</label>
              <Popover open={modelOpen} onOpenChange={setModelOpen}>
                <PopoverTrigger asChild>
                  <button type="button" disabled={!brand} className="mt-1 flex w-full items-center justify-between rounded-xl border bg-background px-3 py-2 text-left text-sm disabled:opacity-50">
                    <span>{model?.name || (brand ? "Selecciona un modelo" : "Primero elige una marca")}</span>
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[360px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar modelo..." value={modelQuery} onValueChange={setModelQuery} />
                    <CommandList>
                      <CommandEmpty>No se encontraron modelos</CommandEmpty>
                      <CommandGroup>
                        {(models || []).map((m) => (
                          <CommandItem key={m.slug} onSelect={() => { setModel(m); setModelOpen(false); }}>
                            <Check className={cn("mr-2 h-4 w-4", model?.slug === m.slug ? "opacity-100" : "opacity-0")} />
                            {m.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm">Mensaje</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Pregunta la cotización de tu reparación"
                className="mt-1 h-24 w-full resize-none rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="shine-on-hover btn-glow">Enviar por WhatsApp</Button>
              <Button variant="outline" asChild>
                <a href={`mailto:mestore1204@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}>
                  Enviar por correo
                </a>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
