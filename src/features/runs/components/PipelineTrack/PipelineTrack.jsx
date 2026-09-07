import { Fragment } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import { ICON_NAMES } from '@/components/ui/Icon/paths';
import { STAGE_STATE } from '@/features/runs/pipeline';
import { TONE } from '@/config/constants/common';
import styles from './PipelineTrack.module.css';

const DOT_CLASS = {
  [STAGE_STATE.done]: styles.dotDone,
  [STAGE_STATE.gate]: styles.dotGate,
  [STAGE_STATE.running]: styles.dotRunning,
  [STAGE_STATE.failed]: styles.dotFailed,
  [STAGE_STATE.pending]: '',
};

const NOTE_CLASS = {
  [TONE.ok]: styles.noteOk,
  [TONE.info]: styles.noteInfo,
  [TONE.warn]: styles.noteWarn,
  [TONE.danger]: styles.noteDanger,
};

/** A stage the run is sitting at, rather than one it is past or has not reached. */
const isCurrent = (state) =>
  state === STAGE_STATE.gate || state === STAGE_STATE.running || state === STAGE_STATE.failed;

/**
 * A gate note names the stage it is held at — "Waiting at Concepts &
 * relationships". Weighting that half and leaving the verb plain answers
 * "waiting at what?" first, which is the only part that differs between rows.
 */
function emphasiseTarget(note, current) {
  if (typeof note !== 'string' || !current?.label || !note.endsWith(current.label)) return note;
  return (
    <>
      {note.slice(0, -current.label.length)}
      <strong className={styles.noteTarget}>{current.label}</strong>
    </>
  );
}

/**
 * The compact pipeline used in the runs list and the overview. Same data as the
 * full stepper, sized so a dozen runs can be scanned in one glance.
 *
 * Progress is the accent, not green: reaching stage three is not a success, it
 * is a position. Green belongs to the run that finished.
 */
export default function PipelineTrack({ stages, note, noteTone, noteIcon }) {
  const reached = stages.filter((stage) => stage.state !== STAGE_STATE.pending).length;
  const current = stages.find((stage) => isCurrent(stage.state));

  return (
    <div>
      <div className={styles.track}>
        {stages.map((stage, index) => (
          <Fragment key={stage.id}>
            {index > 0 && (
              <span
                className={[
                  styles.line,
                  index < reached ? styles.lineDone : '',
                  // The run is somewhere inside this segment rather than at
                  // either end of it, so the fill fades out instead of stopping.
                  stages[index - 1].state === STAGE_STATE.running ? styles.lineRunning : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            )}
            <span className={[styles.dot, DOT_CLASS[stage.state]].filter(Boolean).join(' ')} />
          </Fragment>
        ))}
        <span className={styles.fraction}>
          {reached}/{stages.length}
        </span>
      </div>

      {note && (
        <div className={[styles.note, NOTE_CLASS[noteTone]].filter(Boolean).join(' ')}>
          {noteIcon && <Icon name={noteIcon} size={11} className={styles.noteIcon} />}
          {emphasiseTarget(note, current)}
        </div>
      )}
    </div>
  );
}

PipelineTrack.propTypes = {
  stages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node,
      state: PropTypes.oneOf(Object.values(STAGE_STATE)).isRequired,
    }),
  ).isRequired,
  note: PropTypes.node,
  noteTone: PropTypes.oneOf(Object.values(TONE)),
  noteIcon: PropTypes.oneOf(ICON_NAMES),
};
