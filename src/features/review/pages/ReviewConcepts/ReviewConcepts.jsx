import { useParams } from 'react-router-dom';
import { GateScreen } from '@/features/review/components/GateTable';
import { CONCEPT_COLUMNS, CONCEPT_SKELETON_CELLS } from '@/features/review/constants';
import {
  CONCEPT_COMPARATORS,
  CONCEPT_SORT,
  CONCEPT_SORTS,
  conceptMatches,
} from '@/features/review/conceptReview';
import { useWorkspace } from '@/features/workspaces';
import { buildPath } from '@/routes/paths';
import ConceptDetail from './ConceptDetail';
import ConceptRow from './ConceptRow';
import { useConceptReview } from './useConceptReview';

const QUEUE_OPTIONS = {
  matches: conceptMatches,
  comparators: CONCEPT_COMPARATORS,
  defaultSort: CONCEPT_SORT.nameAsc,
};

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
 * Everything above is `GateScreen`, which all three gates share. What is left
 * here is what makes this gate a concept gate: its copy, how a concept is
 * searched and sorted, the row, and the dialog.
 */
export default function ReviewConcepts() {
  const { workspaceId } = useWorkspace();
  const { runId } = useParams();
  const { data, isLoading } = useConceptReview();

  return (
    <GateScreen
      title="Concept review"
      subtitle="Every canonical concept this run proposed. Approve the ones that belong in the ontology and reject the rest — nothing downstream is built until you do, and deciding partially is fine."
      totalLabel="Total concepts"
      totalIcon="node"
      searchPlaceholder="Search concepts, aliases or types"
      emptyHint="No concept in this run answers to those filters together."
      selectAllLabel="Select every concept on this page"
      items={data?.items ?? []}
      isLoading={isLoading}
      sortOptions={CONCEPT_SORTS}
      queueOptions={QUEUE_OPTIONS}
      columns={CONCEPT_COLUMNS}
      skeletonCells={CONCEPT_SKELETON_CELLS}
      Row={ConceptRow}
      nextPath={buildPath.reviewRelations(workspaceId, runId)}
      renderDetail={({ item, ...rest }) => (
        <ConceptDetail concept={item} workspaceId={workspaceId} {...rest} />
      )}
    />
  );
}
