/**
 * The extraction pipeline, defined once.
 *
 * `gate: true` means the run stops here and waits for a human. Everything a
 * stepper, a progress track or a run summary shows is derived from this list,
 * so adding a stage is a one-line change.
 *
 * Four stages, three of them gates: the machine work that used to be split
 * across ingestion, candidate filtering and normalisation is not something a
 * reviewer can act on, so it no longer takes a step of its own. What is left is
 * the three things a person signs off — concepts, then the relationships
 * between them, then the questions the model must answer — and the graph those
 * decisions compile into.
 *
 * Ids are deliberately shorter than labels: they double as view ids in RUN_VIEW
 * and as gate keys elsewhere, so renaming what a stage is called on screen never
 * moves a route.
 */
export const PIPELINE_STAGES = [
  {
    id: 'concepts',
    label: 'Concepts',
    icon: 'node',
    caption: 'Concept sign-off',
    gate: true,
    route: 'reviewConcepts',
    blurb:
      'Reads the sources, folds synonyms and duplicates into one canonical concept each, then stops for your approval.',
    gateNote: 'Approve the classes before anything is built on top of them.',
  },
  {
    id: 'relationships',
    label: 'Relationships',
    icon: 'link',
    caption: 'Relationship sign-off',
    gate: true,
    route: 'reviewRelations',
    blurb: 'Proposes the links between approved concepts, then stops again.',
    gateNote: 'Approve how the approved concepts relate to one another.',
  },
  {
    id: 'questions',
    label: 'Competency questions',
    icon: 'help',
    caption: 'Question review',
    gate: true,
    route: 'reviewQuestions',
    blurb:
      'Drafts the questions the ontology must be able to answer, then stops for your sign-off.',
    gateNote:
      'Approve the questions the ontology must answer. Turn off to accept all generated questions.',
  },
  {
    id: 'graph',
    label: 'Knowledge graph',
    icon: 'graph',
    caption: 'Build and publish',
    gate: false,
    blurb:
      'Compiles the approved model into OWL classes and mappings, then executes them against live tables to materialise entities and edges.',
  },
];

/** The stages that stop and wait for a person, in pipeline order. */
export const GATE_STAGES = PIPELINE_STAGES.filter((stage) => stage.gate);

/**
 * The one gate a run may switch off. Concepts and relationships have to be
 * approved by someone; accepting the generated questions wholesale is the only
 * shortcut that still leaves a reviewed model behind.
 */
export const OPTIONAL_GATE = 'questions';

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

/**
 * The screen a stage owns, as a `buildPath` key, or null when it has none.
 *
 * This is what makes the stepper navigable from anywhere in a run: the gates
 * carry their own route and the graph exists only once the run produced it, so
 * an unbuilt graph stays inert rather than looking clickable and going nowhere.
 */
export function stageRoute(stage, run) {
  if (stage.route) return stage.route;
  if (stage.id === 'graph' && run?.output) return 'runGraph';
  return null;
}

/**
 * Which of a run's screens is open. Stage ids double as view ids, with `index`
 * standing for the run's own detail page.
 */
export const RUN_VIEW = {
  index: 'index',
  graph: 'graph',
  ontology: 'ontology',
  concepts: 'concepts',
  relationships: 'relationships',
  questions: 'questions',
};
