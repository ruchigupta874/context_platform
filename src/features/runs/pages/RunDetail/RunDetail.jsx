import { useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { Panel, StatGrid } from '@/components/ui/Surfaces';
import ProvenanceThread from '@/features/runs/components/ProvenanceThread';
import { PIPELINE_STAGES, STAGE_STATE, stageRoute } from '@/features/runs/pipeline';
import { findStagePanel } from '@/features/runs/mocks';
import { useWorkspace } from '@/features/workspaces';
import { buildPath } from '@/routes/paths';
import styles from './RunDetail.module.css';

const ICON_TONE_CLASS = {
  ok: styles.iconOk,
  warn: styles.iconWarn,
  info: styles.iconInfo,
  pending: styles.iconPending,
};

/** A stage with no tone of its own is coloured by where the run got to. */
const TONE_BY_STATE = {
  [STAGE_STATE.done]: 'ok',
  [STAGE_STATE.running]: 'info',
  [STAGE_STATE.gate]: 'warn',
  [STAGE_STATE.failed]: 'danger',
  [STAGE_STATE.pending]: 'pending',
};

/** What opening a stage's own screen is called, by the route it leads to. */
const STAGE_ACTION = {
  reviewConcepts: 'Open review',
  reviewQuestions: 'Open review',
  runGraph: 'Open graph',
};

/**
 * A run's own page.
 *
 * It opens with the provenance thread — the whole run as one line, ending in
 * the single thing it is waiting for — and then describes one stage of it in
 * full. Which stage that is follows the thread: by default wherever the run
 * stopped, and whichever disc you click after that.
 *
 * The thread's callout carries the run's one call to action, so this panel
 * reports rather than asks; its own button is secondary and only opens the
 * screen the selected stage owns.
 */
export default function RunDetail() {
  const navigate = useNavigate();
  const { workspaceId } = useWorkspace();
  const { runId } = useParams();
  const { run, stages, selectedStageId } = useOutletContext();

  // The selection is stamped with the run it was made on, so moving to another
  // run falls back to wherever that run stopped instead of carrying a stage
  // picked on the last one. No effect needed — it resolves as we render.
  const [picked, setPicked] = useState({ runId, stageId: null });
  const stageId = (picked.runId === runId && picked.stageId) || selectedStageId;
  const stage = PIPELINE_STAGES.find((s) => s.id === stageId) ?? PIPELINE_STAGES[0];
  const state = stages.find((s) => s.id === stageId)?.state;
  const panel = findStagePanel(runId, stageId) ?? {};
  const tone = panel.tone ?? TONE_BY_STATE[state] ?? 'pending';

  // The callout already speaks for the stage the run is sitting on, so the
  // panel only offers a way in when you have browsed away from it.
  const route = stageId === selectedStageId ? null : stageRoute(stage, run);

  const open = (target) => navigate(buildPath[target](workspaceId, runId));

  return (
    <div className={styles.body}>
      <ProvenanceThread
        run={run}
        stages={stages}
        selectedId={stageId}
        onSelectStage={(id) => setPicked({ runId, stageId: id })}
        onNavigate={open}
      />

      <Panel className={styles.stagePanel}>
        <div className={styles.stageHead}>
          <span className={[styles.stageIcon, ICON_TONE_CLASS[tone]].filter(Boolean).join(' ')}>
            <Icon name={stage.icon} size={17} />
          </span>
          <div className={styles.stageBody}>
            <div className={styles.stageTitle}>{panel.title ?? stage.label}</div>
            <p className={styles.stageBlurb}>{panel.blurb ?? stage.blurb}</p>
          </div>
          {panel.duration && <span className={styles.stageDuration}>{panel.duration}</span>}
          {route && (
            <Button size="sm" iconRight="arrowRight" onClick={() => open(route)}>
              {STAGE_ACTION[route]}
            </Button>
          )}
        </div>

        {panel.metrics ? (
          <StatGrid stats={panel.metrics} columns={Math.min(panel.metrics.length, 4)} soft small />
        ) : (
          <p className={styles.noFigures}>
            {state === STAGE_STATE.pending
              ? 'This stage has not run yet.'
              : 'This stage recorded no figures of its own.'}
          </p>
        )}
      </Panel>
    </div>
  );
}
