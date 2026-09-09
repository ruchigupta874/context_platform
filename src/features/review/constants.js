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

/** Page sizes offered under the table. */
export const CONCEPT_PAGE_SIZES = [10, 25, 50, 100];
export const DEFAULT_CONCEPT_PAGE_SIZE = 25;
