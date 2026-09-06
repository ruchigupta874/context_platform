import PropTypes from 'prop-types';
import { TONE } from '@/config/constants/common';
import styles from './Chip.module.css';

/** Small status label. `tone` maps to the semantic token families in tokens.css. */
export default function Chip({
  children,
  tone = 'neutral',
  size = 'sm',
  mono = false,
  dot = false,
  icon = null,
  className = '',
}) {
  const classes = [
    styles.chip,
    styles[tone],
    size === 'lg' ? styles.lg : '',
    mono ? styles.mono : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {dot && <span className={styles.dot} />}
      {icon}
      {children}
    </span>
  );
}

Chip.propTypes = {
  children: PropTypes.node,
  tone: PropTypes.oneOf(Object.values(TONE)),
  size: PropTypes.oneOf(['sm', 'lg']),
  mono: PropTypes.bool,
  dot: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
};
