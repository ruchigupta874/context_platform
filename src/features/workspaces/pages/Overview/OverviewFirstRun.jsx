import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import { Panel } from '@/components/ui/Surfaces';
import { PageBody } from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import { PIPELINE_STAGES } from '@/features/runs';
import { pluralize } from '@/utils/format';
import styles from './Overview.module.css';

/** Sources connected but nothing run yet: explain the pipeline, then start it. */
export default function OverviewFirstRun({ sourceCount, onStartRun }) {
  return (
    <PageBody scroll>
      <PageHeader
        title="Overview"
        subtitle={`${pluralize(sourceCount, 'source')} connected. Start an extraction to turn them into an ontology and a graph.`}
      />
      <Panel pad>
        <div className={styles.stageIntro}>
          {PIPELINE_STAGES.map((stage, index) => (
            <div key={stage.id} className={styles.stageCard}>
              <div className={styles.stageTop}>
                <span className={styles.stageIcon}>
                  <Icon name={stage.icon} size={14} />
                </span>
                <span className={styles.stageIndex}>{index + 1}</span>
              </div>
              <div className={styles.stageName}>
                {stage.label}
                {stage.gate && <Chip tone="warn">gate</Chip>}
              </div>
              <p className={styles.stageBlurb}>{stage.blurb}</p>
            </div>
          ))}
        </div>
        <div className={styles.panelFoot}>
          <span className={styles.footNote}>
            Runs hold at each gate until you approve. Nothing downstream is built without you.
          </span>
          <Button variant="primary" iconRight="arrowRight" onClick={onStartRun}>
            Start first extraction
          </Button>
        </div>
      </Panel>
    </PageBody>
  );
}

OverviewFirstRun.propTypes = {
  sourceCount: PropTypes.number.isRequired,
  onStartRun: PropTypes.func.isRequired,
};
