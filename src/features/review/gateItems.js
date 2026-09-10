import { CONFIDENCE_BANDS, DECISION, TONE } from '@/config/constants/common';

/**
 * What every review gate has in common, whatever it is reviewing.
 *
 * The endpoint returns one envelope per item type — a total, a count per status
 * and the items themselves — and every item carries a `payload` of loosely
 * typed strings. The envelope, the statuses and the two filters that act on
 * them are identical for concepts and relationships, so they are defined once
 * here; only the payload differs, and each gate normalises its own.
 */

/** The statuses the API reports. An item is in exactly one of them. */
export const REVIEW_STATUS = {
  pending: 'PENDING',
  approved: 'APPROVED',
  rejected: 'REJECTED',
};

/** `item_type` on the envelope. Each gate reads one. */
export const REVIEW_ITEM_TYPE = {
  concept: 'CONCEPT',
  relationship: 'RELATIONSHIP',
};

/**
 * API status to the decision the gate holds.
 *
 * PENDING deliberately maps to nothing: undecided is not a third decision, it
 * is the absence of one, and the gate has to be able to count it as such.
 */
export const DECISION_BY_STATUS = {
  [REVIEW_STATUS.approved]: DECISION.approved,
  [REVIEW_STATUS.rejected]: DECISION.rejected,
};

/** Which slice of a gate the table is showing. */
export const GATE_FILTER = {
  all: 'all',
  undecided: 'undecided',
  approved: DECISION.approved,
  rejected: DECISION.rejected,
};

export const GATE_FILTERS = [
  { id: GATE_FILTER.all, label: 'All statuses' },
  { id: GATE_FILTER.undecided, label: 'Undecided' },
  { id: GATE_FILTER.approved, label: 'Approved' },
  { id: GATE_FILTER.rejected, label: 'Rejected' },
];

/**
 * How the Status column reads, keyed by the decision held — with undecided as
 * the absent one. Neutral rather than amber: on arrival every row is undecided,
 * and a table of amber chips says "all of this is wrong" instead of "none of
 * this has been looked at".
 */
export const GATE_STATUS_META = {
  [GATE_FILTER.undecided]: { label: 'Undecided', tone: TONE.neutral, icon: 'clock' },
  [DECISION.approved]: { label: 'Approved', tone: TONE.ok, icon: 'check' },
  [DECISION.rejected]: { label: 'Rejected', tone: TONE.danger, icon: 'close' },
};

export const statusMetaFor = (decision) => GATE_STATUS_META[decision ?? GATE_FILTER.undecided];

/** `decision` is undefined for an item nobody has ruled on yet. */
export function matchesFilter(filter, decision) {
  if (filter === GATE_FILTER.all) return true;
  if (filter === GATE_FILTER.undecided) return !decision;
  return decision === filter;
}

/** The confidence band a score falls in — the same bands that colour the chip. */
const bandOf = (value) =>
  CONFIDENCE_BANDS.find((band) => value >= band.min) ??
  CONFIDENCE_BANDS[CONFIDENCE_BANDS.length - 1];

export const CONFIDENCE_FILTER = { all: 'all' };

/**
 * Built from the bands rather than listed again, so a band added to the scale
 * appears in this menu without anyone remembering to add it.
 */
export const CONFIDENCE_FILTERS = [
  { id: CONFIDENCE_FILTER.all, label: 'All confidence' },
  ...CONFIDENCE_BANDS.map((band) => ({
    id: band.label,
    label: `${band.label[0].toUpperCase()}${band.label.slice(1)} confidence`,
  })),
];

export const matchesConfidence = (filter, value) =>
  filter === CONFIDENCE_FILTER.all || bandOf(value).label === filter;

/**
 * A payload field that arrives as a JSON-encoded array inside a string, the way
 * a concept's aliases and a relationship's signals both do. Anything that does
 * not parse is treated as empty rather than thrown: one malformed row should
 * not take a gate down.
 */
export function parseJsonArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== 'string' || raw.trim() === '') return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * The decisions the API has already recorded, as the gate's decision map.
 *
 * Seeding from the response is what makes a reopened gate show the work someone
 * already did, rather than presenting every item as untouched.
 */
export function seedDecisions(items) {
  return items.reduce((acc, item) => {
    const decision = DECISION_BY_STATUS[item.status];
    if (decision) acc[item.item_ref_id] = decision;
    return acc;
  }, {});
}

/** How many items sit behind each status filter, given the decisions held now. */
export function countByFilter(items, decisionFor) {
  return GATE_FILTERS.reduce((acc, filter) => {
    acc[filter.id] = items.filter((item) => matchesFilter(filter.id, decisionFor(item.id))).length;
    return acc;
  }, {});
}

/** Builds the envelope a gate endpoint returns, so a fixture cannot drift from its own counts. */
export function toEnvelope(itemType, items) {
  const count = (status) => items.filter((item) => item.status === status).length;
  return {
    item_type: itemType,
    total: items.length,
    pending: count(REVIEW_STATUS.pending),
    approved: count(REVIEW_STATUS.approved),
    rejected: count(REVIEW_STATUS.rejected),
    items,
  };
}
