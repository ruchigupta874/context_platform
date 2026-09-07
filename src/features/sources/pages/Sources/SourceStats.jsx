import PropTypes from 'prop-types';
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

export default function SourceStats({ stats }) {
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
            {stat.value}
          </div>
          <div className={styles.statLabel}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

SourceStats.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      value: PropTypes.number.isRequired,
      tone: PropTypes.oneOf(Object.values(TONE)),
    }),
  ).isRequired,
};
