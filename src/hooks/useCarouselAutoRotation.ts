
import { useEffect } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';

export const useCarouselAutoRotation = (api: CarouselApi | null) => {
  useEffect(() => {
    if (!api) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const interval = 3000; // 3 seconds

    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastTime;

      if (elapsed >= interval) {
        if (api.canScrollNext()) {
          api.scrollNext({ duration: 1000 }); // Smooth 1-second transition
        } else {
          api.scrollTo(0, { duration: 1000 });
        }
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [api]);
};
