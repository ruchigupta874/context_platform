import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageBody } from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import { DECISION } from '@/config/constants/common';
import { GATE_COPY } from '@/features/review/constants';
import { useReviewContext } from '@/features/review/useReviewContext';
import { useSelection } from '@/hooks/useSelection';
import { useWorkspace } from '@/features/workspaces';
import { buildPath } from '@/routes/paths';
import ConceptDetail from './ConceptDetail';
import ConceptStats from './ConceptStats';
import ConceptTable from './ConceptTable';
import ConceptToolbar from './ConceptToolbar';
import { useConceptQueue } from './useConceptQueue';
import { useConceptReview } from './useConceptReview';
import styles from './ReviewConcepts.module.css';

/**
 * The concept gate: every canonical concept a run proposed, and the decision it
 * is waiting for.
 *
 * One table rather than a list beside a detail pane. At this size the reviewer
 * is mostly comparing rows — name, type, confidence, what has been decided — and
 * a permanent detail pane spends half the screen on a single row to answer a
 * question most rows do not raise. The row that does raise it opens into a
 * dialog, and the pane's width goes back to the columns.
 *
 * Relationships used to share this screen as a second tab. They are their own
 * stage now, so this screen does one thing and hands off when it is done.
 */
export default function ReviewConcepts() {
  const navigate = useNavigate();
  const { workspaceId } = useWorkspace();
  const { runId } = useParams();

  const { data, isLoading } = useConceptReview();
  const decisions = useReviewContext();
  const checks = useSelection();
  const [openId, setOpenId] = useState(null);

  const items = useMemo(() => data?.items ?? [], [data]);
  const queue = useConceptQueue(items);

  const allIds = useMemo(() => items.map((concept) => concept.id), [items]);
  const tally = decisions.tally(allIds);
  const pageIds = queue.rows.map((concept) => concept.id);

  /** Bulk and single decisions run through the same state; only the arity differs. */
  const decideChecked = (decision) => {
    decisions.decideMany(checks.selectedIds, decision);
    checks.clear();
  };

  return (
    <PageBody>
      <PageHeader
        title="Concept review"
        subtitle="Every canonical concept this run proposed. Approve the ones that belong in the ontology and reject the rest — nothing downstream is built until you do, and deciding partially is fine."
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
              onClick={() => navigate(buildPath.reviewRelations(workspaceId, runId))}
            >
              {GATE_COPY.continue(tally.approved)}
            </Button>
          </>
        }
      />

      <ConceptStats tally={tally} isLoading={isLoading} />

      {tally.undecided > 0 && !isLoading && (
        <p className={styles.undecidedNote}>
          <span className={styles.undecidedDot} />
          {GATE_COPY.undecidedWarning(tally.undecided)}
        </p>
      )}

      <section className={styles.panel} aria-busy={isLoading}>
        <ConceptToolbar
          query={queue.query}
          onQueryChange={queue.setQuery}
          status={queue.status}
          onStatusChange={queue.setStatus}
          statusCounts={isLoading ? undefined : queue.counts}
          confidence={queue.confidence}
          onConfidenceChange={queue.setConfidence}
          sort={queue.sort}
          onSortChange={queue.setSort}
          selectedCount={checks.count}
          onApproveSelected={() => decideChecked(DECISION.approved)}
          onRejectSelected={() => decideChecked(DECISION.rejected)}
          onClearSelection={checks.clear}
        />

        <ConceptTable
          concepts={queue.rows}
          isLoading={isLoading}
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

      <ConceptDetail
        concept={items.find((concept) => concept.id === openId)}
        workspaceId={workspaceId}
        decision={decisions.decisionFor(openId)}
        onApprove={() => decisions.approve(openId)}
        onReject={() => decisions.reject(openId)}
        onClose={() => setOpenId(null)}
      />
    </PageBody>
  );
}
