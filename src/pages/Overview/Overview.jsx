import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import { PageBody } from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import ProgressBar from '@/components/ui/ProgressBar';
import PipelineTrack from '@/components/pipeline/PipelineTrack';
import { EmptyState, Panel, PanelHeader, StatGrid } from '@/components/ui/Surfaces';
import { RUN_STATUS } from '@/config/constants/runs';
import { PIPELINE_STAGES, describeStages } from '@/config/constants/pipeline';
import { RUNS } from '@/mocks/runs';
import { TABLES, DOCUMENTS, LAST_SYNCED } from '@/mocks/sources';
import { QUESTION_COVERAGE, VALIDATION_FINDINGS } from '@/mocks/ontology';
import { GRAPH_TOTALS, BUILT_BY_RUN } from '@/mocks/graph';
import { useWorkspace } from '@/hooks/useWorkspace';
import { buildPath } from '@/routes/paths';
import { joinMeta, pluralize } from '@/utils/format';
import { SOURCE_KIND } from '@/config/constants/sources';
import styles from './Overview.module.css';

const STAGE_LABEL = Object.fromEntries(PIPELINE_STAGES.map((stage) => [stage.id, stage.label]));

/**
 * Which screen a run wants you on. Gate stages carry their own `route` in the
 * pipeline config, so this stays correct if a gate is ever added or moved.
 */
function runTarget(run, workspaceId) {
  const stage = PIPELINE_STAGES.find((item) => item.id === run.stage);
  if (run.status === RUN_STATUS.needsReview && stage?.route) {
    return buildPath[stage.route](workspaceId, run.id);
  }
  return buildPath.runDetail(workspaceId, run.id);
}

/**
 * Workspace home. Every other screen is scoped to one kind of object — sources,
 * runs, the ontology — so this is the only place that answers "is the model
 * still true, and what is stopping it from being truer". It owns no data of its
 * own: everything here is a join over the mocks the other screens already read.
 */
export default function Overview() {
  const navigate = useNavigate();
  const { workspace, workspaceId } = useWorkspace();

  const sourceCount = TABLES.length + DOCUMENTS.length;

  /**
   * Three genuinely different screens rather than one screen with holes in it.
   * A new workspace has no queue to show, and an empty queue is a worse answer
   * than showing the way in.
   */
  const phase = sourceCount === 0 ? 'empty' : RUNS.length === 0 ? 'firstRun' : 'steady';

  const rowToneClass = {
    danger: styles.rowDanger,
    warn: styles.rowWarn,
  };

  // Ranked by what is actually blocking you: a dead run first, then the gates
  // holding runs open, then anything stopping this version being published.
  const needsYou = useMemo(() => {
    const failed = RUNS.filter((run) => run.status === RUN_STATUS.failed).map((run) => ({
      key: run.id,
      tone: 'danger',
      icon: 'alert',
      title: run.id,
      detail: run.stageNote,
      meta: run.startedAt,
      to: runTarget(run, workspaceId),
    }));

    const gates = RUNS.filter((run) => run.status === RUN_STATUS.needsReview).map((run) => ({
      key: run.id,
      tone: 'warn',
      icon: 'inbox',
      title: run.id,
      detail: STAGE_LABEL[run.stage],
      meta: run.startedAt,
      to: runTarget(run, workspaceId),
    }));

    const errors = VALIDATION_FINDINGS.filter((finding) => finding.tone === 'danger').map(
      (finding) => ({
        key: finding.id,
        tone: 'danger',
        icon: 'shield',
        title: finding.title,
        detail: finding.detail,
        meta: workspace.version,
        to: buildPath.runOntology(workspaceId, BUILT_BY_RUN),
      }),
    );

    return [...failed, ...gates, ...errors];
  }, [workspaceId, workspace.version]);

  const inFlight = useMemo(() => RUNS.filter((run) => run.status === RUN_STATUS.running), []);

  // `drift` is set on a source that changed after the current version was
  // built. That pair — changed since, built by — is the reason to come back.
  const drifted = useMemo(
    () => [
      ...TABLES.filter((table) => table.drift).map((table) => ({ ...table, kind: 'table' })),
      ...DOCUMENTS.filter((doc) => doc.drift).map((doc) => ({ ...doc, kind: 'document' })),
    ],
    [],
  );

  const unanswered =
    QUESTION_COVERAGE.total - QUESTION_COVERAGE.answerable - QUESTION_COVERAGE.partial;

  const versionStats = [
    { id: 'concepts', label: 'Concepts', value: String(workspace.concepts) },
    { id: 'relations', label: 'Relationships', value: String(workspace.relations) },
    { id: 'nodes', label: 'Graph nodes', value: GRAPH_TOTALS.nodes },
    { id: 'edges', label: 'Edges', value: GRAPH_TOTALS.edges },
  ];

  const header = <TopBar crumbs={[{ label: workspace.name }, { label: 'Overview' }]} showNewRun />;

  if (phase === 'empty') {
    return (
      <>
        {header}
        <PageBody>
          <PageHeader
            title="Overview"
            subtitle="Connect the tables and documents this workspace should model. Nothing is extracted until you start a run."
          />
          <Panel center>
            <EmptyState
              icon="database"
              title="No sources connected yet"
              hint="A workspace models the data you point it at. Connect a catalog or upload documents to begin."
              action={
                <Button
                  variant="primary"
                  iconRight="arrowRight"
                  onClick={() => navigate(buildPath.sources(workspaceId))}
                >
                  Connect sources
                </Button>
              }
            />
          </Panel>
        </PageBody>
      </>
    );
  }

  if (phase === 'firstRun') {
    return (
      <>
        {header}
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
              <Button
                variant="primary"
                iconRight="arrowRight"
                onClick={() => navigate(buildPath.newRun(workspaceId))}
              >
                Start first extraction
              </Button>
            </div>
          </Panel>
        </PageBody>
      </>
    );
  }

  return (
    <>
      {header}
      <PageBody scroll>
        <PageHeader
          title="Overview"
          subtitle={joinMeta(
            workspace.businessDomain,
            pluralize(sourceCount, 'source'),
            `last synced ${LAST_SYNCED}`,
          )}
        />

        <div className={styles.stack}>
          <Panel>
            <PanelHeader
              title="Needs you"
              meta={needsYou.length ? pluralize(needsYou.length, 'item') : 'Nothing waiting'}
            />
            {needsYou.length === 0 ? (
              <div className={styles.quiet}>
                <Icon name="check" size={14} />
                Every run is either moving or finished, and this version validates clean.
              </div>
            ) : (
              <ul className={styles.rows}>
                {needsYou.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      className={[styles.row, rowToneClass[item.tone]].filter(Boolean).join(' ')}
                      onClick={() => navigate(item.to)}
                    >
                      <span className={styles.rowIcon}>
                        <Icon name={item.icon} size={14} />
                      </span>
                      <span className={styles.rowTitle}>{item.title}</span>
                      <span className={styles.rowDetail}>{item.detail}</span>
                      <span className={styles.rowMeta}>{item.meta}</span>
                      <Icon name="arrowRight" size={14} className={styles.rowArrow} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <div className={styles.split}>
            <Panel>
              <PanelHeader title="In flight" meta={pluralize(inFlight.length, 'run')} />
              {inFlight.length === 0 ? (
                <div className={styles.quiet}>
                  <Icon name="pause" size={14} />
                  Nothing is running right now.
                </div>
              ) : (
                <ul className={styles.rows}>
                  {inFlight.map((run) => (
                    <li key={run.id}>
                      <button
                        type="button"
                        className={styles.flightRow}
                        onClick={() => navigate(runTarget(run, workspaceId))}
                      >
                        <div className={styles.flightTop}>
                          <span className={styles.rowTitle}>{run.id}</span>
                          <span className={styles.rowMeta}>
                            {joinMeta(run.strategy, run.startedAt)}
                          </span>
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

            <Panel>
              <PanelHeader title="Current version" meta={BUILT_BY_RUN} />
              <div className={styles.versionBody}>
                <div className={styles.versionTop}>
                  <span className={styles.versionNumber}>{workspace.version}</span>
                  <Chip tone="neutral">{workspace.status}</Chip>
                </div>
                <StatGrid stats={versionStats} columns={2} small soft />
                <button
                  type="button"
                  className={styles.panelLink}
                  onClick={() => navigate(buildPath.runGraph(workspaceId, BUILT_BY_RUN))}
                >
                  Open the graph
                  <Icon name="arrowRight" size={13} />
                </button>
              </div>
            </Panel>
          </div>

          <div className={styles.split}>
            <Panel>
              <PanelHeader
                title="Drifted since last build"
                meta={`${drifted.length} of ${sourceCount}`}
              />
              {drifted.length === 0 ? (
                <div className={styles.quiet}>
                  <Icon name="check" size={14} />
                  Every source is unchanged since {BUILT_BY_RUN} built {workspace.version}.
                </div>
              ) : (
                <>
                  <ul className={styles.rows}>
                    {drifted.map((source) => (
                      <li key={`${source.kind}-${source.id}`}>
                        <div className={styles.driftRow}>
                          <span className={styles.rowIcon}>
                            <Icon
                              name={source.kind === SOURCE_KIND.table ? 'database' : 'doc'}
                              size={14}
                            />
                          </span>
                          <span className={styles.driftName}>{source.name}</span>
                          <Chip tone="warn">{source.drift}</Chip>
                          <span className={styles.rowMeta}>{source.lastRun ?? 'never built'}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.panelFoot}>
                    <span className={styles.footNote}>
                      {workspace.version} was built before these changed, so the graph does not
                      reflect them.
                    </span>
                    <Button
                      size="sm"
                      iconRight="arrowRight"
                      onClick={() => navigate(buildPath.newRun(workspaceId))}
                    >
                      Re-extract these
                    </Button>
                  </div>
                </>
              )}
            </Panel>

            <Panel>
              <PanelHeader title="Coverage" meta={pluralize(QUESTION_COVERAGE.total, 'question')} />
              <div className={styles.coverage}>
                <ProgressBar
                  total={QUESTION_COVERAGE.total}
                  label={`${QUESTION_COVERAGE.answerable} of ${QUESTION_COVERAGE.total} questions answerable`}
                  segments={[
                    { id: 'answerable', value: QUESTION_COVERAGE.answerable, tone: 'ok' },
                    { id: 'partial', value: QUESTION_COVERAGE.partial, tone: 'warn' },
                    { id: 'unanswered', value: unanswered, tone: 'danger' },
                  ]}
                />
                <ul className={styles.legend}>
                  <li>
                    <span className={`${styles.key} ${styles.keyOk}`} />
                    <span className={styles.legendValue}>{QUESTION_COVERAGE.answerable}</span>{' '}
                    answerable
                  </li>
                  <li>
                    <span className={`${styles.key} ${styles.keyWarn}`} />
                    <span className={styles.legendValue}>{QUESTION_COVERAGE.partial}</span> partial
                  </li>
                  <li>
                    <span className={`${styles.key} ${styles.keyDanger}`} />
                    <span className={styles.legendValue}>{unanswered}</span> unanswered
                  </li>
                </ul>
                <p className={styles.coverageNote}>
                  {unanswered > 0
                    ? `${pluralize(unanswered, 'question')} the ontology cannot answer yet. That gap is the honest measure of this version, not the percentage.`
                    : 'Every approved question can be answered from the current ontology.'}
                </p>
                <button
                  type="button"
                  className={styles.panelLink}
                  onClick={() => navigate(buildPath.runOntology(workspaceId, BUILT_BY_RUN))}
                >
                  See coverage in {BUILT_BY_RUN}
                  <Icon name="arrowRight" size={13} />
                </button>
              </div>
            </Panel>
          </div>
        </div>
      </PageBody>
    </>
  );
}
