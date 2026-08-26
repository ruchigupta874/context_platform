import styles from './DataTable.module.css';

/**
 * Grid-based table.
 *
 * A CSS grid rather than a <table>: every screen here needs the header and the
 * rows to share a column track while the body scrolls independently, which a
 * real table cannot do without position tricks.
 *
 * `columns` is `[{ id, label, width }]` — width is any grid track value.
 */
function tableTemplate(columns) {
  return columns.map((column) => column.width).join(' ');
}

export function DataTableHead({ columns, leading, compact = false }) {
  return (
    <div
      className={[styles.head, compact ? styles.headCompact : ''].filter(Boolean).join(' ')}
      style={{ gridTemplateColumns: tableTemplate(columns) }}
      role="row"
    >
      {columns.map((column, index) => (
        <div key={column.id} role="columnheader">
          {index === 0 && leading ? leading : column.label}
        </div>
      ))}
    </div>
  );
}

export function DataTableRow({
  columns,
  children,
  onClick,
  selected = false,
  flagged = false,
  height = 'var(--row-h)',
  className = '',
}) {
  const classes = [
    styles.row,
    onClick ? styles.clickable : '',
    selected ? styles.selected : '',
    flagged ? styles.flagged : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const Element = onClick ? 'button' : 'div';

  return (
    <Element
      type={onClick ? 'button' : undefined}
      className={classes}
      style={{ gridTemplateColumns: tableTemplate(columns), minHeight: height }}
      onClick={onClick}
      role="row"
    >
      {children}
    </Element>
  );
}

export function DataTable({ children, fill = true, className = '' }) {
  return (
    <div className={[styles.table, fill ? styles.fill : '', className].filter(Boolean).join(' ')} role="table">
      {children}
    </div>
  );
}

export function DataTableBody({ children }) {
  return <div className={styles.body}>{children}</div>;
}

export function DataTableFooter({ children, tall = false }) {
  return (
    <div className={[styles.footer, tall ? styles.footerTall : styles.footerShort].join(' ')}>
      {children}
    </div>
  );
}
