import { useEffect, useState } from 'react';
import { WORKSPACES, WORKSPACE_STATS } from '@/features/workspaces/mocks';

/**
 * Stands in for the round trip this screen will make.
 *
 * The fixtures are synchronous, so nothing here would ever render a loading
 * state — and a loading state nobody can see is a loading state that rots. The
 * delay makes it real until there is a real one.
 *
 * When the API lands: replace the timeout with the fetcher, delete this
 * constant, and add `error` to what comes back so the page can say what broke.
 */
const MOCK_LATENCY_MS = 700;

export function useRegistryData() {
  const [state, setState] = useState({ workspaces: [], stats: [], isLoading: true });

  useEffect(() => {
    const timer = window.setTimeout(
      () => setState({ workspaces: WORKSPACES, stats: WORKSPACE_STATS, isLoading: false }),
      MOCK_LATENCY_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return state;
}
