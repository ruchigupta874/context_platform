import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import { PageBody } from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import { BUILT_BY_RUN } from '@/features/graph';
import { LAST_SYNCED } from '@/features/sources';
import { useWorkspace } from '@/features/workspaces/useWorkspace';
import { buildPath } from '@/routes/paths';
import { joinMeta, pluralize } from '@/utils/format';
import OverviewEmpty from './OverviewEmpty';
import OverviewFirstRun from './OverviewFirstRun';
import CoveragePanel from './panels/CoveragePanel';
import DriftPanel from './panels/DriftPanel';
import InFlightPanel from './panels/InFlightPanel';
import NeedsYouPanel from './panels/NeedsYouPanel';
import VersionPanel from './panels/VersionPanel';
import { runTarget, useOverviewData } from './useOverviewData';
import styles from './Overview.module.css';

/**
 * Workspace home. Every other screen is scoped to one kind of object — sources,
 * runs, the ontology — so this is the only place that answers "is the model
 * still true, and what is stopping it from being truer". It owns no data of its
 * own: everything here is a join over the fixtures the other features read.
 */
export default function Overview() {
  const navigate = useNavigate();
  const { workspace, workspaceId } = useWorkspace();
  const { sourceCount, phase, needsYou, inFlight, drifted, unanswered, versionStats } =
    useOverviewData(workspace, workspaceId);

  const header = <TopBar crumbs={[{ label: workspace.name }, { label: 'Overview' }]} showNewRun />;

  if (phase === 'empty') {
    return (
      <>
        {header}
        <OverviewEmpty onConnectSources={() => navigate(buildPath.sources(workspaceId))} />
      </>
    );
  }

  if (phase === 'firstRun') {
    return (
      <>
        {header}
        <OverviewFirstRun
          sourceCount={sourceCount}
          onStartRun={() => navigate(buildPath.newRun(workspaceId))}
        />
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
          <NeedsYouPanel items={needsYou} onOpen={(to) => navigate(to)} />

          <div className={styles.split}>
            <InFlightPanel
              runs={inFlight}
              onOpen={(run) => navigate(runTarget(run, workspaceId))}
            />
            <VersionPanel
              workspace={workspace}
              stats={versionStats}
              onOpenGraph={() => navigate(buildPath.runGraph(workspaceId, BUILT_BY_RUN))}
            />
          </div>

          <div className={styles.split}>
            <DriftPanel
              drifted={drifted}
              sourceCount={sourceCount}
              workspace={workspace}
              onReExtract={() => navigate(buildPath.newRun(workspaceId))}
            />
            <CoveragePanel
              unanswered={unanswered}
              onOpenOntology={() => navigate(buildPath.runOntology(workspaceId, BUILT_BY_RUN))}
            />
          </div>
        </div>
      </PageBody>
    </>
  );
}
