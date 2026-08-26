import Icon from './Icon';
import styles from './SegmentedControl.module.css';

/**
 * Filter pills and tab groups are the same control with different content, so
 * they are one component. `options` is `[{ id, label, icon?, count? }]`.
 */
export default function SegmentedControl({ options, value, onChange, size = 'md', ariaLabel }) {
  return (
    <div className={styles.group} role="tablist" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={[styles.segment, size === 'lg' ? styles.lg : '', active ? styles.active : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => onChange(option.id)}
          >
            {option.icon && <Icon name={option.icon} size={13} />}
            {option.label}
            {option.count !== undefined && <span className={styles.count}>{option.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
