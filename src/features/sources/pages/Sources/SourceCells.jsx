import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import {
  canExtract,
  extractLabel,
  sourceRunId,
  sourceStatus,
} from '@/features/sources/sourceStatus';
import styles from './Sources.module.css';

/** The two cells every source row ends with, whichever list it is in. */
const sourceShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  lastRun: PropTypes.string,
  lastRunId: PropTypes.string,
  activeRun: PropTypes.string,
  drift: PropTypes.string,
});

export function StatusCell({ source, triggered }) {
  const state = sourceStatus(source, triggered);
  return (
    <div>
      <Chip tone={state.tone}>{state.label}</Chip>
    </div>
  );
}

/**
 * Two actions, in the order the question is usually asked: what did the last
 * run make of this source, and then — knowing that — do I run it again.
 *
 * The run link is only there once there is a run to open; a source that has
 * never been extracted has no provenance to show yet.
 *
 * A drifted source is the one the page is asking you to re-run, so its button
 * carries the warning rather than sitting quietly next to the others.
 */
export function ActionCell({ source, triggered, onTrigger, onOpenRun }) {
  const runId = sourceRunId(source);

  return (
    <div className={styles.actionCell}>
      {runId && (
        <Button
          size="sm"
          variant="secondary"
          iconRight="arrowRight"
          onClick={() => onOpenRun(runId)}
        >
          View run detail
        </Button>
      )}
      <Button
        size="sm"
        variant={source.drift ? 'warn' : 'secondary'}
        iconLeft={source.lastRun ? 'refresh' : 'play'}
        disabled={!canExtract(source, triggered)}
        onClick={() => onTrigger(source)}
      >
        {extractLabel(source, triggered)}
      </Button>
    </div>
  );
}

StatusCell.propTypes = {
  source: sourceShape.isRequired,
  triggered: PropTypes.instanceOf(Set).isRequired,
};

ActionCell.propTypes = {
  source: sourceShape.isRequired,
  triggered: PropTypes.instanceOf(Set).isRequired,
  onTrigger: PropTypes.func.isRequired,
  onOpenRun: PropTypes.func.isRequired,
};
