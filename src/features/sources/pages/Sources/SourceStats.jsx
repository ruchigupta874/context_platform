import PropTypes from 'prop-types';
import Skeleton from '@/components/ui/Skeleton';
import { TONE } from '@/config/constants/common';
import styles from './Sources.module.css';

/**
 * Only three of the four figures take a rail. "Not extracted" is a backlog, not
 * a state worth colouring — giving it one would put four competing colours
 * above a table that already carries its own status column.
 */
const RAIL_CLASS = {
  [TONE.accent]: styles.railAccent,
  [TONE.ok]: styles.railOk,
  [TONE.warn]: styles.railWarn,
};

/**
 * The labels are known before the numbers are, so a loading tile keeps its
 * label and shimmers only the figure. There is nothing honest to guess about
 * the count, and nothing to hide about what is being counted.
 */
export default function SourceStats({ stats, isLoading = false }) {
  return (
    <div className={styles.stats}>
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={[styles.stat, RAIL_CLASS[stat.tone]].filter(Boolean).join(' ')}
        >
          <div
            className={[styles.statValue, stat.tone === TONE.warn ? styles.statValueWarn : '']
              .filter(Boolean)
              .join(' ')}
          >
            {isLoading ? <Skeleton width={26} height={20} /> : stat.value}
          </div>
          <div className={styles.statLabel}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

SourceStats.propTypes = {
  isLoading: PropTypes.bool,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      value: PropTypes.number.isRequired,
      tone: PropTypes.oneOf(Object.values(TONE)),
    }),
  ).isRequired,
};
