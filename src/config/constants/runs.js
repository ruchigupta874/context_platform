import { TONE } from './common';

export const RUN_STATUS = {
  needsReview: 'needs-review',
  running: 'running',
  complete: 'complete',
  failed: 'failed',
};

export const RUN_STATUS_META = {
  [RUN_STATUS.needsReview]: { label: 'Needs review', tone: TONE.warn, edge: true, action: 'Review', primary: true },
  [RUN_STATUS.running]: { label: 'Running', tone: TONE.info, edge: true, action: 'Watch', spinner: true },
  [RUN_STATUS.complete]: { label: 'Complete', tone: TONE.ok, action: 'Open graph' },
  [RUN_STATUS.failed]: { label: 'Failed', tone: TONE.danger, edge: true, action: 'View log', alert: true },
};

export const RUN_FILTERS = [
  { id: 'all', label: 'All' },
  { id: RUN_STATUS.needsReview, label: 'Needs review' },
  { id: RUN_STATUS.running, label: 'Running' },
  { id: RUN_STATUS.complete, label: 'Complete' },
  { id: RUN_STATUS.failed, label: 'Failed' },
];

export const RUN_COLUMNS = [
  { id: 'run', label: 'Run', width: '168px' },
  { id: 'sources', label: 'Sources', width: '176px' },
  { id: 'pipeline', label: 'Pipeline', width: 'minmax(0, 1fr)' },
  { id: 'status', label: 'Status', width: '132px' },
  { id: 'action', width: '148px' },
];

/** Extraction strategies offered when configuring a run. */
export const STRATEGIES = [
  {
    id: 'schema',
    name: 'Schema-first',
    blurb: 'Reads table structure, keys and profiles. Fast and literal, but blind to business language.',
  },
  {
    id: 'document',
    name: 'Document-first',
    blurb: 'Builds the model from your glossaries and policies, then tries to bind it to tables.',
  },
  {
    id: 'blended',
    name: 'Blended',
    blurb: 'Structure proposes the shape, documents name and define it. Best when you have both.',
  },
];

export const DEFAULT_STRATEGY = 'blended';

/** Rough duration model so the config screen can show an honest estimate. */
export function estimateMinutes({ tableCount, docCount, strategy }) {
  return 4 + Math.round(tableCount * 1.4) + docCount * 3 + (strategy === 'blended' ? 6 : 0);
}
