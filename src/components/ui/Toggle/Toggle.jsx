import PropTypes from 'prop-types';
import styles from './Toggle.module.css';

export default function Toggle({
  checked = false,
  onChange,
  label,
  size = 'md',
  disabled = false,
}) {
  const trackClasses = [styles.track, size === 'lg' ? styles.lg : '', checked ? styles.on : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={styles.wrap}
      onClick={() => onChange?.(!checked)}
    >
      <span className={trackClasses}>
        <span className={styles.knob} />
      </span>
      {label}
    </button>
  );
}

Toggle.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.node,
  size: PropTypes.oneOf(['md', 'lg']),
  disabled: PropTypes.bool,
};
