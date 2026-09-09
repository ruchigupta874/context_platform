import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import SearchInput from '@/components/ui/SearchInput';
import {
  CONCEPT_FILTERS,
  CONCEPT_SORTS,
  CONFIDENCE_FILTERS,
} from '@/features/review/conceptReview';
import FilterMenu from './FilterMenu';
import styles from './ReviewConcepts.module.css';

/**
 * Search and the three menus that narrow the table, and — when rows are ticked
 * — what can be done to them.
 *
 * The bulk bar replaces the filters rather than stacking under them. A
 * selection is a mode: while it is live the question is what to do with those
 * rows, and leaving both rows of controls on screen would offer to change the
 * list out from under the selection that is about to be acted on.
 */
export default function ConceptToolbar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  statusCounts,
  confidence,
  onConfidenceChange,
  sort,
  onSortChange,
  selectedCount,
  onApproveSelected,
  onRejectSelected,
  onClearSelection,
}) {
  if (selectedCount > 0) {
    return (
      <div className={[styles.toolbar, styles.toolbarSelected].join(' ')}>
        <span className={styles.selectedCount}>
          <strong>{selectedCount}</strong> selected
        </span>
        <span className={styles.toolbarDivider} />
        <Button variant="approve" size="sm" iconLeft="check" onClick={onApproveSelected}>
          Approve
        </Button>
        <Button variant="reject" size="sm" iconLeft="close" onClick={onRejectSelected}>
          Reject
        </Button>
        <div className={styles.spacer} />
        <button type="button" className={styles.clearSelection} onClick={onClearSelection}>
          <Icon name="close" size={12} />
          Clear selection
        </button>
      </div>
    );
  }

  return (
    <div className={styles.toolbar}>
      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder="Search concepts, aliases or types"
        width={280}
      />
      <FilterMenu
        label="Status"
        options={CONCEPT_FILTERS}
        value={status}
        onChange={onStatusChange}
        counts={statusCounts}
      />
      <FilterMenu
        label="Confidence"
        options={CONFIDENCE_FILTERS}
        value={confidence}
        onChange={onConfidenceChange}
      />
      <FilterMenu
        label="Sort by"
        options={CONCEPT_SORTS}
        value={sort}
        onChange={onSortChange}
        width={210}
      />
    </div>
  );
}

ConceptToolbar.propTypes = {
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  statusCounts: PropTypes.objectOf(PropTypes.number),
  confidence: PropTypes.string.isRequired,
  onConfidenceChange: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  selectedCount: PropTypes.number.isRequired,
  onApproveSelected: PropTypes.func.isRequired,
  onRejectSelected: PropTypes.func.isRequired,
  onClearSelection: PropTypes.func.isRequired,
};
