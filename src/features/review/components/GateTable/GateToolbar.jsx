import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import SearchInput from '@/components/ui/SearchInput';
import { CONFIDENCE_FILTERS, GATE_FILTERS } from '@/features/review/gateItems';
import FilterMenu from './FilterMenu';
import styles from './GateTable.module.css';

/**
 * Search and the three menus that narrow a gate's table, and — when rows are
 * ticked — what can be done to them.
 *
 * The bulk bar replaces the filters rather than stacking under them. A
 * selection is a mode: while it is live the question is what to do with those
 * rows, and leaving both rows of controls on screen would offer to change the
 * list out from under the selection that is about to be acted on.
 *
 * Status and confidence are the same everywhere; only the sort options and the
 * search placeholder belong to the gate.
 */
export default function GateToolbar({
  searchPlaceholder,
  query,
  onQueryChange,
  status,
  onStatusChange,
  statusCounts,
  confidence,
  onConfidenceChange,
  sort,
  sortOptions,
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
        placeholder={searchPlaceholder}
        width={280}
      />
      <FilterMenu
        label="Status"
        options={GATE_FILTERS}
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
        options={sortOptions}
        value={sort}
        onChange={onSortChange}
        width={220}
      />
    </div>
  );
}

GateToolbar.propTypes = {
  searchPlaceholder: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  statusCounts: PropTypes.objectOf(PropTypes.number),
  confidence: PropTypes.string.isRequired,
  onConfidenceChange: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, label: PropTypes.node.isRequired }),
  ).isRequired,
  onSortChange: PropTypes.func.isRequired,
  selectedCount: PropTypes.number.isRequired,
  onApproveSelected: PropTypes.func.isRequired,
  onRejectSelected: PropTypes.func.isRequired,
  onClearSelection: PropTypes.func.isRequired,
};
