import { useMemo, useState } from 'react';
import {
  CONCEPT_FILTER,
  conceptMatches,
  countByFilter,
  matchesFilter,
} from '@/features/review/conceptReview';
import { useReviewContext } from '@/features/review/useReviewContext';

/**
 * What the concept gate is currently showing: the status filter, the search
 * box, and which concept the detail pane is open on.
 *
 * The counts on the filter pills come from the decisions held right now rather
 * than from the envelope's `pending` / `approved` / `rejected` figures. Those
 * are what the server knew when it answered; approving six concepts has to move
 * them immediately, or the pills contradict the list underneath them.
 *
 * The selection is an id, not an index, so filtering the list never silently
 * swaps which concept the reviewer is looking at. Falling back to the first
 * visible row is what keeps the pane populated when the current one filters out.
 */
export function useConceptQueue(items) {
  const decisions = useReviewContext();
  const [filter, setFilter] = useState(CONCEPT_FILTER.all);
  const [query, setQuery] = useState('');
  const [pickedId, setPickedId] = useState(null);

  const { decisionFor } = decisions;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter(
      (concept) =>
        matchesFilter(filter, decisionFor(concept.id)) &&
        (!needle || conceptMatches(concept, needle)),
    );
  }, [items, filter, query, decisionFor]);

  const counts = useMemo(() => countByFilter(items, decisionFor), [items, decisionFor]);

  // Resolved against what is on screen, not against every concept in the run:
  // a detail pane showing an item the filter just removed would leave the list
  // with nothing highlighted and no way to see what it was describing.
  const selected = visible.find((concept) => concept.id === pickedId) ?? visible[0] ?? null;

  return {
    filter,
    setFilter,
    query,
    setQuery,
    visible,
    counts,
    selected,
    select: setPickedId,
  };
}
