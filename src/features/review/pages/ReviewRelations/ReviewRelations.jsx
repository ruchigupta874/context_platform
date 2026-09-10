import { useParams } from 'react-router-dom';
import { GateScreen } from '@/features/review/components/GateTable';
import { RELATIONSHIP_COLUMNS, RELATIONSHIP_SKELETON_CELLS } from '@/features/review/constants';
import {
  RELATIONSHIP_COMPARATORS,
  RELATIONSHIP_SORT,
  RELATIONSHIP_SORTS,
  relationshipMatches,
} from '@/features/review/relationshipReview';
import { useWorkspace } from '@/features/workspaces';
import { buildPath } from '@/routes/paths';
import RelationDetail from './RelationDetail';
import RelationRow from './RelationRow';
import { useRelationReview } from './useRelationReview';

const QUEUE_OPTIONS = {
  matches: relationshipMatches,
  comparators: RELATIONSHIP_COMPARATORS,
  defaultSort: RELATIONSHIP_SORT.sourceAsc,
};

/**
 * The relationship gate: the links this run proposed between concepts, and the
 * decision each is waiting for.
 *
 * It follows concepts rather than sharing a screen with them, because the
 * question is a different one — not "is this a real thing" but "is this really
 * how those two things relate" — and a link is only worth judging once both
 * ends have been signed off.
 *
 * It is the same screen as the concept gate because it is the same job: the
 * shared `GateScreen` is what guarantees that, rather than two pages that have
 * to be kept looking alike by hand.
 */
export default function ReviewRelations() {
  const { workspaceId } = useWorkspace();
  const { runId } = useParams();
  const { data, isLoading } = useRelationReview();

  return (
    <GateScreen
      title="Relationship review"
      subtitle="The links this run proposed between approved concepts. Approve the ones that describe the domain and reject the rest — only approved links are compiled into the graph."
      totalLabel="Total relationships"
      totalIcon="link"
      searchPlaceholder="Search concepts, predicates or evidence"
      emptyHint="No relationship in this run answers to those filters together."
      selectAllLabel="Select every relationship on this page"
      items={data?.items ?? []}
      isLoading={isLoading}
      sortOptions={RELATIONSHIP_SORTS}
      queueOptions={QUEUE_OPTIONS}
      columns={RELATIONSHIP_COLUMNS}
      skeletonCells={RELATIONSHIP_SKELETON_CELLS}
      Row={RelationRow}
      nextPath={buildPath.reviewQuestions(workspaceId, runId)}
      renderDetail={({ item, ...rest }) => (
        <RelationDetail relationship={item} workspaceId={workspaceId} {...rest} />
      )}
    />
  );
}
