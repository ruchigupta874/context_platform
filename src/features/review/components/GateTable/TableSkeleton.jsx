import PropTypes from 'prop-types';
import Skeleton from '@/components/ui/Skeleton';
import styles from './GateTable.module.css';

/**
 * A gate's table while it is loading.
 *
 * Built on the table's own grid track so nothing shifts when the rows land.
 * `cells` describes one column each: a width given as an array is cycled down
 * the rows, because a column of identical bars reads as a pattern rather than
 * as data waiting to arrive. A null cell renders nothing — which is how the
 * actions column stays empty, an approve button that does not yet know what it
 * would approve being worse than the gap where it will be.
 */
export default function TableSkeleton({ columns, cells, rows = 8 }) {
  const template = columns.map((column) => column.width).join(' ');

  return (
    <div aria-busy="true" aria-label="Loading rows">
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className={styles.skeletonRow} style={{ gridTemplateColumns: template }}>
          {cells.map((cell, index) =>
            cell ? (
              <Skeleton
                key={columns[index].id}
                width={Array.isArray(cell.width) ? cell.width[row % cell.width.length] : cell.width}
                height={cell.height ?? 11}
                radius={cell.radius}
              />
            ) : (
              <div key={columns[index].id} />
            ),
          )}
        </div>
      ))}
    </div>
  );
}

TableSkeleton.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, width: PropTypes.string.isRequired }),
  ).isRequired,
  cells: PropTypes.arrayOf(
    PropTypes.shape({
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
      height: PropTypes.number,
      radius: PropTypes.string,
    }),
  ).isRequired,
  rows: PropTypes.number,
};
