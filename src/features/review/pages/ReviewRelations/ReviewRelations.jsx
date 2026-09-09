import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Checkbox from '@/components/ui/Checkbox';
import SearchInput from '@/components/ui/SearchInput';
import Toggle from '@/components/ui/Toggle';
import {
  BulkActions,
  GateFooter,
  GateList,
  GateListBody,
  GateListHead,
  GateShell,
  GateSplit,
  GateToolbar,
  ToolbarSpacer,
} from '@/features/review/components/ReviewGate';
import { ReviewListItem } from '@/features/review/components/ReviewItem';
import { DECISION } from '@/config/constants/common';
import { GATE_COPY } from '@/features/review/constants';
import { RELATIONS } from '@/features/review/mocks';
import { useReviewContext } from '@/features/review/useReviewContext';
import { useSelection } from '@/hooks/useSelection';
import { useWorkspace } from '@/features/workspaces';
import { buildPath } from '@/routes/paths';
import { relationLabel } from '@/utils/format';
import RelationDetail from './RelationDetail';

const LIST_COLUMNS = '34px 1fr 62px 24px';

/**
 * The relationship gate: the links proposed between concepts the previous gate
 * approved.
 *
 * It follows concepts rather than sharing a screen with them, because the
 * question is a different one — not "is this a real thing" but "is this really
 * how those two things relate" — and a link is only worth judging once both
 * ends have been signed off.
 */
export default function ReviewRelations() {
  const navigate = useNavigate();
  const { workspaceId } = useWorkspace();
  const { runId } = useParams();

  const [query, setQuery] = useState('');
  const [undecidedOnly, setUndecidedOnly] = useState(false);
  const [pickedId, setPickedId] = useState(null);

  const decisions = useReviewContext();
  const checks = useSelection();

  const rows = useMemo(
    () =>
      RELATIONS.map((relation) => ({
        id: relation.id,
        name: relationLabel(relation),
        sub: `${relation.cardinality} · ${relation.kind.toLowerCase()}`,
        confidence: relation.confidence,
      })),
    [],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (needle && !row.name.toLowerCase().includes(needle)) return false;
      if (undecidedOnly && decisions.decisionFor(row.id)) return false;
      return true;
    });
  }, [rows, query, undecidedOnly, decisions]);

  const allIds = useMemo(() => RELATIONS.map((relation) => relation.id), []);
  const tally = decisions.tally(allIds);

  const selected = RELATIONS.find((relation) => relation.id === pickedId) ?? RELATIONS[0];
  const visibleIds = visible.map((row) => row.id);

  /** Bulk and single decisions run through the same state; only the arity differs. */
  const decideChecked = (decision) => {
    decisions.decideMany(checks.selectedIds, decision);
    checks.clear();
  };

  return (
    <GateShell>
      <GateToolbar>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Filter relationships"
          width={210}
          subtle
        />
        <Toggle checked={undecidedOnly} onChange={setUndecidedOnly} label="Undecided only" />
        <ToolbarSpacer />
        <BulkActions
          count={checks.count}
          onApprove={() => decideChecked(DECISION.approved)}
          onReject={() => decideChecked(DECISION.rejected)}
        />
      </GateToolbar>

      <GateSplit>
        <GateList width={448}>
          <GateListHead columns={LIST_COLUMNS}>
            <Checkbox
              size="sm"
              checked={checks.allSelected(visibleIds)}
              onChange={(next) => checks.toggleMany(visibleIds, next)}
              label="Select every relationship in view"
            />
            <div>Relationship</div>
            <div>Conf</div>
            <div />
          </GateListHead>
          <GateListBody>
            {visible.map((row) => (
              <ReviewListItem
                key={row.id}
                columns={LIST_COLUMNS}
                name={row.name}
                sub={row.sub}
                confidence={row.confidence}
                decision={decisions.decisionFor(row.id)}
                selected={selected.id === row.id}
                checked={checks.isSelected(row.id)}
                onSelect={() => setPickedId(row.id)}
                onCheck={() => checks.toggle(row.id)}
              />
            ))}
          </GateListBody>
        </GateList>

        <RelationDetail
          relation={selected}
          workspaceId={workspaceId}
          decision={decisions.decisionFor(selected.id)}
          onApprove={() => decisions.approve(selected.id)}
          onReject={() => decisions.reject(selected.id)}
        />
      </GateSplit>

      <GateFooter
        tally={tally}
        undecidedWarning={GATE_COPY.undecidedWarning(tally.undecided)}
        onApproveRest={() =>
          decisions.decideMany(decisions.undecidedIds(allIds), DECISION.approved)
        }
        primaryLabel={GATE_COPY.continue(tally.approved)}
        onPrimary={() => navigate(buildPath.reviewQuestions(workspaceId, runId))}
      />
    </GateShell>
  );
}
