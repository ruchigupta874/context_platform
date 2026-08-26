import { TONE } from './common';

export const COVERAGE = {
  covered: 'Covered',
  partial: 'Partial',
  notCovered: 'Not covered',
};

export const COVERAGE_TONES = {
  [COVERAGE.covered]: TONE.ok,
  [COVERAGE.partial]: TONE.warn,
  [COVERAGE.notCovered]: TONE.danger,
};

export const COVERAGE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: COVERAGE.covered, label: COVERAGE.covered },
  { id: COVERAGE.partial, label: COVERAGE.partial },
  { id: COVERAGE.notCovered, label: COVERAGE.notCovered },
];

/**
 * The verdict panel. A question is only useful if the screen is honest about
 * whether the current model can actually answer it.
 */
export const VERDICTS = {
  [COVERAGE.covered]: {
    icon: 'check',
    tone: TONE.ok,
    title: 'The approved model can answer this',
    note: 'Every class and property this question needs survived the concept gate.',
  },
  [COVERAGE.partial]: {
    icon: 'alert',
    tone: TONE.warn,
    title: 'Answerable, but not completely',
    note: 'Some of what this question needs is still undecided or has no source data behind it. Keeping it flags the gap for the next run.',
  },
  [COVERAGE.notCovered]: {
    icon: 'close',
    tone: TONE.danger,
    title: 'The current model cannot answer this',
    note: 'A required class or property was rejected or has no source. Keep the question to record the gap, or drop it.',
  },
};

export const REQUIREMENT_STATUS = {
  approved: { label: 'approved', tone: TONE.ok },
  pending: { label: 'undecided', tone: TONE.neutral },
  missing: { label: 'missing', tone: TONE.danger },
};

/** At this gate "approve" means keep the question, not approve an answer. */
export const QUESTION_ACTION_LABELS = {
  approve: { idle: 'Keep', done: 'Kept' },
  reject: { idle: 'Drop', done: 'Dropped' },
};
