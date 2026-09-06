import PropTypes from 'prop-types';
import Chip from '@/components/ui/Chip';
import { SectionLabel } from '@/components/ui/Surfaces';
import DecisionActions from '@/features/review/components/DecisionActions';
import {
  Definition,
  GateDetail,
  GateDetailBody,
  GateDetailHeader,
  LinkChips,
} from '@/features/review/components/ReviewGate';
import { EvidenceTable, SignalList, TripleDisplay } from '@/features/review/components/ReviewItem';
import { CONCEPT_EVIDENCE_COLUMNS, RELATION_EVIDENCE_COLUMNS } from '@/features/review/constants';
import { DECISION } from '@/config/constants/common';
import { conceptIri, confidenceTone, formatConfidence } from '@/utils/format';

/**
 * The right-hand half of the gate: everything known about the selected item,
 * and the decision it is asking for.
 *
 * Concepts and relationships share this panel because a reviewer is doing the
 * same job in both cases — reading evidence, then deciding. `isConcept` picks
 * the labels and the two shapes that genuinely differ.
 */
export default function ConceptDetail({
  detail,
  isConcept,
  decision,
  onApprove,
  onReject,
  workspaceId,
  relatedLinks,
  onSelectRelation,
}) {
  return (
    <GateDetail>
      <GateDetailHeader
        title={
          isConcept ? detail.name : `${detail.subject} — ${detail.predicate} → ${detail.object}`
        }
        mono={!isConcept}
        badges={
          <>
            <Chip tone="accent">{isConcept ? 'OWL CLASS' : detail.kind.toUpperCase()}</Chip>
            <Chip tone={confidenceTone(detail.confidence)} mono>
              {formatConfidence(detail.confidence)} confidence
            </Chip>
          </>
        }
        uri={conceptIri(workspaceId, isConcept ? detail.name : detail.predicate)}
        actions={
          <DecisionActions
            decision={decision}
            onApprove={onApprove}
            onReject={onReject}
            onEdit={() => {}}
          />
        }
      />

      <GateDetailBody>
        {!isConcept && (
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
            note={isConcept ? 'columns that support this class' : 'how the link was established'}
          >
            {isConcept ? 'Grounded in' : 'Join evidence'}
          </SectionLabel>
          <EvidenceTable
            columns={isConcept ? CONCEPT_EVIDENCE_COLUMNS : RELATION_EVIDENCE_COLUMNS}
            rows={detail.evidence}
          />
        </div>

        <div>
          <SectionLabel>Why this confidence</SectionLabel>
          <SignalList signals={detail.signals} />
        </div>

        {isConcept && relatedLinks.length > 0 && (
          <div>
            <SectionLabel>Proposed relationships</SectionLabel>
            <LinkChips items={relatedLinks} onSelect={onSelectRelation} />
          </div>
        )}
      </GateDetailBody>
    </GateDetail>
  );
}

ConceptDetail.propTypes = {
  detail: PropTypes.shape({
    name: PropTypes.string,
    subject: PropTypes.string,
    predicate: PropTypes.string,
    object: PropTypes.string,
    kind: PropTypes.string,
    cardinality: PropTypes.string,
    confidence: PropTypes.number.isRequired,
    definition: PropTypes.node,
    definitionSource: PropTypes.node,
    sourceIcon: PropTypes.string,
    evidence: PropTypes.array.isRequired,
    signals: PropTypes.array.isRequired,
  }).isRequired,
  isConcept: PropTypes.bool.isRequired,
  decision: PropTypes.oneOf(Object.values(DECISION)),
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  workspaceId: PropTypes.string.isRequired,
  relatedLinks: PropTypes.array.isRequired,
  onSelectRelation: PropTypes.func.isRequired,
};
