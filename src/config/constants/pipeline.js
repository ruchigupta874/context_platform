/**
 * The extraction pipeline, defined once.
 *
 * `gate: true` means the run stops here and waits for a human. Everything a
 * stepper, a progress track or a run summary shows is derived from this list,
 * so adding a stage is a one-line change.
 */
export const PIPELINE_STAGES = [
  {
    id: 'extract',
    label: 'Extract',
    icon: 'scan',
    gate: false,
    blurb: 'Reads table structure, column profiles and document text. Nothing is interpreted yet.',
  },
  {
    id: 'concepts',
    label: 'Concepts & relationships',
    icon: 'node',
    gate: true,
    route: 'reviewConcepts',
    blurb: 'Proposes classes and the links between them, then stops for your approval.',
  },
  {
    id: 'questions',
    label: 'Competency questions',
    icon: 'help',
    gate: true,
    route: 'reviewQuestions',
    blurb: 'Drafts the questions the ontology must be able to answer, then stops again.',
  },
  {
    id: 'ontology',
    label: 'Ontology build',
    icon: 'hierarchy',
    gate: false,
    blurb: 'Compiles approved concepts into OWL classes, properties, axioms and R2RML mappings.',
  },
  {
    id: 'graph',
    label: 'Knowledge graph',
    icon: 'graph',
    gate: false,
    blurb: 'Executes the mappings against live tables to materialise entities and edges.',
  },
];

export const STAGE_STATE = {
  done: 'done',
  running: 'running',
  gate: 'gate',
  pending: 'pending',
  failed: 'failed',
};

export const stageIndex = (stageId) => PIPELINE_STAGES.findIndex((s) => s.id === stageId);

/**
 * Given the stage a run currently sits at and its status, describe every stage.
 * Pure function — the stepper and the compact track both render from this.
 */
export function describeStages(currentStageId, status) {
  const current = stageIndex(currentStageId);
  return PIPELINE_STAGES.map((stage, i) => {
    let state = STAGE_STATE.pending;
    if (i < current) state = STAGE_STATE.done;
    else if (i === current) {
      if (status === 'failed') state = STAGE_STATE.failed;
      else if (status === 'needs-review') state = STAGE_STATE.gate;
      else if (status === 'complete') state = STAGE_STATE.done;
      else state = STAGE_STATE.running;
    } else if (status === 'complete') state = STAGE_STATE.done;
    return { ...stage, index: i, state };
  });
}
