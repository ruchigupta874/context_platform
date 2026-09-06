import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import { Panel, PanelHeader } from '@/components/ui/Surfaces';
import { PipelineTrack, describeStages } from '@/features/runs';
import { joinMeta, pluralize } from '@/utils/format';
import styles from '../Overview.module.css';

/** Runs currently executing, each with its stage track. */
export default function InFlightPanel({ runs, onOpen }) {
  return (
    <Panel>
      <PanelHeader title="In flight" meta={pluralize(runs.length, 'run')} />
      {runs.length === 0 ? (
        <div className={styles.quiet}>
          <Icon name="pause" size={14} />
          Nothing is running right now.
        </div>
      ) : (
        <ul className={styles.rows}>
          {runs.map((run) => (
            <li key={run.id}>
              <button type="button" className={styles.flightRow} onClick={() => onOpen(run)}>
                <div className={styles.flightTop}>
                  <span className={styles.rowTitle}>{run.id}</span>
                  <span className={styles.rowMeta}>{joinMeta(run.strategy, run.startedAt)}</span>
                </div>
                <PipelineTrack
                  stages={describeStages(run.stage, run.status)}
                  note={run.stageNote}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

InFlightPanel.propTypes = {
  runs: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
  onOpen: PropTypes.func.isRequired,
};
