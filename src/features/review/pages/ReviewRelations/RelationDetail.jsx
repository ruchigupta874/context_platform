import PropTypes from 'prop-types';
import Chip from '@/components/ui/Chip';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { SectionLabel, StatPairs } from '@/components/ui/Surfaces';
import DecisionActions from '@/features/review/components/DecisionActions';
import { EvidenceTable, SignalList, TripleDisplay } from '@/features/review/components/ReviewItem';
import { RELATION_EVIDENCE_COLUMNS } from '@/features/review/constants';
import { relationshipLabel } from '@/features/review/relationshipReview';
import { DECISION } from '@/config/constants/common';
import { conceptIri, confidenceTone, formatConfidence, formatDateTime } from '@/utils/format';
import gate from '@/features/review/components/GateTable/GateTable.module.css';

/**
 * Everything the run recorded about one relationship, over the table.
 *
 * The triple leads because it is the claim being made. Then the supporting text
 * the row could only show the first line of, then the join evidence that says
 * whether the data actually backs it — a reviewer reads the claim, then checks
 * it, and the dialog is ordered the way that reading goes.
 *
 * The decision buttons are repeated here on purpose: having read the evidence,
 * the reviewer should not have to close the dialog to act on what they read.
 */
export default function RelationDetail({
  relationship,
  workspaceId,
  decision,
  onApprove,
  onReject,
  onClose,
}) {
  if (!relationship) return null;

  return (
    <Modal open onOpenChange={(next) => !next && onClose()}>
      <ModalContent
        size="lg"
        title={relationshipLabel(relationship)}
        description={conceptIri(workspaceId, relationship.predicate)}
      >
        <ModalBody className={gate.dialogBody}>
          <div className={gate.dialogBadges}>
            <Chip tone="accent">{relationship.role?.toUpperCase()}</Chip>
            <Chip>{relationship.cardinality}</Chip>
            <Chip tone={confidenceTone(relationship.confidence)} mono>
              {formatConfidence(relationship.confidence)} confidence
            </Chip>
          </div>

          <TripleDisplay
            subject={relationship.source}
            predicate={relationship.predicate}
            object={relationship.target}
            cardinality={relationship.cardinality}
          />

          <div>
            <SectionLabel>Definition</SectionLabel>
            <p className={gate.dialogDefinition}>{relationship.definition}</p>
          </div>

          <div>
            <SectionLabel note="what the row could only show the first line of">
              Supporting text
            </SectionLabel>
            <p className={gate.dialogDefinition}>{relationship.evidence}</p>
          </div>

          {relationship.joinEvidence.length > 0 && (
            <div>
              <SectionLabel note="how the link was established">Join evidence</SectionLabel>
              <EvidenceTable
                columns={RELATION_EVIDENCE_COLUMNS}
                rows={relationship.joinEvidence.map((row) => ({
                  id: row.id,
                  a: row.signal,
                  b: row.value,
                  c: row.detail,
                  role: row.role,
                }))}
              />
            </div>
          )}

          {relationship.signals.length > 0 && (
            <div>
              <SectionLabel>Why this confidence</SectionLabel>
              <SignalList signals={relationship.signals} />
            </div>
          )}

          {relationship.comment && (
            <div>
              <SectionLabel>Review note</SectionLabel>
              <p className={gate.comment}>{relationship.comment}</p>
            </div>
          )}

          <div>
            <SectionLabel>Provenance</SectionLabel>
            <div className={gate.provenance}>
              <StatPairs
                keyWidth={140}
                pairs={[
                  { key: 'Relationship id', value: relationship.relationshipId },
                  { key: 'Execution run', value: relationship.runId },
                  { key: 'Proposed', value: formatDateTime(relationship.createdAt) },
                  ...(relationship.reviewedAt
                    ? [{ key: 'Reviewed', value: formatDateTime(relationship.reviewedAt) }]
                    : []),
                ]}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className={gate.spacer} />
          <DecisionActions decision={decision} onApprove={onApprove} onReject={onReject} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

RelationDetail.propTypes = {
  relationship: PropTypes.shape({
    source: PropTypes.string.isRequired,
    predicate: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    cardinality: PropTypes.string,
    role: PropTypes.string,
    definition: PropTypes.string,
    evidence: PropTypes.string,
    joinEvidence: PropTypes.array.isRequired,
    signals: PropTypes.array.isRequired,
    confidence: PropTypes.number.isRequired,
    comment: PropTypes.string,
    relationshipId: PropTypes.string,
    runId: PropTypes.string,
    createdAt: PropTypes.string,
    reviewedAt: PropTypes.string,
  }),
  workspaceId: PropTypes.string.isRequired,
  decision: PropTypes.oneOf(Object.values(DECISION)),
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
