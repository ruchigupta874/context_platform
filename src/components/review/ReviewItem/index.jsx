import Icon from '../../ui/Icon';
import Chip from '../../ui/Chip';
import Checkbox from '../../ui/Checkbox';
import { DECISION } from '../../../config/constants/common';
import { EVIDENCE_TONES } from '../../../config/constants/review';
import { confidenceTone, formatConfidence, signalTone } from '../../../utils/format';
import styles from './ReviewItem.module.css';

const TONE_CLASS = { ok: styles.toneOk, warn: styles.toneWarn, danger: styles.toneDanger };

/** One row in a gate's master list. */
export function ReviewListItem({
  columns,
  name,
  sub,
  confidence,
  decision,
  selected,
  checked,
  onSelect,
  onCheck,
}) {
  const rejected = decision === DECISION.rejected;

  return (
    <div
      role="button"
      tabIndex={0}
      className={[styles.item, selected ? styles.selected : ''].filter(Boolean).join(' ')}
      style={{ gridTemplateColumns: columns }}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <Checkbox size="sm" checked={checked} onChange={onCheck} label={`Select ${name}`} />
      <div className={styles.body}>
        <div className={[styles.name, rejected ? styles.rejected : ''].filter(Boolean).join(' ')}>{name}</div>
        <div className={styles.sub}>{sub}</div>
      </div>
      <div>
        <Chip tone={confidenceTone(confidence)} mono>
          {formatConfidence(confidence)}
        </Chip>
      </div>
      <div className={styles.mark}>
        {decision === DECISION.approved && (
          <Icon name="check" size={14} strokeWidth={2.2} className={styles.markApproved} />
        )}
        {rejected && <Icon name="close" size={13} strokeWidth={2} className={styles.markRejected} />}
      </div>
    </div>
  );
}

/** "Why this confidence" — each reason with its weight as a small bar. */
export function SignalList({ signals }) {
  return (
    <div className={styles.signals}>
      {signals.map((signal) => {
        const tone = signalTone(signal.weight);
        return (
          <div key={signal.id} className={styles.signal}>
            <span className={[styles.signalDot, TONE_CLASS[tone]].join(' ')} />
            <span className={styles.signalText}>{signal.text}</span>
            <span className={styles.signalTrack}>
              <span
                className={[styles.signalFill, TONE_CLASS[tone]].join(' ')}
                style={{ width: `${Math.round(signal.weight * 100)}%` }}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function EvidenceTable({ columns, rows }) {
  return (
    <div className={styles.evidence}>
      <div className={styles.evidenceHead}>
        {columns.map((column) => (
          <div key={column}>{column}</div>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row.id} className={styles.evidenceRow}>
          <div className={styles.evidenceMono}>{row.a}</div>
          <div className={styles.evidenceMuted}>{row.b}</div>
          <div className={styles.evidenceDetail}>{row.c}</div>
          <div>
            <Chip tone={EVIDENCE_TONES[row.role] ?? 'neutral'}>{row.role}</Chip>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Subject —predicate→ Object, with domain and range labelled. */
export function TripleDisplay({ subject, predicate, object, cardinality }) {
  return (
    <div className={styles.triple}>
      <div className={styles.tripleNode}>
        <div className={styles.tripleBox}>{subject}</div>
        <div className={styles.tripleRole}>domain</div>
      </div>
      <div className={styles.tripleMiddle}>
        <span className={styles.triplePredicate}>{predicate}</span>
        <span className={styles.tripleArrow}>
          <span className={styles.tripleLine} />
          <Icon name="arrowRight" size={15} strokeWidth={1.6} style={{ marginLeft: -5 }} />
        </span>
        <span className={styles.tripleCardinality}>{cardinality}</span>
      </div>
      <div className={styles.tripleNode}>
        <div className={styles.tripleBox}>{object}</div>
        <div className={styles.tripleRole}>range</div>
      </div>
    </div>
  );
}
