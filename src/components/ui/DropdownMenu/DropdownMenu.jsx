import PropTypes from 'prop-types';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/components/ui/Icon/paths';
import styles from './DropdownMenu.module.css';

/**
 * Thin wrapper over Radix's dropdown menu.
 *
 * Radix owns the parts that are hard to get right by hand — focus trapping and
 * restoration, Escape, roving tabindex, typeahead, and positioning that flips
 * near a viewport edge. It ships no CSS, so everything visual below is ours and
 * reads from the same tokens as the rest of the app.
 *
 * The app imports this rather than Radix directly, so swapping the primitive
 * later stays a one-file change.
 */
export function DropdownMenu({ children }) {
  return <RadixDropdownMenu.Root>{children}</RadixDropdownMenu.Root>;
}

/** `asChild` lets the caller pass our own Button or any element as the trigger. */
export function DropdownMenuTrigger({ children }) {
  return <RadixDropdownMenu.Trigger asChild>{children}</RadixDropdownMenu.Trigger>;
}

export function DropdownMenuContent({ children, align = 'start', sideOffset = 6, width }) {
  return (
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.Content
        className={styles.content}
        align={align}
        sideOffset={sideOffset}
        style={width ? { width } : undefined}
      >
        {children}
      </RadixDropdownMenu.Content>
    </RadixDropdownMenu.Portal>
  );
}

export function DropdownMenuLabel({ children }) {
  return <RadixDropdownMenu.Label className={styles.label}>{children}</RadixDropdownMenu.Label>;
}

export function DropdownMenuSeparator() {
  return <RadixDropdownMenu.Separator className={styles.separator} />;
}

export function DropdownMenuItem({ children, onSelect, icon, selected = false, disabled = false }) {
  return (
    <RadixDropdownMenu.Item
      className={styles.item}
      onSelect={onSelect}
      disabled={disabled}
      data-selected={selected || undefined}
    >
      {icon && <Icon name={icon} size={13} className={styles.itemIcon} />}
      <span className={styles.itemLabel}>{children}</span>
      {selected && <Icon name="check" size={13} className={styles.itemCheck} />}
    </RadixDropdownMenu.Item>
  );
}

DropdownMenu.propTypes = { children: PropTypes.node };

DropdownMenuTrigger.propTypes = { children: PropTypes.node.isRequired };

DropdownMenuContent.propTypes = {
  children: PropTypes.node,
  align: PropTypes.oneOf(['start', 'center', 'end']),
  sideOffset: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

DropdownMenuLabel.propTypes = { children: PropTypes.node };

DropdownMenuItem.propTypes = {
  children: PropTypes.node,
  onSelect: PropTypes.func,
  icon: PropTypes.oneOf(ICON_NAMES),
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
};
