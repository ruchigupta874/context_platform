import PropTypes from 'prop-types';
import Chip from '@/components/ui/Chip';
import { EmptyState, SectionLabel, StatPairs } from '@/components/ui/Surfaces';
import DecisionActions from '@/features/review/components/DecisionActions';
import {
  Definition,
  GateDetail,
  GateDetailBody,
  GateDetailHeader,
} from '@/features/review/components/ReviewGate';
import { DECISION } from '@/config/constants/common';
import { conceptIri, confidenceTone, formatConfidence, formatDateTime } from '@/utils/format';
import ConceptDetailSkeleton from './ConceptDetailSkeleton';
import styles from './ReviewConcepts.module.css';

/**
 * The right-hand half of the gate: everything the run recorded about the
 * selected concept, and the decision it is asking for.
 *
 * Aliases lead the body because they are the reason most of these decisions are
 * hard: the concept is only correct if everything folded into it really is the
 * same thing. Provenance sits at the bottom for the reviewer who needs to trace
 * a concept back to the run that proposed it, which is a rarer job than reading
 * the definition.
 */
export default function ConceptDetail({
  concept,
  isLoading,
  decision,
  onApprove,
  onReject,
  workspaceId,
}) {
  if (isLoading) return <ConceptDetailSkeleton />;

  if (!concept) {
    return (
      <GateDetail>
        <div className={styles.detailEmpty}>
          <EmptyState
            icon="node"
            title="No concept selected"
            hint="Pick one from the list to read its definition and rule on it."
          />
        </div>
      </GateDetail>
    );
  }

  return (
    <GateDetail>
      <GateDetailHeader
        title={concept.name}
        badges={
          <>
            <Chip tone="accent">{concept.role.toUpperCase()}</Chip>
            <Chip>{concept.type}</Chip>
            <Chip tone={confidenceTone(concept.confidence)} mono>
              {formatConfidence(concept.confidence)} confidence
            </Chip>
          </>
        }
        uri={conceptIri(workspaceId, concept.name)}
        actions={<DecisionActions decision={decision} onApprove={onApprove} onReject={onReject} />}
      />

      <GateDetailBody>
        <div>
          <SectionLabel>Definition</SectionLabel>
          <Definition>{concept.definition}</Definition>
        </div>

        <div>
          <SectionLabel
            note={
              concept.aliases.length > 0 ? 'folded into this concept by the normaliser' : undefined
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
      </GateDetailBody>
    </GateDetail>
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
  isLoading: PropTypes.bool,
  decision: PropTypes.oneOf(Object.values(DECISION)),
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  workspaceId: PropTypes.string.isRequired,
};
