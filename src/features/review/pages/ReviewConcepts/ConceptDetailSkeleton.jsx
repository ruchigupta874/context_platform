import Skeleton from '@/components/ui/Skeleton';
import { SectionLabel } from '@/components/ui/Surfaces';
import { GateDetail, GateDetailBody } from '@/features/review/components/ReviewGate';
import styles from './ReviewConcepts.module.css';

/** Alias chips are the one part whose width genuinely varies row to row. */
const ALIAS_WIDTHS = [104, 138, 92, 122];

/**
 * The detail pane while the gate is loading.
 *
 * The section labels are real: they are the same for every concept, so printing
 * them straight away costs nothing and tells the reviewer what is arriving. The
 * decision buttons are deliberately absent — an approve button that does not
 * know what it would approve is worse than a gap where it will be.
 */
export default function ConceptDetailSkeleton() {
  return (
    <GateDetail>
      <header className={styles.skeletonHead} aria-busy="true" aria-label="Loading concept">
        <Skeleton width={212} height={20} />
        <div className={styles.skeletonBadges}>
          <Skeleton width={62} height={17} radius="var(--radius)" />
          <Skeleton width={78} height={17} radius="var(--radius)" />
        </div>
        <Skeleton width={330} height={10} />
      </header>

      <GateDetailBody>
        <div>
          <SectionLabel>Definition</SectionLabel>
          <div className={styles.skeletonLines}>
            <Skeleton width="94%" height={11} />
            <Skeleton width="78%" height={11} />
          </div>
        </div>

        <div>
          <SectionLabel>Aliases</SectionLabel>
          <div className={styles.aliases}>
            {ALIAS_WIDTHS.map((width) => (
              <Skeleton key={width} width={width} height={24} radius="var(--radius)" />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>Provenance</SectionLabel>
          <div className={styles.skeletonLines}>
            <Skeleton width={340} height={10} />
            <Skeleton width={362} height={10} />
            <Skeleton width={286} height={10} />
          </div>
        </div>
      </GateDetailBody>
    </GateDetail>
  );
}
