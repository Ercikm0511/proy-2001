import useEmblaCarousel from "embla-carousel-react";
import { PropsWithChildren, useCallback } from "react";

export type EmblaProps = PropsWithChildren<{
  autoplayMs?: number;
}>;

export default function EmblaCarousel({ children, autoplayMs = 4500 }: EmblaProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const onMouseEnter = useCallback(() => {
    const timer = (emblaApi as any)?._autoplayTimer as number | undefined;
    if (timer) window.clearInterval(timer);
  }, [emblaApi]);

  const onMouseLeave = useCallback(() => {
    if (!emblaApi) return;
    (emblaApi as any)._autoplayTimer = window.setInterval(() => {
      emblaApi && emblaApi.scrollNext();
    }, autoplayMs);
  }, [emblaApi, autoplayMs]);

  return (
    <div ref={emblaRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="overflow-hidden">
      <div className="flex">
        {children}
      </div>
    </div>
  );
}
