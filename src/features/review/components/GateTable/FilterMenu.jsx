import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import styles from './GateTable.module.css';

/**
 * A labelled menu that reads as a select.
 *
 * Built on our DropdownMenu rather than a native `<select>` or a second Radix
 * package: these options carry counts, and a menu is the one overlay primitive
 * this app already owns. The label sits outside the control so the trigger can
 * show the current choice on its own — "All statuses" answers what it is, where
 * a bare "All" would not.
 */
export default function FilterMenu({ label, options, value, onChange, counts, width = 190 }) {
  const current = options.find((option) => option.id === value);

  return (
    <div className={styles.filter}>
      <span className={styles.filterLabel}>{label}</span>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button type="button" className={styles.filterTrigger} aria-label={label}>
            <span className={styles.filterValue}>{current?.label}</span>
            <Icon name="chevronDown" size={13} className={styles.filterCaret} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent width={width}>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.id}
              selected={option.id === value}
              onSelect={() => onChange(option.id)}
            >
              {option.label}
              {counts?.[option.id] !== undefined && (
                <span className={styles.filterCount}>{counts[option.id]}</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

FilterMenu.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  counts: PropTypes.objectOf(PropTypes.number),
  width: PropTypes.number,
};
