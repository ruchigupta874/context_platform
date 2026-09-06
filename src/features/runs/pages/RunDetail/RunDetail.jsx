import { Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import { Panel, PanelHeader, SectionLabel, StatGrid, StatPairs } from '@/components/ui/Surfaces';
import { PIPELINE_STAGES, STAGE_STATE } from '@/features/runs/pipeline';
import { BLOCKED_LINE, LOG_TAG_TONES, RUN_DETAIL } from '@/features/runs/mocks';
import { useWorkspace } from '@/features/workspaces';
import { buildPath } from '@/routes/paths';
import styles from './RunDetail.module.css';

const ICON_TONE_CLASS = {
  ok: styles.iconOk,
  warn: styles.iconWarn,
  pending: styles.iconPending,
};

/**
 * Where a run opens.
 *
 * A finished run goes straight to its graph — that is the thing you came for.
 * A run still moving has no graph to show, so it stays here and reports the
 * stage it is actually at instead of landing on an empty viewer.
 */
export default function RunDetail() {
  const navigate = useNavigate();
  const { workspaceId } = useWorkspace();
  const { runId } = useParams();
  const { run, stages, selectedStageId } = useOutletContext();

  if (run.output) return <Navigate to="graph" replace />;

  const stage = PIPELINE_STAGES.find((s) => s.id === selectedStageId) ?? PIPELINE_STAGES[0];
  const stageState = stages.find((s) => s.id === selectedStageId)?.state;
  const panel = RUN_DETAIL.stages[selectedStageId] ?? {};
  const blocked = stageState === STAGE_STATE.pending;

  return (
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
                  {index < RUN_DETAIL.activity.length - 1 && (
                    <span className={styles.activityLine} />
                  )}
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
  );
}
