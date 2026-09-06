import { useMemo } from 'react';
import { PIPELINE_STAGES, RUNS, RUN_STATUS } from '@/features/runs';
import { DOCUMENTS, TABLES } from '@/features/sources';
import { QUESTION_COVERAGE, VALIDATION_FINDINGS } from '@/features/ontology';
import { BUILT_BY_RUN, GRAPH_TOTALS } from '@/features/graph';
import { buildPath } from '@/routes/paths';

const STAGE_LABEL = Object.fromEntries(PIPELINE_STAGES.map((stage) => [stage.id, stage.label]));

/**
 * Which screen a run wants you on. Gate stages carry their own `route` in the
 * pipeline config, so this stays correct if a gate is ever added or moved.
 */
export function runTarget(run, workspaceId) {
  const stage = PIPELINE_STAGES.find((item) => item.id === run.stage);
  if (run.status === RUN_STATUS.needsReview && stage?.route) {
    return buildPath[stage.route](workspaceId, run.id);
  }
  return buildPath.runDetail(workspaceId, run.id);
}

/**
 * The joins behind the workspace home. Overview owns no data of its own —
 * everything here is a view over the fixtures the other features already read,
 * which is exactly why it is worth having in one place rather than inline.
 */
export function useOverviewData(workspace, workspaceId) {
  const sourceCount = TABLES.length + DOCUMENTS.length;

  /**
   * Three genuinely different screens rather than one screen with holes in it.
   * A new workspace has no queue to show, and an empty queue is a worse answer
   * than showing the way in.
   */
  const phase = sourceCount === 0 ? 'empty' : RUNS.length === 0 ? 'firstRun' : 'steady';

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

  return { sourceCount, phase, needsYou, inFlight, drifted, unanswered, versionStats };
}
