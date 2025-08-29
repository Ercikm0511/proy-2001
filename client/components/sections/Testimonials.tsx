import EmblaCarousel from "@/components/common/EmblaCarousel";
import { Star } from "lucide-react";

const items = [
  {
    name: "Laura G.",
    text: "Servicio rapidísimo y con garantía. Mi iPhone quedó como nuevo.",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&h=200&auto=format&fit=crop&crop=faces&grayscale",
  },
  {
    name: "Carlos M.",
    text: "Excelente atención y productos originales. 100% recomendados.",
    img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&h=200&auto=format&fit=crop&crop=faces&grayscale",
  },
  {
    name: "Ana P.",
    text: "Encontré el accesorio perfecto y me asesoraron increíble.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop&crop=faces&grayscale",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <h2 className="text-2xl font-semibold tracking-tight">Testimonios</h2>
      <div className="mt-6">
        <EmblaCarousel>
          {items.map((t) => (
            <div key={t.name} className="min-w-full px-1 sm:min-w-[50%] lg:min-w-[33.333%]">
              <div className="mr-4 rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
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
