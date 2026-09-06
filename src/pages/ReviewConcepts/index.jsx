import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Chip from '@/components/ui/Chip';
import Checkbox from '@/components/ui/Checkbox';
import SearchInput from '@/components/ui/SearchInput';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Toggle from '@/components/ui/Toggle';
import { SectionLabel } from '@/components/ui/Surfaces';
import DecisionActions from '@/components/review/DecisionActions';
import {
  BulkActions,
  Definition,
  GateDetail,
  GateDetailBody,
  GateDetailHeader,
  GateFooter,
  GateList,
  GateListBody,
  GateListHead,
  GateShell,
  GateSplit,
  GateToolbar,
  LinkChips,
  ToolbarSpacer,
} from '@/components/review/ReviewGate';
import {
  EvidenceTable,
  ReviewListItem,
  SignalList,
  TripleDisplay,
} from '@/components/review/ReviewItem';
import { DECISION } from '@/config/constants/common';
import {
  CONCEPT_EVIDENCE_COLUMNS,
  GATE_COPY,
  RELATION_EVIDENCE_COLUMNS,
  REVIEW_TABS,
} from '@/config/constants/review';
import { CONCEPTS, RELATIONS } from '@/mocks/review';
import { useReviewDecisions } from '@/hooks/useReviewDecisions';
import { useSelection } from '@/hooks/useSelection';
import { useWorkspace } from '@/hooks/useWorkspace';
import { buildPath } from '@/routes/paths';
import { conceptIri, confidenceTone, formatConfidence, relationLabel } from '@/utils/format';

const LIST_COLUMNS = '34px 1fr 62px 24px';

export default function ReviewConcepts() {
  const navigate = useNavigate();
  const { workspaceId } = useWorkspace();
  const { runId = 'R-2418' } = useParams();

  const [tab, setTab] = useState('concepts');
  const [query, setQuery] = useState('');
  const [undecidedOnly, setUndecidedOnly] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState(CONCEPTS[0].id);
  const [selectedRelation, setSelectedRelation] = useState(RELATIONS[0].id);

  const decisions = useReviewDecisions();
  const checks = useSelection();

  const isConcepts = tab === 'concepts';

  // One list shape for both tabs keeps the master list a single component.
  const rows = useMemo(
    () =>
      isConcepts
        ? CONCEPTS.map((c) => ({
            id: c.id,
            name: c.name,
            sub: `ex:${c.name} · ${c.source}`,
            confidence: c.confidence,
          }))
        : RELATIONS.map((r) => ({
            id: r.id,
            name: relationLabel(r),
            sub: `${r.cardinality} · ${r.kind.toLowerCase()}`,
            confidence: r.confidence,
          })),
    [isConcepts],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (needle && !row.name.toLowerCase().includes(needle)) return false;
      if (undecidedOnly && decisions.decisionFor(row.id)) return false;
      return true;
    });
  }, [rows, query, undecidedOnly, decisions]);

  const allIds = useMemo(() => [...CONCEPTS.map((c) => c.id), ...RELATIONS.map((r) => r.id)], []);
  const tally = decisions.tally(allIds);

  const selectedId = isConcepts ? selectedConcept : selectedRelation;
  const detail = isConcepts
    ? CONCEPTS.find((c) => c.id === selectedId)
    : RELATIONS.find((r) => r.id === selectedId);
  const currentDecision = decisions.decisionFor(selectedId);

  const visibleIds = visible.map((row) => row.id);
  const allChecked = checks.allSelected(visibleIds);

  const jumpToRelation = (relationId) => {
    setTab('relations');
    setSelectedRelation(relationId);
    checks.clear();
  };

  const relatedLinks = isConcepts
    ? (detail.relationIds ?? [])
        .map((id) => RELATIONS.find((r) => r.id === id))
        .filter(Boolean)
        .map((relation) => ({ id: relation.id, label: relationLabel(relation) }))
    : [];

  return (
    <GateShell>
      <GateToolbar>
        <SegmentedControl
          options={REVIEW_TABS.map((option) => ({
            ...option,
            count: option.id === 'concepts' ? CONCEPTS.length : RELATIONS.length,
          }))}
          value={tab}
          onChange={(next) => {
            setTab(next);
            checks.clear();
          }}
          size="lg"
          ariaLabel="Review tab"
        />
        <SearchInput value={query} onChange={setQuery} placeholder="Filter" width={190} subtle />
        <Toggle checked={undecidedOnly} onChange={setUndecidedOnly} label="Undecided only" />
        <ToolbarSpacer />
        <BulkActions
          count={checks.count}
          onApprove={() => {
            decisions.decideMany(checks.selectedIds, DECISION.approved);
            checks.clear();
          }}
          onReject={() => {
            decisions.decideMany(checks.selectedIds, DECISION.rejected);
            checks.clear();
          }}
        />
      </GateToolbar>

      <GateSplit>
        <GateList width={424}>
          <GateListHead columns={LIST_COLUMNS}>
            <Checkbox
              size="sm"
              checked={allChecked}
              onChange={(next) => checks.toggleMany(visibleIds, next)}
              label="Select all"
            />
            <div>{isConcepts ? 'Concept' : 'Relationship'}</div>
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
                selected={selectedId === row.id}
                checked={checks.isSelected(row.id)}
                onSelect={() =>
                  isConcepts ? setSelectedConcept(row.id) : setSelectedRelation(row.id)
                }
                onCheck={() => checks.toggle(row.id)}
              />
            ))}
          </GateListBody>
        </GateList>

        <GateDetail>
          <GateDetailHeader
            title={
              isConcepts
                ? detail.name
                : `${detail.subject} — ${detail.predicate} → ${detail.object}`
            }
            mono={!isConcepts}
            badges={
              <>
                <Chip tone="accent">{isConcepts ? 'OWL CLASS' : detail.kind.toUpperCase()}</Chip>
                <Chip tone={confidenceTone(detail.confidence)} mono>
                  {formatConfidence(detail.confidence)} confidence
                </Chip>
              </>
            }
            uri={conceptIri(workspaceId, isConcepts ? detail.name : detail.predicate)}
            actions={
              <DecisionActions
                decision={currentDecision}
                onApprove={() => decisions.approve(selectedId)}
                onReject={() => decisions.reject(selectedId)}
                onEdit={() => {}}
              />
            }
          />

          <GateDetailBody>
            {!isConcepts && (
              <TripleDisplay
                subject={detail.subject}
                predicate={detail.predicate}
                object={detail.object}
                cardinality={detail.cardinality}
              />
            )}

            <div>
              <SectionLabel>Definition</SectionLabel>
              <Definition source={detail.definitionSource} sourceIcon={detail.sourceIcon}>
                {detail.definition}
              </Definition>
            </div>

            <div>
              <SectionLabel
                note={
                  isConcepts ? 'columns that support this class' : 'how the link was established'
                }
              >
                {isConcepts ? 'Grounded in' : 'Join evidence'}
              </SectionLabel>
              <EvidenceTable
                columns={isConcepts ? CONCEPT_EVIDENCE_COLUMNS : RELATION_EVIDENCE_COLUMNS}
                rows={detail.evidence}
              />
            </div>

            <div>
              <SectionLabel>Why this confidence</SectionLabel>
              <SignalList signals={detail.signals} />
            </div>

            {isConcepts && relatedLinks.length > 0 && (
              <div>
                <SectionLabel>Proposed relationships</SectionLabel>
                <LinkChips items={relatedLinks} onSelect={jumpToRelation} />
              </div>
            )}
          </GateDetailBody>
        </GateDetail>
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
