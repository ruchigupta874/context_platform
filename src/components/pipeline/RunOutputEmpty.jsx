import { useNavigate } from 'react-router-dom';
import { PageBody } from '../layout/AppShell';
import Button from '../ui/Button';
import { EmptyState, Panel } from '../ui/Surfaces';
import { PIPELINE_STAGES } from '../../config/constants/pipeline';
import { RUN_STATUS } from '../../config/constants/runs';
import { useWorkspace } from '../../hooks/useWorkspace';
import { buildPath } from '../../routes/paths';

const STAGE_LABEL = Object.fromEntries(PIPELINE_STAGES.map((stage) => [stage.id, stage.label]));

/**
 * Shown when a run is asked for an ontology or a graph it has not produced.
 * Renders inside RunShell, so the run bar, stepper and tabs stay put — this is
 * only the body, saying which of the reasons applies rather than showing an
 * empty viewer.
 */
export default function RunOutputEmpty({ artifact, run, runId }) {
  const navigate = useNavigate();
  const { workspaceId } = useWorkspace();

  const { title, hint } = describe(artifact, run, runId);

  return (
    <PageBody>
      <Panel style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <EmptyState
          icon={artifact === 'Ontology' ? 'hierarchy' : 'graph'}
          title={title}
          hint={hint}
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
  );
}

function describe(artifact, run, runId) {
  const noun = artifact.toLowerCase();

  if (run.status === RUN_STATUS.failed) {
    return {
      title: `${runId} failed before it could build ${article(noun)}`,
      hint: `${run.stageNote}. Fix the cause and start a new extraction — nothing from this run was kept.`,
    };
  }

  if (run.status === RUN_STATUS.needsReview) {
    return {
      title: `${runId} is waiting on you`,
      hint: `It is holding at ${STAGE_LABEL[run.stage]}. The ${noun} is built once both gates are approved, so nothing exists to open yet.`,
    };
  }

  return {
    title: `${runId} has not finished building`,
    hint: `${run.stageNote}. The ${noun} appears here when the run reaches the end of the pipeline.`,
  };
}

const article = (noun) => (/^[aeiou]/.test(noun) ? `an ${noun}` : `a ${noun}`);
