import PropTypes from 'prop-types';
import Checkbox from '@/components/ui/Checkbox';
import { EmptyState } from '@/components/ui/Surfaces';
import {
  DataTable,
  DataTableBody,
  DataTableFooter,
  DataTableHead,
} from '@/components/ui/DataTable';
import { CONCEPT_COLUMNS } from '@/features/review/constants';
import ConceptRow from './ConceptRow';
import ConceptTableSkeleton from './ConceptTableSkeleton';
import TablePagination from './TablePagination';
import styles from './ReviewConcepts.module.css';

/**
 * The gate as one table.
 *
 * The header checkbox selects the page in front of you, not the whole run —
 * which is what makes "filter to undecided, select the page, approve" the fast
 * path, and what stops it from quietly approving the two hundred concepts the
 * filter and the pagination are hiding. Clearing the whole gate in one move is
 * a different action, and it says so on its own button.
 */
export default function ConceptTable({
  concepts,
  isLoading,
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
        columns={CONCEPT_COLUMNS}
        leading={
          <Checkbox
            size="sm"
            checked={allChecked}
            onChange={onCheckPage}
            label="Select every concept on this page"
          />
        }
      />

      <DataTableBody>
        {isLoading && <ConceptTableSkeleton />}

        {!isLoading && concepts.length === 0 && (
          <div className={styles.tableEmpty}>
            <EmptyState
              icon="search"
              title="Nothing matches"
              hint="No concept in this run answers to those filters together."
            />
          </div>
        )}

        {concepts.map((concept) => (
          <ConceptRow
            key={concept.id}
            concept={concept}
            decision={decisionFor(concept.id)}
            checked={isChecked(concept.id)}
            onCheck={() => onCheck(concept.id)}
            onApprove={() => onApprove(concept.id)}
            onReject={() => onReject(concept.id)}
            onOpen={() => onOpen(concept.id)}
          />
        ))}
      </DataTableBody>

      <DataTableFooter tall>
        <TablePagination {...pagination} isLoading={isLoading} />
      </DataTableFooter>
    </DataTable>
  );
}

ConceptTable.propTypes = {
  concepts: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
  isLoading: PropTypes.bool,
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
