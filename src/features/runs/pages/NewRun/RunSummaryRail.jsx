import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import { Panel, SectionLabel, StatPairs } from '@/components/ui/Surfaces';
import styles from './NewRun.module.css';

/** What this run will do, and the button that starts it. */
export default function RunSummaryRail({ summary, stages, canRun, onRun }) {
  return (
    <Panel className={styles.rail}>
      <SectionLabel>Run summary</SectionLabel>
      <StatPairs pairs={summary} keyWidth={92} />
      <div className={styles.divider} />

      <div>
        <SectionLabel>Stages</SectionLabel>
        <div className={styles.stageList}>
          {stages.map((stage, index) => (
            <div key={stage.id} className={styles.stageItem}>
              <div className={styles.stageRail}>
                <span
                  className={[styles.stageDot, stage.active ? styles.stageDotGate : '']
                    .filter(Boolean)
                    .join(' ')}
                />
                {index < stages.length - 1 && <span className={styles.stageLine} />}
              </div>
              <div className={styles.stageBody}>
                <div className={styles.stageName}>{stage.label}</div>
                <div
                  className={[styles.stageMeta, stage.active ? styles.stageMetaGate : '']
                    .filter(Boolean)
                    .join(' ')}
                >
                  {stage.active ? 'Pauses for review' : 'Automatic'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button variant="primary" size="lg" iconLeft="play" block disabled={!canRun} onClick={onRun}>
        Run extraction
      </Button>
      <p className={styles.railNote}>
        Runs in the background. Leave this page, start another run, come back when a gate needs you.
      </p>
    </Panel>
  );
}

RunSummaryRail.propTypes = {
  summary: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.string.isRequired, value: PropTypes.node }),
  ).isRequired,
  stages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node,
      active: PropTypes.bool,
    }),
  ).isRequired,
  canRun: PropTypes.bool.isRequired,
  onRun: PropTypes.func.isRequired,
};
