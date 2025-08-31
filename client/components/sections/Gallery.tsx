import EmblaCarousel from "@/components/common/EmblaCarousel";

type Slide = { type: "image" | "video"; src: string; alt?: string };

const slides: Slide[] = [
  { type: "image", src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop", alt: "Reparación experta" },
  { type: "video", src: "https://cdn.builder.io/o/assets%2F413c7c3972b24a46a4ba370035b392a8%2Ffbc348b8a72540a69038e46bae89f03d?alt=media&token=edf1a23b-e6ec-4144-83b2-ddebfecd2830&apiKey=413c7c3972b24a46a4ba370035b392a8" },
  { type: "image", src: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop", alt: "Móviles destacados" },
];

export default function Gallery() {
  return (
    <section id="galeria" className="relative mt-6">
      <EmblaCarousel>
        {slides.map((s) => (
          <div key={s.src} className="relative min-w-full">
            {s.type === "image" ? (
              <img src={s.src} alt={s.alt} className="h-[60vh] w-full object-cover md:h-[70vh]" loading="lazy" />
            ) : (
              <video src={s.src} className="h-[60vh] w-full object-cover md:h-[70vh]" autoPlay loop muted playsInline />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
        ))}
      </EmblaCarousel>
    </section>
  );
}
