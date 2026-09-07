import Skeleton from '@/components/ui/Skeleton';
import { DataTableRow } from '@/components/ui/DataTable';
import { DOCUMENT_COLUMNS } from '@/features/sources/constants';
import styles from './Sources.module.css';

/**
 * One document row's shape. It uses the same columns as the real row, so the
 * table's tracks are already the right width when the data lands and nothing
 * shifts sideways.
 */
export default function DocumentRowSkeleton() {
  return (
    <DataTableRow columns={DOCUMENT_COLUMNS}>
      <div className={styles.docName}>
        <Skeleton width={15} height={15} />
        <Skeleton width="58%" height={11} />
      </div>
      <Skeleton width={34} height={10} />
      <Skeleton width={20} height={10} />
      <Skeleton width={42} height={10} />
      <Skeleton width={88} height={10} />
      <Skeleton width={64} height={19} />
      <div className={styles.actionCell}>
        <Skeleton width={98} height={29} radius="var(--radius)" />
      </div>
    </DataTableRow>
  );
}
