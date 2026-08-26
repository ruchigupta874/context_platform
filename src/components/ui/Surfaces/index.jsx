import Icon from '../Icon';
import styles from './Surfaces.module.css';

/** Bordered white card. `flush` uses the tighter radius used inside page bodies. */
export function Panel({ children, pad = false, flush = false, className = '', style }) {
  const classes = [styles.panel, flush ? styles.panelFlush : '', pad ? styles.panelPad : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <section className={classes} style={style}>
      {children}
    </section>
  );
}

export function PanelHeader({ title, meta }) {
  return (
    <header className={styles.panelHeader}>
      <span>{title}</span>
      {meta && <span className={styles.panelHeaderMeta}>{meta}</span>}
    </header>
  );
}

/** The small uppercase label that opens nearly every section in this design. */
export function SectionLabel({ children, note, className = '' }) {
  return (
    <div className={[styles.sectionLabel, className].filter(Boolean).join(' ')}>
      <span>{children}</span>
      {note && <span className={styles.sectionNote}>{note}</span>}
    </div>
  );
}

/** `stats` is `[{ id, label, value, tone? }]`. */
export function StatGrid({ stats, columns, soft = false, small = false, className = '' }) {
  return (
    <div
      className={[styles.statGrid, soft ? styles.statGridSoft : '', className].filter(Boolean).join(' ')}
      style={{ gridTemplateColumns: `repeat(${columns ?? stats.length}, minmax(0, 1fr))` }}
    >
      {stats.map((stat) => (
        <div key={stat.id} className={styles.stat}>
          <div
            className={[
              styles.statValue,
              small ? styles.statValueSm : '',
              stat.tone === 'ok' ? styles.statOk : '',
              stat.tone === 'warn' ? styles.statWarn : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {stat.value}
          </div>
          <div className={styles.statLabel}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

/** Key/value rows for the right-hand rails. `pairs` is `[{ key, value }]`. */
export function StatPairs({ pairs, keyWidth }) {
  return (
    <div className={styles.statPairs}>
      {pairs.map((pair) => (
        <div key={pair.key} className={styles.statPair}>
          <span className={styles.statPairKey} style={keyWidth ? { width: keyWidth } : undefined}>
            {pair.key}
          </span>
          <span className={styles.statPairValue}>{pair.value}</span>
        </div>
      ))}
    </div>
  );
}

export function CodeBlock({ children, className = '', style }) {
  return (
    <pre className={[styles.code, className].filter(Boolean).join(' ')} style={style}>
      {children}
    </pre>
  );
}

const BANNER_TONE_CLASS = {
  warn: styles.bannerWarn,
  ok: styles.bannerOk,
  danger: styles.bannerDanger,
  info: styles.bannerInfo,
};

const BANNER_ICON = { warn: 'alert', ok: 'check', danger: 'alert', info: 'info' };

export function Banner({ tone = 'warn', title, note, icon, actions, className = '' }) {
  return (
    <div className={[styles.banner, BANNER_TONE_CLASS[tone], className].filter(Boolean).join(' ')}>
      <span className={styles.bannerIcon}>
        <Icon name={icon ?? BANNER_ICON[tone]} size={14} />
      </span>
      <div className={styles.bannerBody}>
        <div className={styles.bannerTitle}>{title}</div>
        {note && <div className={styles.bannerNote}>{note}</div>}
      </div>
      {actions}
    </div>
  );
}

export function EmptyState({ icon, title, hint, action }) {
  return (
    <div className={styles.empty}>
      {icon && <Icon name={icon} size={22} />}
      <div className={styles.emptyTitle}>{title}</div>
      {hint && <div className={styles.emptyHint}>{hint}</div>}
      {action}
    </div>
  );
}
