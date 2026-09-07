import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

/**
 * CSS handles the setting for animations that are purely decorative
 * (base.css collapses them). This is for the cases JavaScript drives: a timer
 * that swaps content on its own has to stop, not just stop moving.
 */
export default function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
