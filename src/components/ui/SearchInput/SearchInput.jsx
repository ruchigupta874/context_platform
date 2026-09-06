import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import styles from './SearchInput.module.css';

/** Controlled search field. `onChange` receives the string, not the event. */
export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search',
  width = 220,
  subtle = false,
  'aria-label': ariaLabel,
}) {
  return (
    <div className={styles.wrap} style={{ width }}>
      <Icon name="search" size={15} className={styles.icon} />
      <input
        type="search"
        className={[styles.input, subtle ? styles.subtle : ''].filter(Boolean).join(' ')}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  subtle: PropTypes.bool,
  'aria-label': PropTypes.string,
};
