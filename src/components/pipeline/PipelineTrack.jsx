import { Fragment } from 'react';
import { STAGE_STATE } from '../../config/constants/pipeline';
import styles from './PipelineTrack.module.css';

const DOT_CLASS = {
  [STAGE_STATE.done]: styles.dotDone,
  [STAGE_STATE.gate]: styles.dotGate,
  [STAGE_STATE.running]: styles.dotRunning,
  [STAGE_STATE.failed]: styles.dotFailed,
  [STAGE_STATE.pending]: '',
};

/**
 * The compact five-dot pipeline used in the runs list. Same data as the full
 * stepper, sized so a dozen runs can be scanned in one glance.
 */
export default function PipelineTrack({ stages, note, noteTone }) {
  const reached = stages.filter((s) => s.state !== STAGE_STATE.pending).length - 1;

  return (
    <div>
      <div className={styles.track}>
        {stages.map((stage, index) => {
          const current =
            stage.state === STAGE_STATE.gate ||
            stage.state === STAGE_STATE.running ||
            stage.state === STAGE_STATE.failed;
          return (
            <Fragment key={stage.id}>
              {index > 0 && (
                <span className={[styles.line, index <= reached ? styles.lineDone : ''].filter(Boolean).join(' ')} />
              )}
              <span
                className={[styles.dot, current ? styles.dotCurrent : '', DOT_CLASS[stage.state]]
                  .filter(Boolean)
                  .join(' ')}
              />
            </Fragment>
          );
        })}
      </div>
      {note && (
        <div
          className={[
            styles.note,
            noteTone === 'warn' ? styles.noteGate : '',
            noteTone === 'danger' ? styles.noteFailed : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {note}
        </div>
      )}
    </div>
  );
}
