import { TONE } from '@/config/constants/common';

export const RUN_STATUS = {
  needsReview: 'needs-review',
  running: 'running',
  complete: 'complete',
  failed: 'failed',
};

/**
 * Everything the list, the shell and the status chip need to know about a run
 * state, in one place.
 *
 * `icon` is the state's glyph — it appears on the row badge and in the note
 * under the pipeline track, so a scanning eye can pair them without reading.
 * `edge` marks the states worth a coloured rail on the row: a finished run is
 * not asking for anything, so it gets none.
 */
export const RUN_STATUS_META = {
  [RUN_STATUS.needsReview]: {
    label: 'Needs review',
    tone: TONE.warn,
    icon: 'pause',
    edge: true,
    action: 'Review',
    primary: true,
  },
  [RUN_STATUS.running]: {
    label: 'Running',
    tone: TONE.info,
    icon: 'refresh',
    edge: true,
    action: 'Watch',
    spinner: true,
  },
  [RUN_STATUS.complete]: {
    label: 'Complete',
    tone: TONE.ok,
    icon: 'check',
    action: 'Open graph',
  },
  [RUN_STATUS.failed]: {
    label: 'Failed',
    tone: TONE.danger,
    icon: 'alert',
    edge: true,
    action: 'View log',
  },
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
    blurb:
      'Reads table structure, keys and profiles. Fast and literal, but blind to business language.',
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
