import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import { canExtract, extractLabel, sourceStatus } from '@/features/sources/sourceStatus';
import styles from './Sources.module.css';

/** The two cells every source row ends with, whichever list it is in. */
const sourceShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  lastRun: PropTypes.string,
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
 * A drifted source is the one the page is asking you to re-run, so its button
 * carries the warning rather than sitting quietly next to the others.
 */
export function ActionCell({ source, triggered, onTrigger }) {
  return (
    <div className={styles.actionCell}>
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
};
