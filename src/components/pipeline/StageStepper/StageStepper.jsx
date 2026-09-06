import { Fragment } from 'react';
import Icon from '@/components/ui/Icon';
import { STAGE_STATE } from '@/config/constants/pipeline';
import styles from './StageStepper.module.css';

const DISC_CLASS = {
  [STAGE_STATE.done]: styles.discDone,
  [STAGE_STATE.gate]: styles.discGate,
  [STAGE_STATE.running]: styles.discRunning,
  [STAGE_STATE.failed]: styles.discFailed,
  [STAGE_STATE.pending]: '',
};

/**
 * Horizontal pipeline stepper.
 *
 * `stages` comes from `describeStages()` so the component stays presentational.
 * When `onSelect` is passed the steps become buttons, so the stepper doubles as
 * the run's navigation. `isSelectable` narrows that per stage: a stage with no
 * screen of its own stays inert instead of looking clickable and going nowhere.
 */
export default function StageStepper({
  stages,
  selectedId,
  onSelect,
  isSelectable,
  variant = 'compact',
  showMeta = false,
  meta = {},
}) {
  return (
    <div className={[styles.stepper, styles[variant]].join(' ')} aria-label="Extraction pipeline">
      {stages.map((stage, index) => {
        const current = selectedId ? stage.id === selectedId : stage.state !== STAGE_STATE.pending;
        const done = stage.state === STAGE_STATE.done;
        const pending = stage.state === STAGE_STATE.pending;
        const clickable = Boolean(onSelect) && (!isSelectable || isSelectable(stage));
        const StepTag = clickable ? 'button' : 'div';

        return (
          <Fragment key={stage.id}>
            {index > 0 && (
              <span
                className={[
                  styles.connector,
                  index <= stageProgress(stages) ? styles.connectorDone : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            )}
            <StepTag
              type={clickable ? 'button' : undefined}
              className={[
                styles.step,
                clickable ? styles.clickable : '',
                current && selectedId ? styles.current : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={clickable ? () => onSelect(stage.id) : undefined}
              aria-current={current ? 'step' : undefined}
            >
              <span className={[styles.disc, DISC_CLASS[stage.state]].filter(Boolean).join(' ')}>
                {done ? <Icon name="check" size={12} strokeWidth={2.2} /> : stage.index + 1}
              </span>
              <span className={styles.text}>
                <span
                  className={[
                    styles.label,
                    current ? styles.labelCurrent : '',
                    pending ? styles.labelPending : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {stage.label}
                </span>
                {showMeta && meta[stage.id] && (
                  <span
                    className={[
                      styles.meta,
                      stage.state === STAGE_STATE.gate ? styles.metaGate : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {meta[stage.id]}
                  </span>
                )}
              </span>
            </StepTag>
          </Fragment>
        );
      })}
    </div>
  );
}

/** Index of the furthest stage reached — connectors up to here read as complete. */
function stageProgress(stages) {
  const lastActive = [...stages].reverse().find((stage) => stage.state !== STAGE_STATE.pending);
  return lastActive ? lastActive.index : 0;
}
