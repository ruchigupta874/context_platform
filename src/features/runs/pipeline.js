/**
 * The extraction pipeline, defined once.
 *
 * `gate: true` means the run stops here and waits for a human. Everything a
 * stepper, a progress track or a run summary shows is derived from this list,
 * so adding a stage is a one-line change.
 *
 * Ids are deliberately shorter than labels: `concepts` and `questions` double
 * as view ids in RUN_VIEW and as gate keys elsewhere, so renaming what a stage
 * is called on screen never moves a route.
 */
export const PIPELINE_STAGES = [
  {
    id: 'ingestion',
    label: 'Ingestion',
    icon: 'scan',
    caption: 'Schema and documents',
    gate: false,
    blurb: 'Reads table structure, column profiles and document text. Nothing is interpreted yet.',
  },
  {
    id: 'candidates',
    label: 'Candidate Filter',
    icon: 'search',
    caption: 'Shortlist by signal',
    gate: false,
    blurb:
      'Scores every term the ingestion found and drops the ones with too little evidence behind them, so review sees candidates rather than vocabulary.',
  },
  {
    id: 'normalizer',
    label: 'Concept Normalizer',
    icon: 'node',
    caption: 'Names and duplicates',
    gate: false,
    blurb:
      'Collapses synonyms, settles on one name per concept and folds duplicates together before a human is asked to judge any of them.',
  },
  {
    id: 'concepts',
    label: 'Review Concept',
    icon: 'inbox',
    caption: 'Concept sign-off',
    gate: true,
    route: 'reviewConcepts',
    blurb: 'Proposes the classes the domain is made of, then stops for your approval.',
    gateNote: 'Approve the classes before anything is built on top of them.',
  },
  {
    id: 'relationships',
    label: 'Review Relationships',
    icon: 'link',
    caption: 'Relationship sign-off',
    gate: true,
    // Shares the concepts screen, which holds both tabs, until relationships
    // earn a gate of their own.
    route: 'reviewConcepts',
    blurb: 'Proposes the links between approved classes, then stops again.',
    gateNote: 'Approve how the approved classes relate to one another.',
  },
  {
    id: 'questions',
    label: 'Competency Question',
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
    label: 'Knowledge Graph',
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
 * The one gate a run may switch off. Everything upstream of the graph has to be
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
 * carry their own route, the graph exists only once the run produced it, and
 * the machine stages have no view of their own — so they stay inert rather
 * than looking clickable and going nowhere.
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
  questions: 'questions',
};
