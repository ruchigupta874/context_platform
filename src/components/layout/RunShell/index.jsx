import { useMemo } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import { PageBody } from '@/components/layout/AppShell';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import { EmptyState, Panel } from '@/components/ui/Surfaces';
import StageStepper from '@/components/pipeline/StageStepper';
import { STAGE_STATE, describeStages, stageRoute } from '@/config/constants/pipeline';
import { RUN_STATUS, RUN_STATUS_META } from '@/config/constants/runs';
import { RUN_DETAIL, findRun } from '@/mocks/runs';
import { useWorkspace } from '@/hooks/useWorkspace';
import { buildPath } from '@/routes/paths';
import { joinMeta } from '@/utils/format';
import styles from './RunShell.module.css';

const VIEW_LABEL = {
  graph: 'Knowledge graph',
  ontology: 'Ontology',
  concepts: 'Concepts & relationships',
  questions: 'Competency questions',
};

/** Which of the run's screens the path is on. Stage ids double as view ids. */
function viewOf(pathname) {
  if (pathname.endsWith('/review/concepts')) return 'concepts';
  if (pathname.endsWith('/review/questions')) return 'questions';
  if (pathname.endsWith('/ontology')) return 'ontology';
  if (pathname.endsWith('/graph')) return 'graph';
  return 'index';
}

/**
 * Chrome shared by everything that belongs to one run.
 *
 * The run bar and the stepper are mounted here rather than on a page, so moving
 * between the ontology and the graph reads as staying inside the run instead of
 * launching a fresh screen. The stepper navigates too — back to either gate, or
 * forward to the graph — so the run can be walked in both directions.
 */
export default function RunShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspace, workspaceId } = useWorkspace();
  const { runId } = useParams();

  const run = findRun(runId);

  const stages = useMemo(() => (run ? describeStages(run.stage, run.status) : []), [run]);

  const stepperMeta = useMemo(
    () =>
      stages.reduce((acc, item) => {
        if (item.state === STAGE_STATE.done)
          acc[item.id] = RUN_DETAIL.stages[item.id]?.duration ?? 'done';
        else if (item.state === STAGE_STATE.gate) acc[item.id] = 'waiting on you';
        else if (item.state === STAGE_STATE.running) acc[item.id] = 'running';
        else acc[item.id] = 'blocked';
        return acc;
      }, {}),
    [stages],
  );

  if (!run) {
    return (
      <>
        <TopBar
          crumbs={[
            { label: workspace.name },
            { label: 'Runs', to: buildPath.runs(workspaceId) },
            { label: runId, mono: true },
          ]}
        />
        <PageBody>
          <Panel
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <EmptyState
              icon="alert"
              title={`${runId} is not a run in this workspace`}
              hint="The run may belong to another workspace, or the link may be stale."
              action={
                <Button
                  variant="primary"
                  iconRight="arrowRight"
                  onClick={() => navigate(buildPath.runs(workspaceId))}
                >
                  Back to runs
                </Button>
              }
            />
          </Panel>
        </PageBody>
      </>
    );
  }

  const view = viewOf(location.pathname);
  const statusMeta = RUN_STATUS_META[run.status];
  const inFlight = run.status === RUN_STATUS.running || run.status === RUN_STATUS.needsReview;

  const summary = joinMeta(
    `Started ${run.startedAt} by ${run.startedBy}`,
    `${run.strategy.toLowerCase()} strategy`,
    run.sources,
  );

  const tabClass = ({ isActive }) =>
    [styles.tab, isActive ? styles.tabActive : ''].filter(Boolean).join(' ');

  return (
    <>
      <TopBar
        crumbs={[
          { label: workspace.name },
          { label: 'Runs', to: buildPath.runs(workspaceId) },
          {
            label: runId,
            mono: true,
            to: view === 'index' ? undefined : buildPath.runDetail(workspaceId, runId),
          },
          ...(view === 'index' ? [] : [{ label: VIEW_LABEL[view] }]),
        ]}
        note={topBarNote(view, run)}
        actions={topBarActions(view, run, () => navigate(buildPath.newRun(workspaceId)))}
      />

      <div className={styles.runBar}>
        <div>
          <div className={styles.runId}>
            <span className={styles.runIdText}>{runId}</span>
            <Chip tone={statusMeta.tone} size="lg" dot>
              {statusMeta.label.toUpperCase()}
            </Chip>
          </div>
          <div className={styles.runSummary}>{summary}</div>
        </div>
        <div className={styles.spacer} />
        {inFlight && (
          <>
            <Button variant="secondary" iconLeft="pause">
              Hold
            </Button>
            <Button variant="secondary" iconLeft="close" style={{ color: 'var(--danger)' }}>
              Cancel run
            </Button>
          </>
        )}
      </div>

      <StageStepper
        stages={stages}
        variant="compact"
        showMeta
        meta={stepperMeta}
        isSelectable={(stage) => stage.id !== view && Boolean(stageRoute(stage, run))}
        onSelect={(stageId) => {
          const target = stageRoute(
            stages.find((s) => s.id === stageId),
            run,
          );
          if (target) navigate(buildPath[target](workspaceId, runId));
        }}
      />

      <nav className={styles.tabs} aria-label="Run output">
        <NavLink to={buildPath.runGraph(workspaceId, runId)} className={tabClass}>
          Knowledge graph
        </NavLink>
        <NavLink to={buildPath.runOntology(workspaceId, runId)} className={tabClass}>
          Ontology
        </NavLink>
        {!run.output && <span className={styles.tabNote}>built when the run finishes</span>}
      </nav>

      <Outlet context={{ run, stages, selectedStageId: run.stage }} />
    </>
  );
}

/**
 * Actions belong to the view, but the bar they sit in belongs to the run, so
 * the shell picks them rather than mounting a second TopBar per tab. A run that
 * has produced nothing has nothing to export or publish.
 */
function topBarActions(view, run, onNewRun) {
  if (view === 'concepts' || view === 'questions') return null;

  if (!run.output) {
    return (
      <Button variant="primary" iconLeft="plus" onClick={onNewRun}>
        New extraction
      </Button>
    );
  }

  if (view === 'ontology') {
    return (
      <>
        <Button variant="secondary" iconLeft="download">
          OWL
        </Button>
        <Button variant="secondary" iconLeft="download">
          R2RML
        </Button>
        <Button variant="primary">Publish {run.output.version}</Button>
      </>
    );
  }

  return (
    <>
      <Button variant="secondary" iconLeft="download">
        Export subgraph
      </Button>
      <Button variant="primary">Query console</Button>
    </>
  );
}

function topBarNote(view, run) {
  if (view === 'concepts' || view === 'questions') return '2 more runs waiting in the queue';
  if (!run.output) return null;
  if (view === 'ontology') {
    return joinMeta(
      run.output.version,
      `${run.output.concepts} concepts`,
      `${run.output.relations} relationships`,
    );
  }
  return joinMeta(run.output.version, `${run.output.nodes} nodes`, `${run.output.edges} edges`);
}
