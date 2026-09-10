import { useEffect, useState } from 'react';

/**
 * Stands in for the round trip a gate will make.
 *
 * Every gate loads the same way — one envelope, normalised into rows — so the
 * hook is built rather than written out per gate. The response is normalised
 * once at module load rather than per mount, which is what a fetcher would do
 * to a body it just received, and keeps the array referentially stable so the
 * table's memos are not defeated by the hook.
 *
 * The fixtures are synchronous, so without a delay the loading state would
 * never render and would quietly rot.
 *
 * When the API lands: give this a fetcher instead of an envelope, delete the
 * constant, and fill `error` so a gate can say what broke.
 */
const MOCK_LATENCY_MS = 700;

export function createGateReview(envelope, normalize) {
  const response = { total: envelope.total, items: envelope.items.map(normalize) };

  return function useGateReview() {
    const [state, setState] = useState({ data: null, isLoading: true, error: null });

    useEffect(() => {
      const timer = window.setTimeout(
        () => setState({ data: response, isLoading: false, error: null }),
        MOCK_LATENCY_MS,
      );
      return () => window.clearTimeout(timer);
    }, []);

    return state;
  };
}
