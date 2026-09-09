import { useMemo, useState } from 'react';
import {
  CONCEPT_FILTER,
  CONCEPT_SORT,
  CONFIDENCE_FILTER,
  conceptMatches,
  countByFilter,
  matchesConfidence,
  matchesFilter,
  sortConcepts,
} from '@/features/review/conceptReview';
import { DEFAULT_CONCEPT_PAGE_SIZE } from '@/features/review/constants';
import { useReviewContext } from '@/features/review/useReviewContext';

/**
 * What the concept table is currently showing: the three filters, the sort, and
 * the page of rows they resolve to.
 *
 * The counts on the status menu come from the decisions held right now rather
 * than from the envelope's `pending` / `approved` / `rejected` figures. Those
 * are what the server knew when it answered; approving six concepts has to move
 * them immediately, or the menu contradicts the table underneath it.
 *
 * The page is clamped rather than corrected by an effect. Approving the last
 * two rows of page ten while filtered to Undecided empties that page, and a
 * clamp lands the reviewer on the new last page as they render — an effect
 * would paint the empty page first.
 */
export function useConceptQueue(items) {
  const decisions = useReviewContext();
  const [status, setStatus] = useState(CONCEPT_FILTER.all);
  const [confidence, setConfidence] = useState(CONFIDENCE_FILTER.all);
  const [sort, setSort] = useState(CONCEPT_SORT.nameAsc);
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(DEFAULT_CONCEPT_PAGE_SIZE);
  const [page, setPage] = useState(1);

  const { decisionFor } = decisions;

  const matched = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = items.filter(
      (concept) =>
        matchesFilter(status, decisionFor(concept.id)) &&
        matchesConfidence(confidence, concept.confidence) &&
        (!needle || conceptMatches(concept, needle)),
    );
    return sortConcepts(filtered, sort);
  }, [items, status, confidence, query, sort, decisionFor]);

  const counts = useMemo(() => countByFilter(items, decisionFor), [items, decisionFor]);

  const pageCount = Math.max(1, Math.ceil(matched.length / pageSize));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * pageSize;
  const rows = matched.slice(start, start + pageSize);

  /** Every control that changes what is in the list sends you back to page one. */
  const reset = (apply) => (value) => {
    apply(value);
    setPage(1);
  };

  return {
    status,
    setStatus: reset(setStatus),
    confidence,
    setConfidence: reset(setConfidence),
    sort,
    setSort: reset(setSort),
    query,
    setQuery: reset(setQuery),
    counts,
    rows,
    total: matched.length,
    page: current,
    pageCount,
    pageSize,
    setPageSize: reset(setPageSize),
    setPage,
    // 1-based and inclusive, the way the count under the table reads it.
    range: { from: matched.length === 0 ? 0 : start + 1, to: start + rows.length },
  };
}
