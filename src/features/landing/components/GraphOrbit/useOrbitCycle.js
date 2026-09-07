import { useEffect, useState } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

/**
 * Walks 0..length-1 on a timer and wraps. Returns the resting index and never
 * advances when the reader has asked for reduced motion, so the diagram holds
 * its first stage instead of rotating content out from under them.
 */
export default function useOrbitCycle(length, intervalMs) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || length < 2) return undefined;

    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % length),
      intervalMs,
    );
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, length, intervalMs]);

  return index;
}
