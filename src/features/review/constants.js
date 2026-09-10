import { TONE } from '@/config/constants/common';

/**
 * Evidence roles. The tone tells a reviewer at a glance whether a piece of
 * evidence is load-bearing (a real foreign key) or a caveat (a gap, a guess).
 */
export const EVIDENCE_TONES = {
  'foreign key': TONE.info,
  identifier: TONE.info,
  complete: TONE.info,
  total: TONE.info,
  gap: TONE.danger,
  weak: TONE.danger,
  quality: TONE.danger,
  'weak identifier': TONE.danger,
  unparsed: TONE.danger,
  partial: TONE.warn,
  'near-complete': TONE.warn,
  'expected gap': TONE.warn,
  'weak proxy': TONE.warn,
};

export const CONCEPT_EVIDENCE_COLUMNS = ['Column', 'Type', 'Sample', 'Role'];
export const RELATION_EVIDENCE_COLUMNS = ['Signal', 'Value', 'Detail', 'Role'];

/** Signal strength drives the little bar next to each confidence reason. */
export const SIGNAL_BANDS = [
  { min: 0.8, tone: TONE.ok },
  { min: 0.55, tone: TONE.warn },
  { min: 0, tone: TONE.danger },
];

export const GATE_COPY = {
  undecidedWarning: (n) => `${n} undecided will be dropped from the ontology`,
  approveRest: 'Approve everything undecided',
  continue: (n) => `Continue with ${n}`,
};

/** The run whose proposals both gates are showing. */
export const PROPOSAL_RUN = 'R-2418';

/**
 * The concept gate's table. Widths are grid tracks: the two prose columns flex
 * and everything with a fixed shape — the checkbox, the chips, the icon row —
 * holds its width so the columns stay aligned as the window changes.
 */
export const CONCEPT_COLUMNS = [
  { id: 'select', label: '', width: '36px' },
  { id: 'concept', label: 'Concept', width: 'minmax(170px, 1fr)' },
  { id: 'type', label: 'Class / type', width: 'minmax(140px, 0.8fr)' },
  { id: 'definition', label: 'Definition', width: 'minmax(200px, 1.9fr)' },
  { id: 'confidence', label: 'Confidence', width: '96px' },
  { id: 'status', label: 'Status', width: '118px' },
  { id: 'actions', label: 'Actions', width: '108px' },
];

/**
 * The relationship gate's table. The triple takes three columns rather than one
 * rendered string: a reviewer scanning for everything hanging off Customer is
 * reading down a column, which a sentence per row would not let them do.
 */
export const RELATIONSHIP_COLUMNS = [
  { id: 'select', label: '', width: '36px' },
  { id: 'source', label: 'Source concept', width: 'minmax(120px, 0.85fr)' },
  { id: 'predicate', label: 'Relationship', width: 'minmax(110px, 0.8fr)' },
  { id: 'target', label: 'Target concept', width: 'minmax(120px, 0.85fr)' },
  { id: 'evidence', label: 'Evidence / supporting text', width: 'minmax(190px, 1.7fr)' },
  { id: 'confidence', label: 'Confidence', width: '96px' },
  { id: 'status', label: 'Status', width: '118px' },
  { id: 'actions', label: 'Actions', width: '108px' },
];

/** Page sizes offered under either gate's table. */
export const GATE_PAGE_SIZES = [10, 25, 50, 100];
export const DEFAULT_GATE_PAGE_SIZE = 25;

/**
 * The loading shape of each table, one recipe per column. A width given as an
 * array is cycled down the rows, because a column of identical bars reads as a
 * pattern rather than as data arriving. Null leaves the actions column empty.
 */
export const CONCEPT_SKELETON_CELLS = [
  { width: 14, height: 14, radius: 'var(--radius-sm)' },
  { width: [118, 164, 96, 142] },
  { width: [106, 88, 124, 96], height: 10 },
  { width: ['86%', '72%', '91%', '64%'], height: 10 },
  { width: 44, height: 18, radius: 'var(--radius)' },
  { width: 82, height: 18, radius: 'var(--radius)' },
  null,
];

export const RELATIONSHIP_SKELETON_CELLS = [
  { width: 14, height: 14, radius: 'var(--radius-sm)' },
  { width: [86, 112, 74, 96] },
  { width: [72, 104, 88, 64], height: 10 },
  { width: [94, 78, 116, 82] },
  { width: ['88%', '72%', '94%', '66%'], height: 10 },
  { width: 44, height: 18, radius: 'var(--radius)' },
  { width: 82, height: 18, radius: 'var(--radius)' },
  null,
];
