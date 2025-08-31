import EmblaCarousel from "@/components/common/EmblaCarousel";

type Slide = { type: "image" | "video"; src: string; alt?: string };

const slides: Slide[] = [
  { type: "video", src: "https://cdn.builder.io/o/assets%2F413c7c3972b24a46a4ba370035b392a8%2Ff735aac2d28c41618d5e031bcc80b1ef?alt=media&token=3e577a18-981d-4a46-ab49-eb38f2abac38&apiKey=413c7c3972b24a46a4ba370035b392a8" },
  { type: "video", src: "https://cdn.builder.io/o/assets%2F413c7c3972b24a46a4ba370035b392a8%2Ffbc348b8a72540a69038e46bae89f03d?alt=media&token=edf1a23b-e6ec-4144-83b2-ddebfecd2830&apiKey=413c7c3972b24a46a4ba370035b392a8" },
  { type: "video", src: "https://cdn.builder.io/o/assets%2F413c7c3972b24a46a4ba370035b392a8%2Fd6d49f6f1ad645d6a25ea66b91127033?alt=media&token=0add7b54-df2c-4e9c-a4b3-4707f0cae1ce&apiKey=413c7c3972b24a46a4ba370035b392a8" },
  { type: "video", src: "https://cdn.builder.io/o/assets%2F413c7c3972b24a46a4ba370035b392a8%2F585eef70fb194314bd0a97c510e0443f?alt=media&token=8afccf9a-d0ee-4b39-920d-ea89833b3407&apiKey=413c7c3972b24a46a4ba370035b392a8" },
  { type: "video", src: "https://cdn.builder.io/o/assets%2F413c7c3972b24a46a4ba370035b392a8%2F9b82adb204414b66b24064f2cf0c028e?alt=media&token=4c83a8c2-bbd9-4729-8626-0d27aafef21d&apiKey=413c7c3972b24a46a4ba370035b392a8" },
];

export default function Gallery() {
  return (
    <section id="galeria" className="relative mt-6">
      <EmblaCarousel autoByVideo autoplayMs={4500}>
        {slides.map((s) => (
          <div key={s.src} className="relative min-w-full">
            {s.type === "image" ? (
              <img src={s.src} alt={s.alt} className="h-[80vh] w-full object-cover md:h-[90vh]" loading="eager" fetchPriority="high" decoding="async" />
            ) : (
              <video src={s.src} className="h-[80vh] w-full object-cover md:h-[90vh]" autoPlay muted playsInline preload="auto" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        ))}
      </EmblaCarousel>
    </section>
  );
}
