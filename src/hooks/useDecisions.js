import { useCallback, useMemo, useState } from 'react';
import { DECISION } from '@/config/constants/common';

/**
 * Approve / reject state for a review gate.
 *
 * An id absent from the map is *undecided*, which is deliberately distinct from
 * rejected: undecided items are dropped silently at the end of the gate, and the
 * footer has to be able to say so. Collapsing the two would hide that.
 */
export function useDecisions(initial = {}) {
  const [decisions, setDecisions] = useState(initial);

  const decisionFor = useCallback((id) => decisions[id], [decisions]);

  /** Clicking the current decision again clears it, back to undecided. */
  const decide = useCallback((id, decision) => {
    setDecisions((prev) => {
      const next = { ...prev };
      if (next[id] === decision) delete next[id];
      else next[id] = decision;
      return next;
    });
  }, []);

  const decideMany = useCallback((ids, decision) => {
    setDecisions((prev) => {
      const next = { ...prev };
      ids.forEach((id) => {
        next[id] = decision;
      });
      return next;
    });
  }, []);

  const approve = useCallback((id) => decide(id, DECISION.approved), [decide]);
  const reject = useCallback((id) => decide(id, DECISION.rejected), [decide]);

  /** Counts across the whole gate, not just what is currently filtered into view. */
  const tally = useCallback(
    (allIds) => {
      const approved = allIds.filter((id) => decisions[id] === DECISION.approved).length;
      const rejected = allIds.filter((id) => decisions[id] === DECISION.rejected).length;
      const total = allIds.length;
      return {
        approved,
        rejected,
        decided: approved + rejected,
        undecided: total - approved - rejected,
        total,
      };
    },
    [decisions],
  );

  const undecidedIds = useCallback((allIds) => allIds.filter((id) => !decisions[id]), [decisions]);

  return useMemo(
    () => ({ decisions, decisionFor, decide, decideMany, approve, reject, tally, undecidedIds }),
    [decisions, decisionFor, decide, decideMany, approve, reject, tally, undecidedIds],
  );
}
