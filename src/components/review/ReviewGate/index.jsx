import Icon from '../../ui/Icon';
import Button from '../../ui/Button';
import ProgressBar from '../../ui/ProgressBar';
import styles from './ReviewGate.module.css';

/** Layout primitives for a review gate. Both gates compose from these. */

export function GateShell({ children }) {
  return <div className={styles.gate}>{children}</div>;
}

export function GateToolbar({ children }) {
  return <div className={styles.toolbar}>{children}</div>;
}

export function ToolbarSpacer() {
  return <div className={styles.spacer} />;
}

export function BulkActions({ count, onApprove, onReject, approveLabel = 'Approve', rejectLabel = 'Reject' }) {
  if (count === 0) return null;
  return (
    <div className={styles.bulk}>
      <span className={styles.bulkCount}>{count} selected</span>
      <Button variant="approve" size="sm" iconLeft="check" onClick={onApprove}>
        {approveLabel}
      </Button>
      <Button variant="reject" size="sm" iconLeft="close" onClick={onReject}>
        {rejectLabel}
      </Button>
    </div>
  );
}

export function GateSplit({ children }) {
  return <div className={styles.split}>{children}</div>;
}

export function GateList({ children, width = 424 }) {
  return (
    <div className={styles.list} style={{ width, flexBasis: width }}>
      {children}
    </div>
  );
}

export function GateListHead({ columns, children }) {
  return (
    <div className={styles.listHead} style={{ gridTemplateColumns: columns }}>
      {children}
    </div>
  );
}

export function GateListBody({ children }) {
  return <div className={styles.listBody}>{children}</div>;
}

export function GateDetail({ children }) {
  return <div className={styles.detail}>{children}</div>;
}

export function GateDetailHeader({ title, mono = false, badges, uri, actions }) {
  return (
    <header className={styles.detailHead}>
      <div className={styles.detailHeadBody}>
        <div className={styles.detailTitleRow}>
          <span className={mono ? styles.detailTitleMono : styles.detailTitle}>{title}</span>
          {badges}
        </div>
        {uri && <div className={styles.detailUri}>{uri}</div>}
      </div>
      {actions && <div className={styles.detailActions}>{actions}</div>}
    </header>
  );
}

export function GateDetailBody({ children }) {
  return <div className={styles.detailBody}>{children}</div>;
}

export function Definition({ children, source, sourceIcon }) {
  return (
    <div>
      <p className={styles.definition}>{children}</p>
      {source && (
        <div className={styles.definitionSource}>
          <Icon name={sourceIcon ?? 'doc'} size={13} />
          {source}
        </div>
      )}
    </div>
  );
}

export function LinkChips({ items, onSelect }) {
  if (!items?.length) return null;
  return (
    <div className={styles.chipRow}>
      {items.map((item) => (
        <button key={item.id} type="button" className={styles.linkChip} onClick={() => onSelect(item.id)}>
          <Icon name="link" size={12} style={{ color: 'var(--text-5)' }} />
          {item.label}
        </button>
      ))}
    </div>
  );
}

/**
 * The gate footer. Its job is to make the cost of leaving items undecided
 * visible before the reviewer commits — hence the explicit undecided warning.
 */
export function GateFooter({ tally, undecidedWarning, onApproveRest, primaryLabel, onPrimary, secondary }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.progress}>
        <div className={styles.progressLabel}>
          <span className={styles.progressCount}>
            {tally.decided} of {tally.total} decided
          </span>
          <span className={styles.progressBreak}>
            {tally.approved} approved · {tally.rejected} rejected
          </span>
        </div>
        <ProgressBar
          total={tally.total}
          label={`${tally.decided} of ${tally.total} decided`}
          segments={[
            { id: 'approved', value: tally.approved, tone: 'ok' },
            { id: 'rejected', value: tally.rejected, tone: 'danger' },
          ]}
        />
      </div>

      {tally.undecided > 0 && undecidedWarning && (
        <span className={styles.warning}>
          <span className={styles.warningDot} />
          {undecidedWarning}
        </span>
      )}

      <div className={styles.spacer} />

      {onApproveRest && tally.undecided > 0 && (
        <Button variant="secondary" size="lg" onClick={onApproveRest}>
          Approve everything undecided
        </Button>
      )}
      {secondary}
      <Button
        variant="primary"
        size="lg"
        iconRight="arrowRight"
        disabled={tally.approved === 0}
        onClick={onPrimary}
      >
        {primaryLabel}
      </Button>
    </footer>
  );
}
