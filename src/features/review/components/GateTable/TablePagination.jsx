import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import Icon from '@/components/ui/Icon';
import { GATE_PAGE_SIZES } from '@/features/review/constants';
import styles from './GateTable.module.css';

/**
 * The bar under the table: where you are in the list, and how to move.
 *
 * The range is stated in full — "Showing 1–25 of 250" — rather than as a page
 * number alone, because the number a reviewer is tracking is how much of the
 * gate is left, not which page they happen to be on.
 */
export default function TablePagination({
  range,
  total,
  page,
  pageCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) {
  return (
    <>
      <span className={styles.pageCount}>
        {isLoading ? (
          <Skeleton width={132} height={10} />
        ) : (
          `Showing ${range.from}–${range.to} of ${total}`
        )}
      </span>

      <div className={styles.spacer} />

      <span className={styles.pageSizeLabel}>Rows per page</span>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button type="button" className={styles.pageSizeTrigger} aria-label="Rows per page">
            {pageSize}
            <Icon name="chevronDown" size={12} className={styles.filterCaret} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" width={110}>
          {GATE_PAGE_SIZES.map((size) => (
            <DropdownMenuItem
              key={size}
              selected={size === pageSize}
              onSelect={() => onPageSizeChange(size)}
            >
              {size}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        size="sm"
        variant="secondary"
        iconLeft="arrowLeft"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className={styles.pagePosition}>
        Page {page} of {pageCount}
      </span>
      <Button
        size="sm"
        variant="secondary"
        iconRight="arrowRight"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </>
  );
}

TablePagination.propTypes = {
  range: PropTypes.shape({ from: PropTypes.number, to: PropTypes.number }).isRequired,
  total: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
