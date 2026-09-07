import { useEffect, useState } from 'react';
import { DOCUMENTS, TABLES } from '@/features/sources/mocks';

/**
 * Stands in for the round trip this screen will make. Same shape and the same
 * reasoning as the registry's hook: the fixtures are synchronous, so without a
 * delay the loading state would never render and would quietly rot.
 *
 * When the API lands: replace the timeout with the fetchers, delete this
 * constant, and add `error` so the page can say what broke.
 */
const MOCK_LATENCY_MS = 700;

export function useSourcesData() {
  const [state, setState] = useState({ tables: [], documents: [], isLoading: true });

  useEffect(() => {
    const timer = window.setTimeout(
      () => setState({ tables: TABLES, documents: DOCUMENTS, isLoading: false }),
      MOCK_LATENCY_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return state;
}
