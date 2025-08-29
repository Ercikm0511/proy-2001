import useEmblaCarousel from "embla-carousel-react";
import { PropsWithChildren, useCallback, useEffect } from "react";

export type EmblaProps = PropsWithChildren<{
  autoplayMs?: number;
}>;

export default function EmblaCarousel({ children, autoplayMs = 4500 }: EmblaProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const start = useCallback(() => {
    if (!emblaApi) return;
    const anyApi = emblaApi as any;
    if (anyApi._autoplayTimer) clearInterval(anyApi._autoplayTimer);
    anyApi._autoplayTimer = window.setInterval(() => {
      emblaApi && emblaApi.scrollNext();
    }, autoplayMs);
  }, [emblaApi, autoplayMs]);

  const stop = useCallback(() => {
    const anyApi = emblaApi as any;
    if (anyApi && anyApi._autoplayTimer) clearInterval(anyApi._autoplayTimer);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    start();
    return () => stop();
  }, [emblaApi, start, stop]);

  return (
    <div ref={emblaRef} onMouseEnter={stop} onMouseLeave={start} className="overflow-hidden">
      <div className="flex">
        {children}
      </div>
    </div>
  );
}
