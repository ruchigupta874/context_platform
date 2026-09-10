import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { PageBody } from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import { ICON_NAMES } from '@/components/ui/Icon/paths';
import { DECISION } from '@/config/constants/common';
import { GATE_COPY } from '@/features/review/constants';
import { useGateQueue } from '@/features/review/useGateQueue';
import { useReviewContext } from '@/features/review/useReviewContext';
import { useSelection } from '@/hooks/useSelection';
import GateStats from './GateStats';
import GateTable from './GateTable';
import GateToolbar from './GateToolbar';
import styles from './GateTable.module.css';

/**
 * A review gate, whole: the figures, the filters, the table and the dialog.
 *
 * All three gates ask a reviewer to do the same job on a different kind of
 * item — read a list, decide in bulk where it is obvious, open the one row in
 * twenty that needs reading, then hand off. So the wiring lives here once, and
 * a gate supplies what genuinely differs: its copy, how its items are searched
 * and sorted, the columns and the row that draws them, and the dialog.
 *
 * Two scales of decision sit on the same surface deliberately. The checkboxes
 * clear a run of near-identical high-confidence rows in one pass, and the
 * dialog is there for the ones that have to be read before they are ruled on.
 * Neither is the primary path — which one is needed depends on the row.
 */
export default function GateScreen({
  title,
  subtitle,
  totalLabel,
  totalIcon,
  searchPlaceholder,
  emptyHint,
  selectAllLabel,
  items,
  isLoading,
  sortOptions,
  queueOptions,
  columns,
  skeletonCells,
  Row,
  renderDetail,
  nextPath,
}) {
  const navigate = useNavigate();
  const decisions = useReviewContext();
  const checks = useSelection();
  const [openId, setOpenId] = useState(null);

  const queue = useGateQueue(items, queueOptions);

  const allIds = useMemo(() => items.map((item) => item.id), [items]);
  const tally = decisions.tally(allIds);
  const pageIds = queue.rows.map((item) => item.id);

  /** Bulk and single decisions run through the same state; only the arity differs. */
  const decideChecked = (decision) => {
    decisions.decideMany(checks.selectedIds, decision);
    checks.clear();
  };

  return (
    <PageBody>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <>
            <Button
              variant="secondary"
              iconLeft="check"
              disabled={isLoading || tally.undecided === 0}
              onClick={() =>
                decisions.decideMany(decisions.undecidedIds(allIds), DECISION.approved)
              }
            >
              {GATE_COPY.approveRest}
            </Button>
            <Button
              variant="primary"
              iconRight="arrowRight"
              disabled={tally.approved === 0}
              onClick={() => navigate(nextPath)}
            >
              {GATE_COPY.continue(tally.approved)}
            </Button>
          </>
        }
      />

      <GateStats
        tally={tally}
        totalLabel={totalLabel}
        totalIcon={totalIcon}
        isLoading={isLoading}
      />

      {tally.undecided > 0 && !isLoading && (
        <p className={styles.undecidedNote}>
          <span className={styles.undecidedDot} />
          {GATE_COPY.undecidedWarning(tally.undecided)}
        </p>
      )}

      <section className={styles.panel} aria-busy={isLoading}>
        <GateToolbar
          searchPlaceholder={searchPlaceholder}
          query={queue.query}
          onQueryChange={queue.setQuery}
          status={queue.status}
          onStatusChange={queue.setStatus}
          statusCounts={isLoading ? undefined : queue.counts}
          confidence={queue.confidence}
          onConfidenceChange={queue.setConfidence}
          sort={queue.sort}
          sortOptions={sortOptions}
          onSortChange={queue.setSort}
          selectedCount={checks.count}
          onApproveSelected={() => decideChecked(DECISION.approved)}
          onRejectSelected={() => decideChecked(DECISION.rejected)}
          onClearSelection={checks.clear}
        />

        <GateTable
          columns={columns}
          skeletonCells={skeletonCells}
          items={queue.rows}
          Row={Row}
          isLoading={isLoading}
          emptyHint={emptyHint}
          selectAllLabel={selectAllLabel}
          decisionFor={decisions.decisionFor}
          isChecked={checks.isSelected}
          allChecked={checks.allSelected(pageIds)}
          onCheck={checks.toggle}
          onCheckPage={(next) => checks.toggleMany(pageIds, next)}
          onApprove={decisions.approve}
          onReject={decisions.reject}
          onOpen={setOpenId}
          pagination={{
            range: queue.range,
            total: queue.total,
            page: queue.page,
            pageCount: queue.pageCount,
            pageSize: queue.pageSize,
            onPageChange: queue.setPage,
            onPageSizeChange: queue.setPageSize,
          }}
        />
      </section>

      {renderDetail({
        item: items.find((item) => item.id === openId),
        decision: decisions.decisionFor(openId),
        onApprove: () => decisions.approve(openId),
        onReject: () => decisions.reject(openId),
        onClose: () => setOpenId(null),
      })}
    </PageBody>
  );
}

GateScreen.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.node.isRequired,
  totalLabel: PropTypes.string.isRequired,
  totalIcon: PropTypes.oneOf(ICON_NAMES).isRequired,
  searchPlaceholder: PropTypes.string.isRequired,
  emptyHint: PropTypes.node.isRequired,
  selectAllLabel: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
  isLoading: PropTypes.bool,
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, label: PropTypes.node.isRequired }),
  ).isRequired,
  queueOptions: PropTypes.shape({
    matches: PropTypes.func.isRequired,
    comparators: PropTypes.object.isRequired,
    defaultSort: PropTypes.string.isRequired,
  }).isRequired,
  columns: PropTypes.array.isRequired,
  skeletonCells: PropTypes.array.isRequired,
  Row: PropTypes.elementType.isRequired,
  renderDetail: PropTypes.func.isRequired,
  nextPath: PropTypes.string.isRequired,
};
