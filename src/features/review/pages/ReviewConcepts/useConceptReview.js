import { useEffect, useState } from 'react';
import { CONCEPT_REVIEW } from '@/features/review/conceptMocks';
import { normalizeConcept } from '@/features/review/conceptReview';

/**
 * Stands in for the round trip this gate will make.
 *
 * Same shape and the same reasoning as the registry's and the sources' hooks:
 * the fixtures are synchronous, so without a delay the loading state would
 * never render and would quietly rot.
 *
 * The response is normalised once at module load rather than per mount, which
 * is what a fetcher would do to a body it just received — and keeps the array
 * referentially stable so the list's memos are not defeated by the hook.
 *
 * When the API lands: replace the timeout with the fetcher, delete this
 * constant, and fill `error` so the gate can say what broke.
 */
const MOCK_LATENCY_MS = 700;

const RESPONSE = {
  total: CONCEPT_REVIEW.total,
  items: CONCEPT_REVIEW.items.map(normalizeConcept),
};

export function useConceptReview() {
  const [state, setState] = useState({ data: null, isLoading: true, error: null });

  useEffect(() => {
    const timer = window.setTimeout(
      () => setState({ data: RESPONSE, isLoading: false, error: null }),
      MOCK_LATENCY_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return state;
}
