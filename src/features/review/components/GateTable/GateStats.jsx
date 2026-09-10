import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import ProgressBar from '@/components/ui/ProgressBar';
import Skeleton from '@/components/ui/Skeleton';
import { ICON_NAMES } from '@/components/ui/Icon/paths';
import { formatPercent } from '@/utils/format';
import styles from './GateTable.module.css';

/**
 * The four figures, and how far through the gate the reviewer is.
 *
 * Only the first tile changes between gates — "Total concepts", "Total
 * relationships" — so `totalLabel` and `totalIcon` are the whole difference.
 * The other three count decisions, which mean the same thing everywhere.
 *
 * The labels are known before the numbers are, so a loading tile keeps its
 * label and shimmers only the figure. There is nothing honest to guess about a
 * count, and nothing to hide about what is being counted.
 */
export default function GateStats({ tally, totalLabel, totalIcon, isLoading = false }) {
  const tiles = [
    { id: 'total', label: totalLabel, icon: totalIcon, className: styles.tileAccent },
    { id: 'approved', label: 'Approved', icon: 'check', className: styles.tileOk },
    { id: 'rejected', label: 'Rejected', icon: 'close', className: styles.tileDanger },
    { id: 'undecided', label: 'Undecided', icon: 'clock', className: styles.tileNeutral },
  ];

  return (
    <div className={styles.stats}>
      {tiles.map((tile) => (
        <div key={tile.id} className={styles.tile}>
          <span className={[styles.tileIcon, tile.className].join(' ')}>
            <Icon name={tile.icon} size={15} />
          </span>
          <div>
            <div className={styles.tileLabel}>{tile.label}</div>
            <div className={styles.tileValue}>
              {isLoading ? <Skeleton width={30} height={19} /> : tally[tile.id]}
            </div>
          </div>
        </div>
      ))}

      <div className={styles.progressTile}>
        <div className={styles.progressHead}>
          <span className={styles.progressCount}>
            {isLoading ? (
              <Skeleton width={124} height={13} />
            ) : (
              `${tally.decided} of ${tally.total} reviewed`
            )}
          </span>
          {!isLoading && (
            <span className={styles.progressPercent}>
              {formatPercent(tally.decided, tally.total)}
            </span>
          )}
        </div>
        <ProgressBar
          total={tally.total}
          label={`${tally.decided} of ${tally.total} reviewed`}
          segments={[
            { id: 'approved', value: tally.approved, tone: 'ok' },
            { id: 'rejected', value: tally.rejected, tone: 'danger' },
          ]}
        />
      </div>
    </div>
  );
}

GateStats.propTypes = {
  tally: PropTypes.shape({
    total: PropTypes.number.isRequired,
    approved: PropTypes.number.isRequired,
    rejected: PropTypes.number.isRequired,
    undecided: PropTypes.number.isRequired,
    decided: PropTypes.number.isRequired,
  }).isRequired,
  totalLabel: PropTypes.string.isRequired,
  totalIcon: PropTypes.oneOf(ICON_NAMES).isRequired,
  isLoading: PropTypes.bool,
};
