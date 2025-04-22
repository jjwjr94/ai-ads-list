
import { useEffect, useState } from 'react';

// Define breakpoint values in pixels
export const breakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export type Breakpoint = keyof typeof breakpoints;

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount
  
  // Helper methods for breakpoint detection
  const isGreaterThan = (breakpoint: Breakpoint) => windowSize.width > breakpoints[breakpoint];
  const isLessThan = (breakpoint: Breakpoint) => windowSize.width < breakpoints[breakpoint];
  const isBetween = (min: Breakpoint, max: Breakpoint) => 
    windowSize.width > breakpoints[min] && windowSize.width < breakpoints[max];
  
  return {
    windowSize,
    isXs: windowSize.width < breakpoints.sm,
    isSm: windowSize.width >= breakpoints.sm && windowSize.width < breakpoints.md,
    isMd: windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg,
    isLg: windowSize.width >= breakpoints.lg && windowSize.width < breakpoints.xl,
    isXl: windowSize.width >= breakpoints.xl && windowSize.width < breakpoints['2xl'],
    is2Xl: windowSize.width >= breakpoints['2xl'],
    isMobile: windowSize.width < breakpoints.md,
    isTablet: windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg,
    isDesktop: windowSize.width >= breakpoints.lg,
    isGreaterThan,
    isLessThan,
    isBetween,
    breakpoints,
  };
}
