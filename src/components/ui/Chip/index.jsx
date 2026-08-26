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
