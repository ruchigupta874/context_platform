import PropTypes from 'prop-types';
import Checkbox from '@/components/ui/Checkbox';
import { EmptyState } from '@/components/ui/Surfaces';
import { GateList, GateListBody, GateListHead } from '@/features/review/components/ReviewGate';
import { ReviewListItem } from '@/features/review/components/ReviewItem';
import { joinMeta } from '@/utils/format';
import ConceptListSkeleton from './ConceptListSkeleton';
import styles from './ReviewConcepts.module.css';

const COLUMNS = '34px 1fr 62px 24px';

/**
 * The master list: every concept the filter and the search left in view.
 *
 * The header checkbox selects what is in view rather than the whole run, which
 * is what makes "filter to pending, select all, approve" the fast path through
 * a gate this size — and what stops it from quietly approving the 40 concepts
 * the filter is hiding.
 */
export default function ConceptList({
  concepts,
  isLoading,
  selectedId,
  decisionFor,
  isChecked,
  allChecked,
  onCheck,
  onCheckAll,
  onSelect,
}) {
  return (
    <GateList width={448}>
      <GateListHead columns={COLUMNS}>
        <Checkbox
          size="sm"
          checked={allChecked}
          onChange={onCheckAll}
          label="Select every concept in view"
        />
        <div>Concept</div>
        <div>Conf</div>
        <div />
      </GateListHead>

      <GateListBody>
        {isLoading && <ConceptListSkeleton columns={COLUMNS} />}

        {!isLoading && concepts.length === 0 && (
          <div className={styles.listEmpty}>
            <EmptyState
              icon="search"
              title="Nothing matches"
              hint="No concept in this run answers to that filter and search together."
            />
          </div>
        )}

        {concepts.map((concept) => (
          <ReviewListItem
            key={concept.id}
            columns={COLUMNS}
            name={concept.name}
            sub={joinMeta(concept.type, concept.role.toLowerCase())}
            confidence={concept.confidence}
            decision={decisionFor(concept.id)}
            selected={selectedId === concept.id}
            checked={isChecked(concept.id)}
            onSelect={() => onSelect(concept.id)}
            onCheck={() => onCheck(concept.id)}
          />
        ))}
      </GateListBody>
    </GateList>
  );
}

ConceptList.propTypes = {
  concepts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      confidence: PropTypes.number.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
  selectedId: PropTypes.string,
  decisionFor: PropTypes.func.isRequired,
  isChecked: PropTypes.func.isRequired,
  allChecked: PropTypes.bool,
  onCheck: PropTypes.func.isRequired,
  onCheckAll: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};
