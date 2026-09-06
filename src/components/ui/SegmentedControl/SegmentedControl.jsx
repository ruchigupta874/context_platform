import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/components/ui/Icon/paths';
import styles from './SegmentedControl.module.css';

/**
 * A group of mutually exclusive filter pills. `options` is
 * `[{ id, label, icon?, count? }]`.
 *
 * These are toggle buttons, not tabs. The distinction is not cosmetic: the tab
 * pattern promises arrow-key navigation and a matching `tabpanel`, and a
 * `role="tablist"` without them leaves a screen reader announcing "tab 1 of 3"
 * for a control the arrow keys do not drive. Every current use filters a list
 * in place rather than swapping a page region, so `aria-pressed` on plain
 * buttons is the honest description and Tab moves between them as it looks like
 * it should. If a real tabbed region is ever needed, use @radix-ui/react-tabs
 * rather than widening this.
 */
export default function SegmentedControl({ options, value, onChange, size = 'md', ariaLabel }) {
  return (
    <div className={styles.group} role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
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

SegmentedControl.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      icon: PropTypes.oneOf(ICON_NAMES),
      count: PropTypes.number,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['md', 'lg']),
  ariaLabel: PropTypes.string,
};
