import { RUN_STATUS } from '@/features/runs/constants';

export const RUNS = [
  {
    id: 'R-2418',
    startedAt: '12 min ago',
    startedBy: 'a.sikarwar',
    sources: '8 tables, 2 docs',
    strategy: 'Blended',
    stage: 'concepts',
    status: RUN_STATUS.needsReview,
    stageNote: 'Waiting at Concepts',
  },
  {
    id: 'R-2417',
    startedAt: '4 min ago',
    startedBy: 'a.sikarwar',
    sources: '3 tables',
    strategy: 'Schema-first',
    stage: 'concepts',
    status: RUN_STATUS.running,
    stageNote: 'Normalising candidates from meter_reading (62%)',
  },
  {
    id: 'R-2416',
    startedAt: '1 hr ago',
    startedBy: 'r.mehta',
    sources: '5 docs',
    strategy: 'Document-first',
    stage: 'questions',
    status: RUN_STATUS.needsReview,
    stageNote: 'Waiting at Competency questions',
  },
  {
    id: 'R-2413',
    startedAt: 'Yesterday, 17:40',
    startedBy: 'a.sikarwar',
    sources: '10 tables, 2 docs',
    strategy: 'Blended',
    stage: 'graph',
    status: RUN_STATUS.complete,
    stageNote: 'Graph built, 12.4k nodes',
    output: { version: 'v5', concepts: 47, relations: 62, nodes: '12,438', edges: '31,204' },
  },
];

/**
 * A run is the thing that owns an ontology and a graph — they are its output,
 * not the workspace's. `output` is set only once a run reaches the end of the
 * pipeline, so a run still moving has nothing to open yet.
 */
export const findRun = (runId) => RUNS.find((run) => run.id === runId);

/**
 * What each stage has to say for itself, keyed by run and then by stage id.
 *
 * Every stage a run has been through carries its own panel, because the thread
 * lets you select any of them and read what it produced. A stage the run has
 * not reached carries nothing — there is no honest figure to show for work that
 * has not happened.
 *
 * The figures across a run are meant to reconcile: the concepts a gate offers
 * are what survived the candidate filter and the normaliser inside that stage,
 * and the graph is built from what the gates approved. A reader who adds them
 * up should not find a gap.
 */
export const RUN_STAGE_PANELS = {
  'R-2418': {
    concepts: {
      title: 'Waiting for your review',
      blurb:
        '1,432 candidate terms were scored, 1,016 of them mapped onto a concept, and synonyms and duplicates folded down to 250 canonical concepts. 50 of those need a decision from you — the rest already match an approved concept in ContactCentre v7. Nothing downstream is built until you decide, and approving partially is fine.',
      tone: 'warn',
      metrics: [
        { id: 'queue', label: 'Awaiting decision', value: '50', tone: 'warn' },
        { id: 'high', label: 'High confidence', value: '31', tone: 'ok' },
        { id: 'matched', label: 'Matched to v7', value: '200' },
        { id: 'canonical', label: 'Canonical concepts', value: '250' },
      ],
    },
  },

  'R-2417': {
    concepts: {
      title: 'Concepts are still being normalised',
      blurb:
        'Two of three tables are profiled and scored. meter_reading is large enough to sample rather than scan, so it takes the bulk of the stage. The gate opens as soon as the duplicates are folded together.',
      tone: 'info',
      metrics: [
        { id: 'tables', label: 'Tables read', value: '2 of 3' },
        { id: 'columns', label: 'Columns profiled', value: '18' },
        { id: 'candidates', label: 'Candidate concepts', value: '312' },
        { id: 'canonical', label: 'Canonical concepts', value: '—' },
      ],
    },
  },

  'R-2416': {
    concepts: { duration: '9m 41s' },
    relationships: { duration: '5m 08s' },
    questions: {
      title: 'Waiting for your review',
      blurb:
        '18 competency questions are drafted from the approved model. Four of them cannot be answered by it yet — keeping those is how the gaps get filled in the next run.',
      tone: 'warn',
      metrics: [
        { id: 'questions', label: 'Questions', value: '18' },
        { id: 'answerable', label: 'Answerable', value: '14', tone: 'ok' },
        { id: 'gaps', label: 'Gaps', value: '4', tone: 'warn' },
        { id: 'concepts', label: 'From concepts', value: '11' },
      ],
    },
  },

  'R-2413': {
    concepts: {
      title: 'Concepts approved',
      blurb:
        '1,884 candidate terms folded down to 312 canonical concepts. a.sikarwar kept 47 of the 59 that needed a decision; the rest matched v6.',
      duration: '12m 34s',
      metrics: [
        { id: 'approved', label: 'Approved', value: '47', tone: 'ok' },
        { id: 'rejected', label: 'Rejected', value: '12' },
        { id: 'matched', label: 'Matched to v6', value: '253' },
        { id: 'canonical', label: 'Canonical concepts', value: '312' },
      ],
    },
    relationships: {
      title: 'Relationships approved',
      blurb: '62 of the 71 proposed links were kept, and those are what the graph was built from.',
      duration: '3m 16s',
      metrics: [
        { id: 'approved', label: 'Approved', value: '62', tone: 'ok' },
        { id: 'rejected', label: 'Rejected', value: '9' },
        { id: 'proposed', label: 'Proposed', value: '71' },
      ],
    },
    questions: {
      title: 'Competency questions approved',
      blurb:
        'Three questions the model still cannot answer were kept on purpose — that gap is the honest measure of this version.',
      duration: '4m 40s',
      metrics: [
        { id: 'questions', label: 'Questions', value: '24' },
        { id: 'answerable', label: 'Answerable', value: '18', tone: 'ok' },
        { id: 'partial', label: 'Partial', value: '3' },
        { id: 'unanswered', label: 'Unanswered', value: '3', tone: 'warn' },
      ],
    },
    graph: {
      title: 'Knowledge graph published',
      blurb:
        'All three gates were approved, so the model compiled to 47 OWL classes and 62 R2RML mappings and ran against the live tables. v5 is what every source on this workspace was last extracted into.',
      tone: 'ok',
      duration: '18m 02s',
      metrics: [
        { id: 'nodes', label: 'Nodes', value: '12,438' },
        { id: 'edges', label: 'Edges', value: '31,204' },
        { id: 'classes', label: 'OWL classes', value: '47' },
        { id: 'mappings', label: 'Mappings', value: '62' },
      ],
    },
  },
};

/** Null means the stage has nothing recorded for this run, not that it failed. */
export const findStagePanel = (runId, stageId) => RUN_STAGE_PANELS[runId]?.[stageId] ?? null;
