import EmblaCarousel from "@/components/common/EmblaCarousel";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

type Testimonial = { id: string; name: string; text: string; createdAt: string };

const FALLBACK = [
  { name: "Laura G.", text: "Servicio rapidísimo y con garantía. Mi iPhone quedó como nuevo." },
  { name: "Carlos M.", text: "Excelente atención y productos originales. 100% recomendados." },
  { name: "Ana P.", text: "Encontré el accesorio perfecto y me asesoraron increíble." },
];

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((j) => setItems(j.testimonials || []))
      .catch(() => setItems([]));
  }, []);

  const list = items.length
    ? items
    : FALLBACK.map((f, i) => ({ id: String(i), name: f.name, text: f.text, createdAt: new Date().toISOString() }));

  return (
    <section id="testimonios" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <h2 className="text-2xl font-semibold tracking-tight">Testimonios</h2>
      <div className="mt-6">
        <EmblaCarousel>
          {list.map((t) => (
            <div key={t.id} className="min-w-full px-1 sm:min-w-[50%] lg:min-w-[33.333%]">
              <div className="mr-4 rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <div className="flex text-primary">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{t.text}</p>
              </div>
            </div>
          ))}
        </EmblaCarousel>
      </div>
    </section>
  );
}
