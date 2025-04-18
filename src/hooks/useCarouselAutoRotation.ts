
import { useEffect } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';

export const useCarouselAutoRotation = (api: CarouselApi | null) => {
  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);
};
