import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Chip from '@/components/ui/Chip';
import Icon from '@/components/ui/Icon';
import { DataTableRow } from '@/components/ui/DataTable';
import { DECISION } from '@/config/constants/common';
import { statusMetaFor } from '@/features/review/gateItems';
import { CONCEPT_COLUMNS } from '@/features/review/constants';
import { confidenceTone, formatConfidence, joinMeta } from '@/utils/format';
import styles from '@/features/review/components/GateTable/GateTable.module.css';

/**
 * One concept in the table.
 *
 * The three actions are icons alone, because they repeat on every row: the
 * words would be read once and then scanned past fifty times, while the shapes
 * stay legible at a glance. Each carries its name for a screen reader and as a
 * hover title, so nothing is hidden — only unrepeated.
 *
 * Approve and reject show their state rather than just their intent: the button
 * that made the current decision stays filled, so the Status chip is a
 * confirmation of what the row shows rather than the only place it is said.
 */
export default function ConceptRow({
  item,
  decision,
  checked,
  onCheck,
  onApprove,
  onReject,
  onOpen,
}) {
  const status = statusMetaFor(decision);
  const approved = decision === DECISION.approved;
  const rejected = decision === DECISION.rejected;

  return (
    <DataTableRow columns={CONCEPT_COLUMNS} selected={checked} height="52px">
      <Checkbox size="sm" checked={checked} onChange={onCheck} label={`Select ${item.name}`} />

      <div className={styles.cellName}>
        <button type="button" className={styles.nameButton} onClick={onOpen}>
          <span className={rejected ? styles.nameStruck : undefined}>{item.name}</span>
        </button>
        {item.aliases.length > 0 && (
          <span className={styles.aliasCount}>+{item.aliases.length} aliases</span>
        )}
      </div>

      <div className={styles.cellType} title={joinMeta(item.type, item.role)}>
        {item.type}
      </div>

      <div className={styles.cellDefinition} title={item.definition}>
        {item.definition}
      </div>

      <div>
        <Chip tone={confidenceTone(item.confidence)} mono>
          {formatConfidence(item.confidence)}
        </Chip>
      </div>

      <div>
        <Chip tone={status.tone} icon={<Icon name={status.icon} size={11} />}>
          {status.label}
        </Chip>
      </div>

      <div className={styles.cellActions}>
        <Button
          size="icon"
          variant={approved ? 'approveActive' : 'approve'}
          iconLeft="check"
          aria-pressed={approved}
          aria-label={approved ? `Approved ${item.name}` : `Approve ${item.name}`}
          title={approved ? 'Approved — click to undo' : 'Approve'}
          onClick={onApprove}
        />
        <Button
          size="icon"
          variant={rejected ? 'rejectActive' : 'reject'}
          iconLeft="close"
          aria-pressed={rejected}
          aria-label={rejected ? `Rejected ${item.name}` : `Reject ${item.name}`}
          title={rejected ? 'Rejected — click to undo' : 'Reject'}
          onClick={onReject}
        />
        <Button
          size="icon"
          variant="ghost"
          iconLeft="expand"
          aria-label={`Open ${item.name}`}
          title="Definition, aliases and provenance"
          onClick={onOpen}
        />
      </div>
    </DataTableRow>
  );
}

ConceptRow.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    aliases: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    definition: PropTypes.string,
    confidence: PropTypes.number.isRequired,
  }).isRequired,
  decision: PropTypes.oneOf(Object.values(DECISION)),
  checked: PropTypes.bool,
  onCheck: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
};
