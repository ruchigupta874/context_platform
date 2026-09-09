import Skeleton from '@/components/ui/Skeleton';
import { CONCEPT_COLUMNS } from '@/features/review/constants';
import styles from './ReviewConcepts.module.css';

/** Names and definitions vary; a column of identical bars reads as a pattern. */
const ROWS = [
  { name: 118, definition: '86%' },
  { name: 164, definition: '72%' },
  { name: 96, definition: '91%' },
  { name: 142, definition: '64%' },
  { name: 176, definition: '88%' },
  { name: 108, definition: '78%' },
  { name: 132, definition: '95%' },
  { name: 152, definition: '69%' },
];

const TEMPLATE = CONCEPT_COLUMNS.map((column) => column.width).join(' ');

/**
 * The table while the gate is loading.
 *
 * Built on the table's own grid track so nothing shifts when the concepts land,
 * and stopping short of the actions column: an approve button that does not yet
 * know what it would approve is worse than the gap where it will be.
 */
export default function ConceptTableSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading concepts">
      {ROWS.map((row) => (
        <div
          key={row.name}
          className={styles.skeletonRow}
          style={{ gridTemplateColumns: TEMPLATE }}
        >
          <Skeleton width={14} height={14} radius="var(--radius-sm)" />
          <Skeleton width={row.name} height={11} />
          <Skeleton width={106} height={10} />
          <Skeleton width={row.definition} height={10} />
          <Skeleton width={44} height={18} radius="var(--radius)" />
          <Skeleton width={82} height={18} radius="var(--radius)" />
          <div />
        </div>
      ))}
    </div>
  );
}
