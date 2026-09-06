import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/components/ui/Icon/paths';
import styles from './Button.module.css';

/**
 * @param {'primary'|'secondary'|'ghost'|'approve'|'approveActive'|'reject'|'rejectActive'|'warn'|'warnOutline'} variant
 * @param {'sm'|'md'|'lg'|'icon'} size
 */
export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  iconLeft,
  iconRight,
  block = false,
  className = '',
  ...rest
}) {
  const classes = [
    styles.button,
    styles[variant],
    size !== 'md' ? styles[size] : '',
    block ? styles.block : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} {...rest}>
      {iconLeft && <Icon name={iconLeft} size={13} />}
      {children}
      {iconRight && <Icon name={iconRight} size={14} />}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'ghost',
    'approve',
    'approveActive',
    'reject',
    'rejectActive',
    'warn',
    'warnOutline',
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'icon']),
  iconLeft: PropTypes.oneOf(ICON_NAMES),
  iconRight: PropTypes.oneOf(ICON_NAMES),
  block: PropTypes.bool,
  className: PropTypes.string,
};
