import EmblaCarousel from "@/components/common/EmblaCarousel";

const images = [
  {
    src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop",
    alt: "Reparación experta",
  },
  {
    src: "https://images.unsplash.com/photo-1603366615917-1fa6dad5c4fa?q=80&w=1600&auto=format&fit=crop",
    alt: "Accesorios premium",
  },
  {
    src: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop",
    alt: "Móviles destacados",
  },
];

export default function Gallery() {
  return (
    <section id="galeria" className="relative mt-6">
      <EmblaCarousel>
        {images.map((img) => (
          <div key={img.src} className="relative min-w-full">
            <img
              src={img.src}
              alt={img.alt}
              className="h-[60vh] w-full object-cover md:h-[70vh]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
        ))}
      </EmblaCarousel>
    </section>
  );
}
