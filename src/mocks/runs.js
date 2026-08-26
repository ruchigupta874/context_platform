import { RUN_STATUS } from '../config/constants/runs';

export const RUNS = [
  {
    id: 'R-2418',
    startedAt: '12 min ago',
    startedBy: 'a.sikarwar',
    sources: '8 tables, 2 docs',
    strategy: 'Blended',
    stage: 'concepts',
    status: RUN_STATUS.needsReview,
    stageNote: 'Waiting at Concepts & relationships',
  },
  {
    id: 'R-2417',
    startedAt: '4 min ago',
    startedBy: 'a.sikarwar',
    sources: '3 tables',
    strategy: 'Schema-first',
    stage: 'extract',
    status: RUN_STATUS.running,
    stageNote: 'Extracting from meter_reading (62%)',
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
    id: 'R-2415',
    startedAt: '26 min ago',
    startedBy: 'a.sikarwar',
    sources: '6 tables, 1 doc',
    strategy: 'Blended',
    stage: 'ontology',
    status: RUN_STATUS.running,
    stageNote: 'Building ontology, resolving 4 conflicts',
  },
  {
    id: 'R-2414',
    startedAt: '3 hr ago',
    startedBy: 'r.mehta',
    sources: '4 tables',
    strategy: 'Schema-first',
    stage: 'concepts',
    status: RUN_STATUS.needsReview,
    stageNote: 'Waiting at Concepts & relationships',
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
  },
  {
    id: 'R-2412',
    startedAt: 'Yesterday, 14:02',
    startedBy: 'system',
    sources: '2 tables',
    strategy: 'Schema-first',
    stage: 'extract',
    status: RUN_STATUS.failed,
    stageNote: 'Catalog credentials expired at Extract',
  },
  {
    id: 'R-2411',
    startedAt: '24 Aug, 09:11',
    startedBy: 'a.sikarwar',
    sources: '7 tables',
    strategy: 'Blended',
    stage: 'graph',
    status: RUN_STATUS.complete,
    stageNote: 'Graph built, 8.1k nodes',
  },
];

/** Detail for the run currently sitting at gate 1. */
export const RUN_DETAIL = {
  id: 'R-2418',
  status: RUN_STATUS.needsReview,
  stage: 'concepts',
  summary: 'Started 12 min ago by a.sikarwar · blended strategy · 8 tables, 2 documents',
  config: [
    { key: 'Strategy', value: 'Blended' },
    { key: 'Sources', value: '8 tables, 2 docs' },
    { key: 'Seeded from', value: 'ContactCentre v7' },
    { key: 'Review gates', value: '2 of 2 on' },
    { key: 'Started', value: '09:40, 26 Aug' },
    { key: 'Elapsed', value: '20m 04s' },
  ],
  activity: [
    { id: 'a1', message: 'Run paused at the Concepts & relationships gate', at: '12 min ago', kind: 'gate' },
    { id: 'a2', message: 'Extract finished, 89 columns profiled', at: '16 min ago', kind: 'done' },
    { id: 'a3', message: 'meter_reading sampled rather than scanned in full', at: '17 min ago', kind: 'note' },
    { id: 'a4', message: 'Seeded from ContactCentre v7', at: '20 min ago', kind: 'done' },
    { id: 'a5', message: 'Run started by a.sikarwar', at: '20 min ago', kind: 'done' },
  ],
  /** Per-stage panel content. Keyed by stage id from PIPELINE_STAGES. */
  stages: {
    extract: {
      title: 'Extract complete',
      blurb:
        'Read 8 catalog tables and 2 documents. Column profiles, key candidates and glossary terms are cached for the rest of the run.',
      tone: 'ok',
      duration: '4m 12s',
      metrics: [
        { id: 'tables', label: 'Tables read', value: '8' },
        { id: 'columns', label: 'Columns profiled', value: '89' },
        { id: 'chunks', label: 'Doc chunks', value: '412' },
        { id: 'keys', label: 'Key candidates', value: '23' },
      ],
      listTitle: 'Extraction log',
      listMeta: 'R-2418 · stage 1 of 5',
      lines: [
        { id: 'l1', lead: '09:41:02', message: 'Connected to prod_uc.cust360', tag: 'ok' },
        { id: 'l2', lead: '09:41:09', message: 'Profiled customer (14 cols, 482k rows)', tag: 'ok' },
        { id: 'l3', lead: '09:41:38', message: 'Profiled contract (10 cols, 611k rows)', tag: 'ok' },
        { id: 'l4', lead: '09:42:15', message: 'Profiled invoice, payment, claim', tag: 'ok' },
        { id: 'l5', lead: '09:43:01', message: 'meter_reading sampled at 1% (84m rows)', tag: 'sampled' },
        { id: 'l6', lead: '09:43:44', message: 'Chunked Customer Data Dictionary 2026.pdf', tag: 'ok' },
        { id: 'l7', lead: '09:44:20', message: 'Chunked Billing Domain Glossary.docx', tag: 'ok' },
        { id: 'l8', lead: '09:44:51', message: 'Inferred 23 key candidates from naming and cardinality', tag: 'ok' },
        { id: 'l9', lead: '09:45:14', message: 'Stage complete in 4m 12s', tag: 'done' },
      ],
    },
    concepts: {
      title: 'Waiting for your review',
      blurb:
        '14 concepts and 11 relationships are proposed. Nothing downstream is built until you decide. Approving partially is fine, the run continues with what you keep.',
      tone: 'warn',
      cta: 'Open review',
      metrics: [
        { id: 'concepts', label: 'Concepts', value: '14' },
        { id: 'relations', label: 'Relationships', value: '11' },
        { id: 'high', label: 'High confidence', value: '12', tone: 'ok' },
        { id: 'look', label: 'Needs a look', value: '13', tone: 'warn' },
      ],
      listTitle: 'Proposed, awaiting decision',
      listMeta: '25 items',
      lines: [
        { id: 'p1', lead: '0.96', message: 'Customer — class from uc.customer', tag: 'concept' },
        { id: 'p2', lead: '0.95', message: 'Customer holds Contract (1:N)', tag: 'relation' },
        { id: 'p3', lead: '0.93', message: 'Contract generates Invoice (1:N)', tag: 'relation' },
        { id: 'p4', lead: '0.88', message: 'Claim — class from uc.claim', tag: 'concept' },
        { id: 'p5', lead: '0.82', message: 'Call subClassOf Interaction', tag: 'relation' },
        { id: 'p6', lead: '0.74', message: 'BillingAccount — inferred, no table of its own', tag: 'low' },
        { id: 'p7', lead: '0.71', message: 'ClaimAssessment — from policy doc, 2 of 6 fields exist', tag: 'low' },
        { id: 'p8', lead: '0.62', message: 'Tariff — glossary term, no matching table', tag: 'low' },
        { id: 'p9', lead: '0.54', message: 'Household — inferred from address clustering', tag: 'low' },
        { id: 'p10', lead: '0.44', message: 'Household contains Customer (1:N)', tag: 'low' },
      ],
    },
    questions: {
      title: 'Competency questions',
      blurb:
        'Once concepts are approved, the run drafts the questions your ontology must be able to answer, then stops again for your sign-off.',
      tone: 'pending',
    },
    ontology: {
      title: 'Ontology build',
      blurb:
        'Approved concepts and relationships are compiled into OWL classes, object properties and axioms, with R2RML mappings back to the source columns. No review gate here.',
      tone: 'pending',
    },
    graph: {
      title: 'Knowledge graph',
      blurb:
        'The mappings are executed against the live tables to materialise entities and edges. Expect roughly 12k nodes at this source volume.',
      tone: 'pending',
    },
  },
};

export const BLOCKED_LINE = {
  id: 'blocked',
  lead: '—',
  message: 'Waiting for Concepts & relationships to be approved',
  tag: 'blocked',
};

export const LOG_TAG_TONES = {
  ok: 'neutral',
  done: 'neutral',
  concept: 'neutral',
  relation: 'neutral',
  low: 'warn',
  sampled: 'info',
  blocked: 'neutral',
};
