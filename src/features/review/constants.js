import { TONE } from '@/config/constants/common';

export const REVIEW_TABS = [
  { id: 'concepts', label: 'Concepts', icon: 'node' },
  { id: 'relations', label: 'Relationships', icon: 'link' },
];

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
