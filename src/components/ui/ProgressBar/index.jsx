import styles from './ProgressBar.module.css';

/**
 * Multi-segment bar. `segments` is `[{ id, value, tone }]` where value is a
 * fraction of `total`. Rendering approved and rejected as separate segments
 * means a gate's progress reads honestly rather than as one blended number.
 */
export default function ProgressBar({ segments, total, label }) {
  return (
    <div className={styles.track} role="img" aria-label={label}>
      {segments.map((segment) => (
        <span
          key={segment.id}
          className={[styles.segment, styles[segment.tone]].join(' ')}
          style={{ width: total === 0 ? 0 : `${(segment.value / total) * 100}%` }}
        />
      ))}
    </div>
  );
}
