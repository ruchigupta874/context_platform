import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SearchInput from '@/components/ui/SearchInput';
import SegmentedControl from '@/components/ui/SegmentedControl';
import {
  BulkActions,
  GateFooter,
  GateShell,
  GateSplit,
  GateToolbar,
  ToolbarSpacer,
} from '@/features/review/components/ReviewGate';
import { DECISION } from '@/config/constants/common';
import { GATE_COPY } from '@/features/review/constants';
import { CONCEPT_FILTERS } from '@/features/review/conceptReview';
import { useReviewContext } from '@/features/review/useReviewContext';
import { useSelection } from '@/hooks/useSelection';
import { useWorkspace } from '@/features/workspaces';
import { buildPath } from '@/routes/paths';
import ConceptDetail from './ConceptDetail';
import ConceptList from './ConceptList';
import { useConceptQueue } from './useConceptQueue';
import { useConceptReview } from './useConceptReview';

/**
 * The concept gate: every canonical concept a run proposed, and the decision it
 * is waiting for.
 *
 * Relationships used to share this screen as a second tab. They are their own
 * stage now, which is the honest shape — a reviewer approves the classes first
 * and only then decides how they relate — so this screen does one thing, and
 * the footer hands off to the next gate when it is done.
 *
 * Both scales of decision are on the same surface deliberately: the checkboxes
 * clear a run of near-identical high-confidence concepts in one pass, and the
 * detail pane is there for the ones that have to be read before they are ruled
 * on. Neither is the primary path — which one a reviewer needs depends entirely
 * on the concept in front of them.
 */
export default function ReviewConcepts() {
  const navigate = useNavigate();
  const { workspaceId } = useWorkspace();
  const { runId } = useParams();

  const { data, isLoading } = useConceptReview();
  const decisions = useReviewContext();
  const checks = useSelection();

  const items = useMemo(() => data?.items ?? [], [data]);
  const queue = useConceptQueue(items);

  const allIds = useMemo(() => items.map((concept) => concept.id), [items]);
  const tally = decisions.tally(allIds);
  const visibleIds = queue.visible.map((concept) => concept.id);

  /** Bulk and single decisions run through the same state; only the arity differs. */
  const decideChecked = (decision) => {
    decisions.decideMany(checks.selectedIds, decision);
    checks.clear();
  };

  return (
    <GateShell>
      <GateToolbar>
        <SegmentedControl
          options={CONCEPT_FILTERS.map((option) => ({
            ...option,
            count: isLoading ? undefined : queue.counts[option.id],
          }))}
          value={queue.filter}
          onChange={(next) => {
            queue.setFilter(next);
            checks.clear();
          }}
          size="lg"
          ariaLabel="Filter concepts by decision"
        />
        <SearchInput
          value={queue.query}
          onChange={queue.setQuery}
          placeholder="Name, alias or type"
          width={210}
          subtle
        />
        <ToolbarSpacer />
        <BulkActions
          count={checks.count}
          onApprove={() => decideChecked(DECISION.approved)}
          onReject={() => decideChecked(DECISION.rejected)}
        />
      </GateToolbar>

      <GateSplit>
        <ConceptList
          concepts={queue.visible}
          isLoading={isLoading}
          selectedId={queue.selected?.id}
          decisionFor={decisions.decisionFor}
          isChecked={checks.isSelected}
          allChecked={checks.allSelected(visibleIds)}
          onCheck={checks.toggle}
          onCheckAll={(next) => checks.toggleMany(visibleIds, next)}
          onSelect={queue.select}
        />

        <ConceptDetail
          concept={queue.selected}
          isLoading={isLoading}
          workspaceId={workspaceId}
          decision={queue.selected && decisions.decisionFor(queue.selected.id)}
          onApprove={() => decisions.approve(queue.selected.id)}
          onReject={() => decisions.reject(queue.selected.id)}
        />
      </GateSplit>

      <GateFooter
        tally={tally}
        isLoading={isLoading}
        undecidedWarning={GATE_COPY.undecidedWarning(tally.undecided)}
        onApproveRest={() =>
          decisions.decideMany(decisions.undecidedIds(allIds), DECISION.approved)
        }
        primaryLabel={GATE_COPY.continue(tally.approved)}
        onPrimary={() => navigate(buildPath.reviewRelations(workspaceId, runId))}
      />
    </GateShell>
  );
}
