import PropTypes from 'prop-types';
import Checkbox from '@/components/ui/Checkbox';
import { EmptyState } from '@/components/ui/Surfaces';
import {
  DataTable,
  DataTableBody,
  DataTableFooter,
  DataTableHead,
} from '@/components/ui/DataTable';
import TablePagination from './TablePagination';
import TableSkeleton from './TableSkeleton';
import styles from './GateTable.module.css';

/**
 * A gate's items as one table.
 *
 * The head, the body, the empty state, the skeleton and the pagination are the
 * same whatever is being reviewed; only the columns and the cells differ, so a
 * gate supplies `columns`, `skeletonCells` and a `Row` and nothing else.
 *
 * The header checkbox selects the page in front of you, not the whole run —
 * which is what makes "filter to undecided, select the page, approve" the fast
 * path, and what stops it from quietly approving the rows the filter and the
 * pagination are hiding.
 */
export default function GateTable({
  columns,
  skeletonCells,
  items,
  Row,
  isLoading,
  emptyHint,
  selectAllLabel,
  decisionFor,
  isChecked,
  allChecked,
  onCheck,
  onCheckPage,
  onApprove,
  onReject,
  onOpen,
  pagination,
}) {
  return (
    <DataTable className={styles.table}>
      <DataTableHead
        columns={columns}
        leading={
          <Checkbox size="sm" checked={allChecked} onChange={onCheckPage} label={selectAllLabel} />
        }
      />

      <DataTableBody>
        {isLoading && <TableSkeleton columns={columns} cells={skeletonCells} />}

        {!isLoading && items.length === 0 && (
          <div className={styles.tableEmpty}>
            <EmptyState icon="search" title="Nothing matches" hint={emptyHint} />
          </div>
        )}

        {items.map((item) => (
          <Row
            key={item.id}
            item={item}
            decision={decisionFor(item.id)}
            checked={isChecked(item.id)}
            onCheck={() => onCheck(item.id)}
            onApprove={() => onApprove(item.id)}
            onReject={() => onReject(item.id)}
            onOpen={() => onOpen(item.id)}
          />
        ))}
      </DataTableBody>

      <DataTableFooter tall>
        <TablePagination {...pagination} isLoading={isLoading} />
      </DataTableFooter>
    </DataTable>
  );
}

GateTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, width: PropTypes.string.isRequired }),
  ).isRequired,
  skeletonCells: PropTypes.array.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
  Row: PropTypes.elementType.isRequired,
  isLoading: PropTypes.bool,
  emptyHint: PropTypes.node.isRequired,
  selectAllLabel: PropTypes.string.isRequired,
  decisionFor: PropTypes.func.isRequired,
  isChecked: PropTypes.func.isRequired,
  allChecked: PropTypes.bool,
  onCheck: PropTypes.func.isRequired,
  onCheckPage: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  pagination: PropTypes.object.isRequired,
};
