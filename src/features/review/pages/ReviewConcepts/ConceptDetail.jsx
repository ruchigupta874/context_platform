import PropTypes from 'prop-types';
import Chip from '@/components/ui/Chip';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { SectionLabel, StatPairs } from '@/components/ui/Surfaces';
import DecisionActions from '@/features/review/components/DecisionActions';
import { DECISION } from '@/config/constants/common';
import { conceptIri, confidenceTone, formatConfidence, formatDateTime } from '@/utils/format';
import styles from '@/features/review/components/GateTable/GateTable.module.css';

/**
 * Everything the run recorded about one concept, over the table.
 *
 * The table can hold a definition's first line and nothing else, and the alias
 * list is the reason most of these decisions are hard — a concept is only right
 * if everything folded into it really is the same thing. So the row opens into
 * this rather than the page keeping a detail pane permanently open for the one
 * row in twenty that needs reading.
 *
 * The decision buttons are repeated here on purpose: having read the aliases,
 * the reviewer should not have to close the dialog to act on what they read.
 */
export default function ConceptDetail({
  concept,
  workspaceId,
  decision,
  onApprove,
  onReject,
  onClose,
}) {
  if (!concept) return null;

  return (
    <Modal open onOpenChange={(next) => !next && onClose()}>
      <ModalContent
        size="lg"
        title={concept.name}
        description={conceptIri(workspaceId, concept.name)}
      >
        <ModalBody className={styles.dialogBody}>
          <div className={styles.dialogBadges}>
            <Chip tone="accent">{concept.role.toUpperCase()}</Chip>
            <Chip>{concept.type}</Chip>
            <Chip tone={confidenceTone(concept.confidence)} mono>
              {formatConfidence(concept.confidence)} confidence
            </Chip>
          </div>

          <div>
            <SectionLabel>Definition</SectionLabel>
            <p className={styles.dialogDefinition}>{concept.definition}</p>
          </div>

          <div>
            <SectionLabel
              note={
                concept.aliases.length > 0
                  ? 'folded into this concept by the normaliser'
                  : undefined
              }
            >
              Aliases
            </SectionLabel>
            {concept.aliases.length > 0 ? (
              <div className={styles.aliases}>
                {concept.aliases.map((alias) => (
                  <span key={alias} className={styles.alias}>
                    {alias}
                  </span>
                ))}
              </div>
            ) : (
              <p className={styles.none}>
                Nothing was folded into this concept — it was proposed under one name only.
              </p>
            )}
          </div>

          {concept.comment && (
            <div>
              <SectionLabel>Review note</SectionLabel>
              <p className={styles.comment}>{concept.comment}</p>
            </div>
          )}

          <div>
            <SectionLabel>Provenance</SectionLabel>
            <div className={styles.provenance}>
              <StatPairs
                keyWidth={132}
                pairs={[
                  { key: 'Concept id', value: concept.conceptId },
                  { key: 'Execution run', value: concept.runId },
                  { key: 'Proposed', value: formatDateTime(concept.createdAt) },
                  ...(concept.reviewedAt
                    ? [{ key: 'Reviewed', value: formatDateTime(concept.reviewedAt) }]
                    : []),
                ]}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className={styles.spacer} />
          <DecisionActions decision={decision} onApprove={onApprove} onReject={onReject} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

ConceptDetail.propTypes = {
  concept: PropTypes.shape({
    name: PropTypes.string.isRequired,
    aliases: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    definition: PropTypes.string,
    confidence: PropTypes.number.isRequired,
    comment: PropTypes.string,
    conceptId: PropTypes.string,
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
