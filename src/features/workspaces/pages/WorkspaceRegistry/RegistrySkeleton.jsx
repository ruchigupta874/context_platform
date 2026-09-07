import Skeleton from '@/components/ui/Skeleton';
import { StatGrid } from '@/components/ui/Surfaces';
import styles from './WorkspaceRegistry.module.css';

/** The six figures, in the grid the real ones land in. */
const LOADING_STATS = Array.from({ length: 6 }, (_, index) => ({
  id: `loading-${index}`,
  value: <Skeleton width={40} height={19} />,
  label: <Skeleton width={56} height={8} />,
}));

/**
 * The featured panel's shape while its workspace is in flight. It reuses the
 * panel's own classes rather than approximating them, so the real content lands
 * in exactly the space the skeleton held.
 */
export function FeaturedSkeleton() {
  return (
    <section className={[styles.featured, styles.ghost].join(' ')} aria-hidden="true">
      <div className={styles.featuredTop}>
        <div className={styles.featuredBody}>
          <Skeleton width={78} height={19} />
          <div className={styles.ghostName}>
            <Skeleton width={236} height={22} />
          </div>
          <div className={styles.ghostLine}>
            <Skeleton width={112} height={11} />
          </div>
        </div>
        <div className={styles.featuredActions}>
          <Skeleton width={66} height={30} radius="var(--radius)" />
          <Skeleton width={78} height={30} radius="var(--radius)" />
        </div>
      </div>
      <StatGrid stats={LOADING_STATS} columns={6} />
    </section>
  );
}

/** One card's shape. Same classes as WorkspaceCard, so neither height moves. */
export function CardSkeleton() {
  return (
    <article className={[styles.card, styles.ghost].join(' ')} aria-hidden="true">
      <div className={styles.cardSelect}>
        <div className={styles.cardTop}>
          <Skeleton width={26} height={26} radius="var(--radius)" />
          <div className={styles.cardBody}>
            <Skeleton width="68%" height={15} />
            <div className={styles.ghostLine}>
              <Skeleton width="42%" height={11} />
            </div>
          </div>
          <Skeleton width={42} height={19} />
        </div>
        <div className={styles.ghostBlurb}>
          <Skeleton width="100%" height={9} />
          <Skeleton width="74%" height={9} />
        </div>
      </div>

      <div className={styles.cardFoot}>
        <Skeleton width={124} height={13} />
      </div>
    </article>
  );
}
