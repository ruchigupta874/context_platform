import PropTypes from 'prop-types';
import Chip from '@/components/ui/Chip';
import { SectionLabel } from '@/components/ui/Surfaces';
import DecisionActions from '@/features/review/components/DecisionActions';
import {
  Definition,
  GateDetail,
  GateDetailBody,
  GateDetailHeader,
} from '@/features/review/components/ReviewGate';
import { EvidenceTable, SignalList, TripleDisplay } from '@/features/review/components/ReviewItem';
import { RELATION_EVIDENCE_COLUMNS } from '@/features/review/constants';
import { DECISION } from '@/config/constants/common';
import { conceptIri, confidenceTone, formatConfidence } from '@/utils/format';

/**
 * Everything known about the selected relationship, and the decision it is
 * asking for.
 *
 * The triple leads because it is the claim being made: a reviewer reads the
 * shape first, then the join evidence that says whether the data supports it.
 */
export default function RelationDetail({ relation, decision, onApprove, onReject, workspaceId }) {
  return (
    <GateDetail>
      <GateDetailHeader
        title={`${relation.subject} — ${relation.predicate} → ${relation.object}`}
        mono
        badges={
          <>
            <Chip tone="accent">{relation.kind.toUpperCase()}</Chip>
            <Chip tone={confidenceTone(relation.confidence)} mono>
              {formatConfidence(relation.confidence)} confidence
            </Chip>
          </>
        }
        uri={conceptIri(workspaceId, relation.predicate)}
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
        <TripleDisplay
          subject={relation.subject}
          predicate={relation.predicate}
          object={relation.object}
          cardinality={relation.cardinality}
        />

        <div>
          <SectionLabel>Definition</SectionLabel>
          <Definition source={relation.definitionSource} sourceIcon={relation.sourceIcon}>
            {relation.definition}
          </Definition>
        </div>

        <div>
          <SectionLabel note="how the link was established">Join evidence</SectionLabel>
          <EvidenceTable columns={RELATION_EVIDENCE_COLUMNS} rows={relation.evidence} />
        </div>

        <div>
          <SectionLabel>Why this confidence</SectionLabel>
          <SignalList signals={relation.signals} />
        </div>
      </GateDetailBody>
    </GateDetail>
  );
}

RelationDetail.propTypes = {
  relation: PropTypes.shape({
    subject: PropTypes.string.isRequired,
    predicate: PropTypes.string.isRequired,
    object: PropTypes.string.isRequired,
    kind: PropTypes.string.isRequired,
    cardinality: PropTypes.string,
    confidence: PropTypes.number.isRequired,
    definition: PropTypes.node,
    definitionSource: PropTypes.node,
    sourceIcon: PropTypes.string,
    evidence: PropTypes.array.isRequired,
    signals: PropTypes.array.isRequired,
  }).isRequired,
  decision: PropTypes.oneOf(Object.values(DECISION)),
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  workspaceId: PropTypes.string.isRequired,
};
