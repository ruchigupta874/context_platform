import { parseJsonArray } from '@/features/review/gateItems';

/**
 * The relationship gate's half of the review API.
 *
 * The envelope is the one the concept gate already proved — a total, a count
 * per status, and items carrying a `payload` — with `item_type` RELATIONSHIP.
 * The payload keys below are the shape this screen assumes until the endpoint
 * is written; `normalizeRelationship` is the only thing that reads them, so
 * matching the real response is a change to one function.
 *
 * `signals` and `join_evidence` arrive JSON-encoded inside a string, the same
 * way a concept's `aliases` does — the one thing the sample response told us
 * about how this API encodes lists.
 */

/** Ids are added here rather than stored: nothing outside a row needs them. */
const withIds = (rows, prefix) => rows.map((row, index) => ({ ...row, id: `${prefix}${index}` }));

export function normalizeRelationship(item) {
  const payload = item.payload ?? {};
  return {
    id: item.item_ref_id,
    source: payload.source_concept,
    predicate: payload.relationship_type,
    target: payload.target_concept,
    cardinality: payload.cardinality,
    role: payload.ontology_role,
    definition: payload.definition,
    // The one-line supporting text the table shows, in full for the dialog.
    evidence: payload.evidence,
    joinEvidence: withIds(parseJsonArray(payload.join_evidence), 'e'),
    signals: withIds(parseJsonArray(payload.signals), 's'),
    confidence: Number(item.confidence ?? payload.confidence ?? 0),
    status: item.status,
    reviewedBy: item.reviewed_by_id,
    reviewedAt: item.reviewed_at,
    comment: item.review_comment,
    relationshipId: payload.canonical_relationship_id,
    runId: payload.execution_run_id,
    createdAt: payload.created_at,
  };
}

/** "Customer holds Contract" — the human-readable form of the triple. */
export const relationshipLabel = (relationship) =>
  `${relationship.source} ${relationship.predicate} ${relationship.target}`;

export const RELATIONSHIP_SORT = {
  sourceAsc: 'source-asc',
  sourceDesc: 'source-desc',
  targetAsc: 'target-asc',
  confidenceDesc: 'confidence-desc',
  confidenceAsc: 'confidence-asc',
};

export const RELATIONSHIP_SORTS = [
  { id: RELATIONSHIP_SORT.sourceAsc, label: 'Source concept (A–Z)' },
  { id: RELATIONSHIP_SORT.sourceDesc, label: 'Source concept (Z–A)' },
  { id: RELATIONSHIP_SORT.targetAsc, label: 'Target concept (A–Z)' },
  { id: RELATIONSHIP_SORT.confidenceDesc, label: 'Confidence (high first)' },
  { id: RELATIONSHIP_SORT.confidenceAsc, label: 'Confidence (low first)' },
];

/**
 * Sorting by one end of a triple leaves the other two free, so every
 * comparator falls through to the rest of the triple. Two links out of
 * Customer should not swap places between renders.
 */
const byTriple = (a, b) =>
  a.source.localeCompare(b.source) ||
  a.predicate.localeCompare(b.predicate) ||
  a.target.localeCompare(b.target);

export const RELATIONSHIP_COMPARATORS = {
  [RELATIONSHIP_SORT.sourceAsc]: byTriple,
  [RELATIONSHIP_SORT.sourceDesc]: (a, b) => b.source.localeCompare(a.source) || byTriple(a, b),
  [RELATIONSHIP_SORT.targetAsc]: (a, b) => a.target.localeCompare(b.target) || byTriple(a, b),
  [RELATIONSHIP_SORT.confidenceDesc]: (a, b) => b.confidence - a.confidence || byTriple(a, b),
  [RELATIONSHIP_SORT.confidenceAsc]: (a, b) => a.confidence - b.confidence || byTriple(a, b),
};

/** Free-text search across the triple and the words that justify it. */
export function relationshipMatches(relationship, needle) {
  return [
    relationship.source,
    relationship.predicate,
    relationship.target,
    relationship.definition,
    relationship.evidence,
  ]
    .filter(Boolean)
    .some((field) => field.toLowerCase().includes(needle));
}
