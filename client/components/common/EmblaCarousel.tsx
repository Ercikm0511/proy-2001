import useEmblaCarousel from "embla-carousel-react";
import { PropsWithChildren, useCallback, useEffect } from "react";

export type EmblaProps = PropsWithChildren<{
  autoplayMs?: number;
  autoByVideo?: boolean;
}>;

export default function EmblaCarousel({
  children,
  autoplayMs = 4500,
  autoByVideo = false,
}: EmblaProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const startTimer = useCallback(() => {
    if (!emblaApi) return;
    const anyApi = emblaApi as any;
    if (anyApi._autoplayTimer) clearInterval(anyApi._autoplayTimer);
    anyApi._autoplayTimer = window.setInterval(() => {
      emblaApi && emblaApi.scrollNext();
    }, autoplayMs);
  }, [emblaApi, autoplayMs]);

  const stopTimer = useCallback(() => {
    const anyApi = emblaApi as any;
    if (anyApi && anyApi._autoplayTimer) clearInterval(anyApi._autoplayTimer);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    if (!autoByVideo) {
      startTimer();
      return () => stopTimer();
    }

    // Auto-advance when current video's natural duration ends
    const onSelect = () => {
      stopTimer();
      const slides = emblaApi.slideNodes();
      const idx = emblaApi.selectedScrollSnap();
      const current = slides[idx] as HTMLElement;

      // Pause all other videos
      slides.forEach((el, i) => {
        if (i !== idx) {
          const vids = el.querySelectorAll("video");
          vids.forEach((v) => {
            try {
              (v as HTMLVideoElement).pause();
            } catch {}
          });
        }
      });

      const video = current.querySelector("video") as HTMLVideoElement | null;
      if (video) {
        // Ensure no loop to respect original duration
        video.loop = false;
        video.muted = true;
        try {
          video.currentTime = 0;
        } catch {}
        video.play().catch(() => {});
        const onEnded = () => {
          video.removeEventListener("ended", onEnded);
          emblaApi.scrollNext();
        };
        video.addEventListener("ended", onEnded);
      } else {
        // Fallback to timer when no video in slide
        startTimer();
      }
    };

    emblaApi.on("select", onSelect);
    // Trigger for initial slide
    onSelect();

    return () => {
      stopTimer();
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, autoByVideo, startTimer, stopTimer]);

  return (
    <div
      ref={emblaRef}
      onMouseEnter={stopTimer}
      onMouseLeave={() => {
        if (!autoByVideo) startTimer();
      }}
      className="overflow-hidden"
    >
      <div className="flex">{children}</div>
    </div>
  );
}
