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
    stageNote: 'Waiting at Review Concept',
  },
  {
    id: 'R-2417',
    startedAt: '4 min ago',
    startedBy: 'a.sikarwar',
    sources: '3 tables',
    strategy: 'Schema-first',
    stage: 'ingestion',
    status: RUN_STATUS.running,
    stageNote: 'Ingesting meter_reading (62%)',
  },
  {
    id: 'R-2416',
    startedAt: '1 hr ago',
    startedBy: 'r.mehta',
    sources: '5 docs',
    strategy: 'Document-first',
    stage: 'questions',
    status: RUN_STATUS.needsReview,
    stageNote: 'Waiting at Competency Question',
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
 * The figures across a run are meant to reconcile: the candidates come out of
 * the chunks, the mappings out of the candidates, and the canonical concepts
 * out of the mappings. A reader who adds them up should not find a gap.
 */
export const RUN_STAGE_PANELS = {
  'R-2418': {
    ingestion: {
      title: 'Ingestion complete',
      blurb:
        'Read 8 catalog tables and 2 documents. Column profiles, key candidates and document chunks are cached for the rest of the run.',
      duration: '4m 12s',
      metrics: [
        { id: 'chunks', label: 'Chunks', value: '468' },
        { id: 'tables', label: 'Tables read', value: '8' },
        { id: 'columns', label: 'Columns profiled', value: '89' },
        { id: 'keys', label: 'Key candidates', value: '23' },
      ],
    },
    candidates: {
      title: 'Candidate filter complete',
      blurb:
        'Scored every term the ingestion turned up and kept the ones with enough evidence behind them. What it drops here never reaches a reviewer, which is the point.',
      duration: '2m 38s',
      metrics: [
        { id: 'candidates', label: 'Candidate concepts', value: '1,432' },
        { id: 'scanned', label: 'Terms scanned', value: '5,118' },
        { id: 'dropped', label: 'Below threshold', value: '3,686' },
      ],
    },
    normalizer: {
      title: 'Concept normalizer complete',
      blurb:
        '1,016 of the 1,432 candidates mapped onto a concept; the rest had no home. Synonyms and duplicates were folded together, leaving 250 canonical concepts to review.',
      duration: '1m 51s',
      metrics: [
        { id: 'mappings', label: 'Candidate mappings', value: '1,016' },
        { id: 'canonical', label: 'Canonical concepts', value: '250', tone: 'ok' },
        { id: 'folded', label: 'Folded as duplicates', value: '766' },
      ],
    },
    concepts: {
      title: 'Waiting for your review',
      blurb:
        '250 canonical concepts came out of the normalizer. 14 of them need a decision from you — the rest already match an approved concept in ContactCentre v7. Nothing downstream is built until you decide, and approving partially is fine.',
      tone: 'warn',
      metrics: [
        { id: 'queue', label: 'Awaiting decision', value: '14', tone: 'warn' },
        { id: 'high', label: 'High confidence', value: '12', tone: 'ok' },
        { id: 'matched', label: 'Matched to v7', value: '236' },
        { id: 'canonical', label: 'Canonical concepts', value: '250' },
      ],
    },
  },

  'R-2417': {
    ingestion: {
      title: 'Ingestion is reading your tables',
      blurb:
        'Two of three tables are profiled. meter_reading is large enough to sample rather than scan, so it takes the bulk of the stage. The candidate filter starts when this finishes.',
      tone: 'info',
      metrics: [
        { id: 'tables', label: 'Tables read', value: '2 of 3' },
        { id: 'columns', label: 'Columns profiled', value: '18' },
        { id: 'chunks', label: 'Doc chunks', value: '—' },
        { id: 'keys', label: 'Key candidates', value: '6' },
      ],
    },
  },

  'R-2416': {
    ingestion: { duration: '6m 20s' },
    candidates: { duration: '3m 04s' },
    normalizer: { duration: '2m 12s' },
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
    ingestion: {
      title: 'Ingestion complete',
      blurb:
        'Read 10 catalog tables and 2 documents — the widest source set this workspace has run.',
      duration: '7m 46s',
      metrics: [
        { id: 'chunks', label: 'Chunks', value: '612' },
        { id: 'tables', label: 'Tables read', value: '10' },
        { id: 'columns', label: 'Columns profiled', value: '104' },
        { id: 'keys', label: 'Key candidates', value: '31' },
      ],
    },
    candidates: {
      title: 'Candidate filter complete',
      blurb: 'Kept the terms with enough evidence behind them and dropped the rest.',
      duration: '3m 22s',
      metrics: [
        { id: 'candidates', label: 'Candidate concepts', value: '1,884' },
        { id: 'scanned', label: 'Terms scanned', value: '6,402' },
        { id: 'dropped', label: 'Below threshold', value: '4,518' },
      ],
    },
    normalizer: {
      title: 'Concept normalizer complete',
      blurb:
        '1,247 candidates mapped onto a concept and folded down to 312 canonical ones before review.',
      duration: '2m 40s',
      metrics: [
        { id: 'mappings', label: 'Candidate mappings', value: '1,247' },
        { id: 'canonical', label: 'Canonical concepts', value: '312', tone: 'ok' },
        { id: 'folded', label: 'Folded as duplicates', value: '935' },
      ],
    },
    concepts: {
      title: 'Concepts approved',
      blurb: 'a.sikarwar kept 47 of the 59 concepts that needed a decision. The rest matched v6.',
      duration: '6m 12s',
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
