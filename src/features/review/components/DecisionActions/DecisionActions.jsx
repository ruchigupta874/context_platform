import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import { DECISION } from '@/config/constants/common';

/**
 * Approve / reject pair for the currently open item.
 *
 * The buttons show state rather than just intent — once approved the button
 * reads "Approved" and stays filled, so the reviewer can see at a glance what
 * they already decided about the item in front of them.
 */
export default function DecisionActions({
  decision,
  onApprove,
  onReject,
  onEdit,
  labels = {
    approve: { idle: 'Approve', done: 'Approved' },
    reject: { idle: 'Reject', done: 'Rejected' },
  },
}) {
  const approved = decision === DECISION.approved;
  const rejected = decision === DECISION.rejected;

  return (
    <>
      {onEdit && (
        <Button
          variant="secondary"
          size="icon"
          iconLeft="edit"
          onClick={onEdit}
          aria-label="Edit"
        />
      )}
      <Button
        variant={rejected ? 'rejectActive' : 'reject'}
        iconLeft="close"
        onClick={onReject}
        aria-pressed={rejected}
      >
        {rejected ? labels.reject.done : labels.reject.idle}
      </Button>
      <Button
        variant={approved ? 'approveActive' : 'approve'}
        iconLeft="check"
        onClick={onApprove}
        aria-pressed={approved}
      >
        {approved ? labels.approve.done : labels.approve.idle}
      </Button>
    </>
  );
}

const decisionLabelShape = PropTypes.shape({
  idle: PropTypes.string.isRequired,
  done: PropTypes.string.isRequired,
});

DecisionActions.propTypes = {
  decision: PropTypes.oneOf(Object.values(DECISION)),
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
  onEdit: PropTypes.func,
  labels: PropTypes.shape({
    approve: decisionLabelShape,
    reject: decisionLabelShape,
  }),
};
