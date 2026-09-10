import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Chip from '@/components/ui/Chip';
import Icon from '@/components/ui/Icon';
import { DataTableRow } from '@/components/ui/DataTable';
import { DECISION } from '@/config/constants/common';
import { statusMetaFor } from '@/features/review/gateItems';
import { RELATIONSHIP_COLUMNS } from '@/features/review/constants';
import { relationshipLabel } from '@/features/review/relationshipReview';
import { confidenceTone, formatConfidence } from '@/utils/format';
import gate from '@/features/review/components/GateTable/GateTable.module.css';
import styles from './ReviewRelations.module.css';

/**
 * One relationship in the table.
 *
 * The triple reads across three columns, with the predicate in mono between two
 * concept names: a reviewer scanning for everything hanging off Customer reads
 * down the source column, and the shape of the claim stays legible without
 * having to parse a sentence per row.
 *
 * The three actions are icons alone, because they repeat on every row — the
 * words would be read once and scanned past twenty-five times. Each carries its
 * name for a screen reader and as a hover title, so nothing is hidden, only
 * unrepeated.
 */
export default function RelationRow({
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
  const label = relationshipLabel(item);

  return (
    <DataTableRow columns={RELATIONSHIP_COLUMNS} selected={checked} height="52px">
      <Checkbox size="sm" checked={checked} onChange={onCheck} label={`Select ${label}`} />

      <div className={gate.cellName}>
        <button type="button" className={gate.nameButton} onClick={onOpen}>
          <span className={rejected ? gate.nameStruck : undefined}>{item.source}</span>
        </button>
      </div>

      <div className={styles.predicate} title={item.cardinality}>
        {item.predicate}
      </div>

      <div className={styles.target}>{item.target}</div>

      <div className={gate.cellDefinition} title={item.evidence}>
        {item.evidence}
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

      <div className={gate.cellActions}>
        <Button
          size="icon"
          variant={approved ? 'approveActive' : 'approve'}
          iconLeft="check"
          aria-pressed={approved}
          aria-label={approved ? `Approved ${label}` : `Approve ${label}`}
          title={approved ? 'Approved — click to undo' : 'Approve'}
          onClick={onApprove}
        />
        <Button
          size="icon"
          variant={rejected ? 'rejectActive' : 'reject'}
          iconLeft="close"
          aria-pressed={rejected}
          aria-label={rejected ? `Rejected ${label}` : `Reject ${label}`}
          title={rejected ? 'Rejected — click to undo' : 'Reject'}
          onClick={onReject}
        />
        <Button
          size="icon"
          variant="ghost"
          iconLeft="expand"
          aria-label={`Open ${label}`}
          title="Evidence, confidence and provenance"
          onClick={onOpen}
        />
      </div>
    </DataTableRow>
  );
}

RelationRow.propTypes = {
  item: PropTypes.shape({
    source: PropTypes.string.isRequired,
    predicate: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    cardinality: PropTypes.string,
    evidence: PropTypes.string,
    confidence: PropTypes.number.isRequired,
  }).isRequired,
  decision: PropTypes.oneOf(Object.values(DECISION)),
  checked: PropTypes.bool,
  onCheck: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
};
