import { parseJsonArray } from '@/features/review/gateItems';

/**
 * The concept gate's half of the review API: how one response item becomes the
 * row the table draws, and what the table can sort it by.
 *
 * Everything that is true of any gate — the envelope, the statuses, the status
 * and confidence filters — lives in `gateItems.js`. This file is only the
 * concept payload.
 */

/** Aliases arrive as a JSON-encoded array inside a string field, not an array. */
export const parseAliases = (raw) =>
  parseJsonArray(raw).filter((alias) => typeof alias === 'string');

/**
 * One response item, flattened into what the screen actually reads.
 *
 * Confidence is taken from the item rather than the payload copy of it: the
 * payload's is a string, and a score the table sorts and colours by should be a
 * number everywhere above this line.
 */
export function normalizeConcept(item) {
  const payload = item.payload ?? {};
  return {
    id: item.item_ref_id,
    name: payload.canonical_name,
    aliases: parseAliases(payload.aliases),
    type: payload.type,
    role: payload.ontology_role,
    definition: payload.definition,
    confidence: Number(item.confidence ?? payload.confidence ?? 0),
    status: item.status,
    reviewedBy: item.reviewed_by_id,
    reviewedAt: item.reviewed_at,
    comment: item.review_comment,
    conceptId: payload.canonical_concept_id,
    runId: payload.execution_run_id,
    createdAt: payload.created_at,
  };
}

export const CONCEPT_SORT = {
  nameAsc: 'name-asc',
  nameDesc: 'name-desc',
  confidenceDesc: 'confidence-desc',
  confidenceAsc: 'confidence-asc',
  type: 'type',
};

export const CONCEPT_SORTS = [
  { id: CONCEPT_SORT.nameAsc, label: 'Concept (A–Z)' },
  { id: CONCEPT_SORT.nameDesc, label: 'Concept (Z–A)' },
  { id: CONCEPT_SORT.confidenceDesc, label: 'Confidence (high first)' },
  { id: CONCEPT_SORT.confidenceAsc, label: 'Confidence (low first)' },
  { id: CONCEPT_SORT.type, label: 'Class / type' },
];

/** Ties break on name, so a sort by type or confidence is still stable to read. */
export const CONCEPT_COMPARATORS = {
  [CONCEPT_SORT.nameAsc]: (a, b) => a.name.localeCompare(b.name),
  [CONCEPT_SORT.nameDesc]: (a, b) => b.name.localeCompare(a.name),
  [CONCEPT_SORT.confidenceDesc]: (a, b) =>
    b.confidence - a.confidence || a.name.localeCompare(b.name),
  [CONCEPT_SORT.confidenceAsc]: (a, b) =>
    a.confidence - b.confidence || a.name.localeCompare(b.name),
  [CONCEPT_SORT.type]: (a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name),
};

/** Free-text search across everything a reviewer would type looking for a concept. */
export function conceptMatches(concept, needle) {
  return [concept.name, concept.type, concept.role, concept.definition, ...concept.aliases]
    .filter(Boolean)
    .some((field) => field.toLowerCase().includes(needle));
}
