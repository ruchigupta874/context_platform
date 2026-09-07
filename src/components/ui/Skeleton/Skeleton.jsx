import PropTypes from 'prop-types';
import styles from './Skeleton.module.css';

/**
 * One placeholder block.
 *
 * Sizing is the caller's job on purpose: a skeleton earns its keep only when it
 * is the shape of the thing that is coming, so the page does not jump when the
 * data lands. Compose several of these into the layout you are waiting for
 * rather than reaching for a spinner.
 */
export default function Skeleton({ width, height = 12, radius, className = '' }) {
  return (
    <span
      className={[styles.block, className].filter(Boolean).join(' ')}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

Skeleton.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  radius: PropTypes.string,
  className: PropTypes.string,
};
