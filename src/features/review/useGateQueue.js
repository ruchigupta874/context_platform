import { useMemo, useState } from 'react';
import {
  CONFIDENCE_FILTER,
  GATE_FILTER,
  countByFilter,
  matchesConfidence,
  matchesFilter,
} from '@/features/review/gateItems';
import { DEFAULT_GATE_PAGE_SIZE } from '@/features/review/constants';
import { useReviewContext } from '@/features/review/useReviewContext';

/**
 * What a gate's table is currently showing: the three filters, the sort, and
 * the page of rows they resolve to.
 *
 * Both gates filter on the same two axes and paginate the same way; only what
 * counts as a text match and what the sort options mean differ, so those come
 * in as `matches` and `comparators`.
 *
 * The counts on the status menu come from the decisions held right now rather
 * than from the envelope's `pending` / `approved` / `rejected` figures. Those
 * are what the server knew when it answered; approving six rows has to move
 * them immediately, or the menu contradicts the table underneath it.
 *
 * The page is clamped rather than corrected by an effect. Approving the last
 * two rows of page three while filtered to Undecided empties that page, and a
 * clamp lands the reviewer on the new last page as they render — an effect
 * would paint the empty page first.
 */
export function useGateQueue(items, { matches, comparators, defaultSort }) {
  const decisions = useReviewContext();
  const [status, setStatus] = useState(GATE_FILTER.all);
  const [confidence, setConfidence] = useState(CONFIDENCE_FILTER.all);
  const [sort, setSort] = useState(defaultSort);
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(DEFAULT_GATE_PAGE_SIZE);
  const [page, setPage] = useState(1);

  const { decisionFor } = decisions;

  const matched = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = items.filter(
      (item) =>
        matchesFilter(status, decisionFor(item.id)) &&
        matchesConfidence(confidence, item.confidence) &&
        (!needle || matches(item, needle)),
    );
    return [...filtered].sort(comparators[sort]);
  }, [items, status, confidence, query, sort, decisionFor, matches, comparators]);

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
