import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import { Banner, Panel } from '@/components/ui/Surfaces';
import { RUN_STATUS_META } from '@/features/runs/constants';
import { STAGE_STATE } from '@/features/runs/pipeline';
import { describeThread } from '@/features/runs/provenance';
import { joinMeta } from '@/utils/format';
import styles from './ProvenanceThread.module.css';

const DISC_CLASS = {
  [STAGE_STATE.done]: styles.discDone,
  [STAGE_STATE.gate]: styles.discGate,
  [STAGE_STATE.running]: styles.discRunning,
  [STAGE_STATE.failed]: styles.discFailed,
  [STAGE_STATE.pending]: '',
};

/** Stage numbers read as 01–07, so every disc holds the same width of digits. */
const stageNumber = (index) => String(index + 1).padStart(2, '0');

/** A stage the run has got to, whether it is through it or sitting on it. */
const isReached = (stage) => Boolean(stage) && stage.state !== STAGE_STATE.pending;

/**
 * Each node draws its own half of the line on either side rather than the track
 * being drawn between them.
 *
 * With seven stages there is no width the panel can count on, and a connector
 * sized from a fixed node width either falls short of the discs or runs into
 * them. Halves anchored to their own node always meet in the middle.
 *
 * `present` is false at the two ends of the track, where the half still holds
 * its space — that is what keeps every disc centred under its own label.
 */
function railClass(present, filled) {
  if (!present) return [styles.line, styles.lineBlank].join(' ');
  return [styles.line, filled ? styles.lineFilled : ''].filter(Boolean).join(' ');
}

/**
 * The run's own page, told as one line: where it has been, where it stopped,
 * and the single thing it is waiting for.
 *
 * The discs double as the page's index. Selecting one asks the page to describe
 * that stage below — which is why a stage the run has not reached is inert, as
 * it has produced no figures to describe. The callout is not part of that: it
 * stays on what the run is waiting for however far back you browse.
 *
 * Presentational — `stages` arrives from `describeStages()` and the callout from
 * `describeThread()`, so the only thing this component decides is what a stage
 * looks like in each state. Navigation is handed back to the page as a
 * `buildPath` key rather than performed here.
 */
export default function ProvenanceThread({ run, stages, selectedId, onSelectStage, onNavigate }) {
  const status = RUN_STATUS_META[run.status];
  const thread = describeThread(run);

  return (
    <Panel className={styles.card}>
      <header className={styles.head}>
        <div className={styles.heading}>
          <h2 className={styles.title}>{run.id} provenance thread</h2>
          <p className={styles.subtitle}>
            {joinMeta(run.sources, `Started ${run.startedAt} by ${run.startedBy}`)}
          </p>
        </div>
        <Chip tone={status.tone} size="lg" dot={!status.spinner}>
          {status.label}
        </Chip>
      </header>

      <ol className={styles.thread}>
        {stages.map((stage, index) => {
          const reached = isReached(stage);
          const done = stage.state === STAGE_STATE.done;
          const current = reached && !done;
          const selected = stage.id === selectedId;
          const NodeTag = reached ? 'button' : 'div';

          return (
            <li key={stage.id} className={styles.node}>
              <NodeTag
                type={reached ? 'button' : undefined}
                className={[
                  styles.step,
                  reached ? styles.stepSelectable : '',
                  selected ? styles.stepSelected : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={reached ? () => onSelectStage(stage.id) : undefined}
                aria-pressed={reached ? selected : undefined}
                aria-current={current ? 'step' : undefined}
              >
                <span className={[styles.disc, DISC_CLASS[stage.state]].filter(Boolean).join(' ')}>
                  {done ? (
                    <Icon name="check" size={17} strokeWidth={2.2} />
                  ) : (
                    stageNumber(stage.index)
                  )}
                </span>
                <span
                  className={[styles.label, current || selected ? styles.labelCurrent : '']
                    .filter(Boolean)
                    .join(' ')}
                >
                  {stage.label}
                </span>
                <span className={styles.caption}>{stage.caption}</span>
              </NodeTag>
              {/* After the step, so a selected stage's tinted band cannot paint
                  over the track running through it. The disc lifts itself back
                  above the line with a z-index of its own. */}
              <span className={styles.rail} aria-hidden="true">
                <span className={railClass(index > 0, reached)} />
                <span
                  className={railClass(index < stages.length - 1, isReached(stages[index + 1]))}
                />
              </span>
            </li>
          );
        })}
      </ol>

      <Banner
        tone={thread.tone}
        icon={thread.icon}
        title={thread.title}
        note={thread.note}
        actions={
          thread.route && (
            <Button
              variant="primary"
              size="lg"
              iconRight="arrowRight"
              onClick={() => onNavigate(thread.route)}
            >
              {thread.action}
            </Button>
          )
        }
      />
    </Panel>
  );
}

ProvenanceThread.propTypes = {
  run: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    sources: PropTypes.string,
    startedAt: PropTypes.string,
    startedBy: PropTypes.string,
  }).isRequired,
  stages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node,
      caption: PropTypes.node,
      index: PropTypes.number.isRequired,
      state: PropTypes.oneOf(Object.values(STAGE_STATE)).isRequired,
    }),
  ).isRequired,
  selectedId: PropTypes.string,
  onSelectStage: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
};
