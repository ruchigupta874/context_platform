import PropTypes from 'prop-types';
import Skeleton from '@/components/ui/Skeleton';
import styles from './ReviewConcepts.module.css';

/** Enough rows to fill the list at the heights it will settle into. */
const ROWS = Array.from({ length: 9 }, (_, index) => index);

/** Names vary; a column of identical bars reads as a pattern rather than data. */
const NAME_WIDTHS = [118, 164, 96, 142, 176, 108, 132, 152, 124];

/**
 * The master list while the gate is loading.
 *
 * Built on the row's own grid so nothing shifts when the concepts land: the
 * checkbox, the two lines of text and the confidence chip all sit where the
 * real row will put them.
 */
export default function ConceptListSkeleton({ columns }) {
  return (
    <div aria-busy="true" aria-label="Loading concepts">
      {ROWS.map((row) => (
        <div key={row} className={styles.skeletonRow} style={{ gridTemplateColumns: columns }}>
          <Skeleton width={14} height={14} radius="var(--radius-sm)" />
          <div className={styles.skeletonBody}>
            <Skeleton width={NAME_WIDTHS[row]} height={11} />
            <Skeleton width={92} height={9} />
          </div>
          <Skeleton width={38} height={17} radius="var(--radius)" />
          <div />
        </div>
      ))}
    </div>
  );
}

ConceptListSkeleton.propTypes = { columns: PropTypes.string.isRequired };
