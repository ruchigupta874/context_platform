import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import styles from './Checkbox.module.css';

export default function Checkbox({ checked = false, onChange, size = 'md', label, ...rest }) {
  const classes = [styles.box, size === 'sm' ? styles.sm : '', checked ? styles.checked : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className={classes}
      onClick={(event) => {
        // Rows are clickable too; a checkbox click must not also toggle the row.
        event.stopPropagation();
        onChange?.(!checked);
      }}
      {...rest}
    >
      <Icon name="check" size={size === 'sm' ? 9 : 10} strokeWidth={2.4} className={styles.mark} />
    </button>
  );
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md']),
  label: PropTypes.string,
};
