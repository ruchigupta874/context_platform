import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import Chip from '../../components/ui/Chip';
import { Panel, PanelHeader, SectionLabel, StatGrid, StatPairs } from '../../components/ui/Surfaces';
import StageStepper from '../../components/pipeline/StageStepper';
import { PIPELINE_STAGES, STAGE_STATE, describeStages } from '../../config/constants/pipeline';
import { RUN_STATUS_META } from '../../config/constants/runs';
import { BLOCKED_LINE, LOG_TAG_TONES, RUN_DETAIL } from '../../mocks/runs';
import { useWorkspace } from '../../hooks/useWorkspace';
import { buildPath } from '../../routes/paths';
import styles from './RunDetail.module.css';

const ICON_TONE_CLASS = {
  ok: styles.iconOk,
  warn: styles.iconWarn,
  pending: styles.iconPending,
};

export default function RunDetail() {
  const navigate = useNavigate();
  const { workspaceId } = useWorkspace();
  const { runId = RUN_DETAIL.id } = useParams();

  const stages = useMemo(() => describeStages(RUN_DETAIL.stage, RUN_DETAIL.status), []);
  const [selectedStageId, setSelectedStageId] = useState(RUN_DETAIL.stage);

  const stage = PIPELINE_STAGES.find((s) => s.id === selectedStageId);
  const stageState = stages.find((s) => s.id === selectedStageId)?.state;
  const panel = RUN_DETAIL.stages[selectedStageId] ?? {};
  const blocked = stageState === STAGE_STATE.pending;

  const stepperMeta = useMemo(
    () =>
      stages.reduce((acc, item) => {
        if (item.state === STAGE_STATE.done) acc[item.id] = RUN_DETAIL.stages[item.id]?.duration ?? 'done';
        else if (item.state === STAGE_STATE.gate) acc[item.id] = 'waiting on you';
        else if (item.state === STAGE_STATE.running) acc[item.id] = 'running';
        else acc[item.id] = 'blocked';
        return acc;
      }, {}),
    [stages],
  );

  const statusMeta = RUN_STATUS_META[RUN_DETAIL.status];

  return (
    <>
      <TopBar
        crumbs={[
          { label: 'Cust360Auto' },
          { label: 'Runs', to: buildPath.runs(workspaceId) },
          { label: runId, mono: true },
        ]}
        actions={
          <Button variant="primary" iconLeft="plus" onClick={() => navigate(buildPath.newRun(workspaceId))}>
            New extraction
          </Button>
        }
      />

      <div className={styles.runBar}>
        <div>
          <div className={styles.runId}>
            <span className={styles.runIdText}>{runId}</span>
            <Chip tone={statusMeta.tone} size="lg" dot>
              {statusMeta.label.toUpperCase()}
            </Chip>
          </div>
          <div className={styles.runSummary}>{RUN_DETAIL.summary}</div>
        </div>
        <div className={styles.spacer} />
        <Button variant="secondary" iconLeft="pause">
          Hold
        </Button>
        <Button variant="secondary" iconLeft="close" style={{ color: 'var(--danger)' }}>
          Cancel run
        </Button>
      </div>

      <StageStepper
        stages={stages}
        selectedId={selectedStageId}
        onSelect={setSelectedStageId}
        variant="full"
        showMeta
        meta={stepperMeta}
      />

      <div className={styles.body}>
        <div className={styles.main}>
          <Panel
            className={[styles.stagePanel, panel.tone === 'warn' ? styles.borderWarn : '']
              .filter(Boolean)
              .join(' ')}
          >
            <div className={styles.stageHead}>
              <span
                className={[styles.stageIcon, ICON_TONE_CLASS[panel.tone ?? 'pending']]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Icon name={stage.icon} size={17} />
              </span>
              <div className={styles.stageBody}>
                <div className={styles.stageTitle}>{panel.title ?? stage.label}</div>
                <p className={styles.stageBlurb}>{panel.blurb ?? stage.blurb}</p>
              </div>
              {panel.cta && (
                <Button
                  variant="primary"
                  size="lg"
                  iconRight="arrowRight"
                  onClick={() => navigate(buildPath.reviewConcepts(workspaceId, runId))}
                >
                  {panel.cta}
                </Button>
              )}
            </div>
            {panel.metrics && <StatGrid stats={panel.metrics} columns={4} soft small />}
          </Panel>

          <Panel className={styles.logPanel}>
            <PanelHeader
              title={blocked ? 'Blocked' : panel.listTitle}
              meta={blocked ? 'starts after the review gate' : panel.listMeta}
            />
            <div className={styles.logBody}>
              {(blocked ? [BLOCKED_LINE] : (panel.lines ?? [])).map((line) => (
                <div key={line.id} className={styles.logLine}>
                  <span className={styles.logLead}>{line.lead}</span>
                  <span className={styles.logMessage}>{line.message}</span>
                  <Chip tone={LOG_TAG_TONES[line.tag] ?? 'neutral'} mono>
                    {line.tag}
                  </Chip>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <aside className={styles.rail}>
          <Panel className={styles.railPanel}>
            <SectionLabel>Configuration</SectionLabel>
            <StatPairs pairs={RUN_DETAIL.config} />
          </Panel>

          <Panel className={styles.activityPanel}>
            <SectionLabel>Activity</SectionLabel>
            <div className={styles.activityList}>
              {RUN_DETAIL.activity.map((entry, index) => (
                <div key={entry.id} className={styles.activityItem}>
                  <div className={styles.activityRail}>
                    <span
                      className={[
                        styles.activityDot,
                        entry.kind === 'gate' ? styles.dotGate : '',
                        entry.kind === 'note' ? styles.dotNote : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    />
                    {index < RUN_DETAIL.activity.length - 1 && <span className={styles.activityLine} />}
                  </div>
                  <div className={styles.activityBody}>
                    <div className={styles.activityText}>{entry.message}</div>
                    <div className={styles.activityTime}>{entry.at}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </>
  );
}
