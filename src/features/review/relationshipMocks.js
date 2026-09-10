import {
  REVIEW_ITEM_TYPE,
  REVIEW_STATUS,
  seedDecisions,
  toEnvelope,
} from '@/features/review/gateItems';

/**
 * The relationship gate of run R-2418, in the shape the review endpoint returns.
 *
 * Same envelope as the concept gate, with `item_type` RELATIONSHIP. The seed
 * table carries only what differs between links; `toItem` builds the rest into
 * the wire shape — `signals` and `join_evidence` JSON-encoded inside strings,
 * `confidence` duplicated as a string in the payload, ids as UUIDs.
 *
 * `evidence` is the one-line supporting text the table column shows; the
 * structured `join_evidence` is what the dialog opens into. They are separate
 * fields because they answer different questions: the column has to be
 * scannable, and the dialog has to be checkable.
 */

const EXECUTION_RUN_ID = '01fa1a34-552f-4dbd-90ff-f325d5caf018';
const REVIEWER_ID = 'd4e6b0c1-77a8-4f31-9c2e-1b5a83ff40de';
const FIRST_CREATED_AT = '2026-09-08T15:12:07.180Z';

const OBJECT_PROPERTY = 'ObjectProperty';
const SUBCLASS = 'SubClassOf';

const SEED = [
  {
    source: 'Customer',
    predicate: 'holds',
    target: 'Contract',
    confidence: 0.95,
    cardinality: '1 : N',
    role: OBJECT_PROPERTY,
    status: REVIEW_STATUS.approved,
    definition:
      'Each contract belongs to exactly one customer, and a customer may hold many contracts over time, including expired ones.',
    evidence: 'Foreign key contract.customer_id → customer.customer_id, confirmed by the glossary.',
    joinEvidence: [
      {
        signal: 'contract.customer_id',
        value: 'bigint',
        detail: '→ customer.customer_id',
        role: 'foreign key',
      },
      { signal: 'coverage', value: '100%', detail: '611k of 611k rows resolve', role: 'complete' },
      {
        signal: 'fan-out',
        value: 'avg 1.27',
        detail: 'max 41 contracts per customer',
        role: 'total',
      },
    ],
    signals: [
      { text: 'Declared foreign key with full referential integrity', weight: 0.98 },
      { text: 'Glossary states the relationship in words', weight: 0.92 },
      { text: 'Inverse name "heldBy" reads naturally', weight: 0.88 },
    ],
  },
  {
    source: 'Contract',
    predicate: 'generates',
    target: 'Invoice',
    confidence: 0.93,
    cardinality: '1 : N',
    role: OBJECT_PROPERTY,
    status: REVIEW_STATUS.approved,
    definition: 'A contract produces one invoice per billing period for as long as it is active.',
    evidence: 'Invoice table has contract_id, confirmed by an 11.8 average fan-out per contract.',
    joinEvidence: [
      {
        signal: 'invoice.contract_id',
        value: 'bigint',
        detail: '→ contract.contract_id',
        role: 'foreign key',
      },
      {
        signal: 'coverage',
        value: '99.8%',
        detail: '14k orphaned invoices',
        role: 'near-complete',
      },
      { signal: 'fan-out', value: 'avg 11.8', detail: 'one per billing period', role: 'total' },
    ],
    signals: [
      { text: 'Foreign key present, small orphan set from migrations', weight: 0.91 },
      { text: 'Periodicity matches the glossary billing cycle', weight: 0.9 },
      { text: '14k orphans need a rule before the graph is built', weight: 0.72 },
    ],
  },
  {
    source: 'Invoice',
    predicate: 'settledBy',
    target: 'Payment',
    confidence: 0.91,
    cardinality: '1 : N',
    role: OBJECT_PROPERTY,
    definition:
      'An invoice is discharged by one or more payments; partial and instalment payments make this many rather than one.',
    evidence: 'Invoice.payment_id maps to Payment.id with a 96.1% resolution rate.',
    joinEvidence: [
      {
        signal: 'payment.invoice_id',
        value: 'bigint',
        detail: '→ invoice.invoice_id',
        role: 'foreign key',
      },
      {
        signal: 'coverage',
        value: '96.1%',
        detail: 'unpaid invoices have no rows',
        role: 'expected gap',
      },
      { signal: 'fan-out', value: 'avg 1.04', detail: 'max 9 payments per invoice', role: 'total' },
    ],
    signals: [
      { text: 'Foreign key with sensible fan-out', weight: 0.94 },
      { text: 'Partial payments rule out a one-to-one model', weight: 0.89 },
      { text: 'Unmatched payments exist and need a policy', weight: 0.74 },
    ],
  },
  {
    source: 'Customer',
    predicate: 'files',
    target: 'Claim',
    confidence: 0.89,
    cardinality: '1 : N',
    role: OBJECT_PROPERTY,
    definition: 'A customer raises claims against the contract that covers them.',
    evidence: 'Claim.customer_id linked through the contract, 98.4% of claims resolve.',
    joinEvidence: [
      {
        signal: 'claim.customer_id',
        value: 'bigint',
        detail: '→ customer.customer_id',
        role: 'foreign key',
      },
      {
        signal: 'coverage',
        value: '98.4%',
        detail: 'legacy claims predate the column',
        role: 'near-complete',
      },
    ],
    signals: [
      { text: 'Foreign key on a well-populated column', weight: 0.93 },
      { text: 'Claims handbook uses the same wording', weight: 0.86 },
    ],
  },
  {
    source: 'Customer',
    predicate: 'participatesIn',
    target: 'Interaction',
    confidence: 0.87,
    cardinality: '1 : N',
    role: OBJECT_PROPERTY,
    definition: 'Every contact a customer has with the business is recorded as an interaction.',
    evidence: 'Customer can have many interactions; 4.2m rows carry a resolvable customer_id.',
    joinEvidence: [
      {
        signal: 'interaction.customer_id',
        value: 'bigint',
        detail: '→ customer.customer_id',
        role: 'foreign key',
      },
      { signal: 'volume', value: '4.2m', detail: 'avg 8.7 per customer', role: 'total' },
    ],
    signals: [
      { text: 'High-volume link with clean referential integrity', weight: 0.92 },
      { text: 'Anonymous interactions are excluded by a filter', weight: 0.78 },
    ],
  },
  {
    source: 'Interaction',
    predicate: 'handledBy',
    target: 'Agent',
    confidence: 0.85,
    cardinality: 'N : 1',
    role: OBJECT_PROPERTY,
    definition: 'The agent who took the interaction, where one was involved.',
    evidence: 'Interaction.agent_id references agent.id; self-service rows are null by design.',
    joinEvidence: [
      {
        signal: 'interaction.agent_id',
        value: 'bigint',
        detail: '→ agent.agent_id',
        role: 'foreign key',
      },
      {
        signal: 'coverage',
        value: '61%',
        detail: 'self-service has no agent',
        role: 'expected gap',
      },
    ],
    signals: [
      { text: 'Foreign key declared and enforced', weight: 0.9 },
      { text: 'The 39% gap is automated channels, not missing data', weight: 0.81 },
    ],
  },
  {
    source: 'Call',
    predicate: 'subClassOf',
    target: 'Interaction',
    confidence: 0.82,
    cardinality: 'is-a',
    role: SUBCLASS,
    definition: 'A call is one kind of interaction, distinguished by its channel.',
    evidence: 'Call is a type of interaction per the ontology channel enumeration.',
    joinEvidence: [
      {
        signal: 'interaction.channel',
        value: 'enum',
        detail: "'call' is one of 6 values",
        role: 'identifier',
      },
    ],
    signals: [
      { text: 'Channel enumeration is a clean discriminator', weight: 0.87 },
      { text: 'Subtypes share every attribute of the parent', weight: 0.8 },
    ],
  },
  {
    source: 'Customer',
    predicate: 'has',
    target: 'Address',
    confidence: 0.78,
    cardinality: 'N : 1',
    role: OBJECT_PROPERTY,
    definition: 'The postal address on record for a customer at a point in time.',
    evidence: 'Customer.address_id references address.id; history rows make this non-unique.',
    joinEvidence: [
      {
        signal: 'customer.address_id',
        value: 'bigint',
        detail: '→ address.address_id',
        role: 'foreign key',
      },
      {
        signal: 'shared',
        value: '8.4%',
        detail: 'addresses shared between customers',
        role: 'partial',
      },
    ],
    signals: [
      { text: 'Foreign key present', weight: 0.88 },
      { text: 'Shared addresses may need a household concept instead', weight: 0.62 },
    ],
  },
  {
    source: 'Contract',
    predicate: 'hasStatus',
    target: 'ContractStatus',
    confidence: 0.76,
    cardinality: 'N : 1',
    role: OBJECT_PROPERTY,
    definition: 'The lifecycle state a contract is currently in.',
    evidence: 'Contract.status field with enum values active, suspended, expired, cancelled.',
    joinEvidence: [
      {
        signal: 'contract.status',
        value: 'varchar',
        detail: '4 distinct values',
        role: 'identifier',
      },
    ],
    signals: [
      { text: 'Low-cardinality column suits a controlled vocabulary', weight: 0.84 },
      { text: 'No lookup table exists, so the class is inferred', weight: 0.64 },
    ],
  },
  {
    source: 'Payment',
    predicate: 'uses',
    target: 'PaymentMethod',
    confidence: 0.72,
    cardinality: 'N : 1',
    role: OBJECT_PROPERTY,
    definition: 'The instrument a payment was made with.',
    evidence: 'Payment.method_code maps to payment_method.code across 7 distinct values.',
    joinEvidence: [
      {
        signal: 'payment.method_code',
        value: 'varchar',
        detail: '→ payment_method.code',
        role: 'foreign key',
      },
      {
        signal: 'coverage',
        value: '94%',
        detail: 'legacy rows use a free-text field',
        role: 'partial',
      },
    ],
    signals: [
      { text: 'Lookup table exists and is referenced', weight: 0.82 },
      { text: '6% of rows carry unparsed free text', weight: 0.55 },
    ],
  },
  {
    source: 'Claim',
    predicate: 'assessedBy',
    target: 'ClaimAssessment',
    confidence: 0.73,
    cardinality: '1 : N',
    role: OBJECT_PROPERTY,
    definition: 'The assessments carried out against a claim before it is settled.',
    evidence: 'Assessment rows join on claim_id; re-assessments make this one-to-many.',
    joinEvidence: [
      {
        signal: 'assessment.claim_id',
        value: 'bigint',
        detail: '→ claim.claim_id',
        role: 'foreign key',
      },
      {
        signal: 'fan-out',
        value: 'avg 1.4',
        detail: 'appeals trigger a second pass',
        role: 'total',
      },
    ],
    signals: [
      { text: 'Join resolves cleanly', weight: 0.85 },
      { text: 'Whether an appeal is a new assessment is unsettled', weight: 0.58 },
    ],
  },
  {
    source: 'Contract',
    predicate: 'pricedBy',
    target: 'Tariff',
    confidence: 0.66,
    cardinality: 'N : 1',
    role: OBJECT_PROPERTY,
    definition: 'The tariff whose rates the contract is billed against.',
    evidence: 'Contract.tariff_code matched to tariff.code by name, with no declared key.',
    joinEvidence: [
      {
        signal: 'contract.tariff_code',
        value: 'varchar',
        detail: 'no declared foreign key',
        role: 'weak',
      },
      {
        signal: 'coverage',
        value: '88%',
        detail: 'retired tariffs do not resolve',
        role: 'partial',
      },
    ],
    signals: [
      { text: 'Values line up but nothing enforces it', weight: 0.7 },
      { text: 'Retired tariff codes leave 12% dangling', weight: 0.52 },
    ],
  },
  {
    source: 'Invoice',
    predicate: 'coversPeriod',
    target: 'BillingPeriod',
    confidence: 0.81,
    cardinality: 'N : 1',
    role: OBJECT_PROPERTY,
    definition: 'The period an invoice raises charges for.',
    evidence: 'Invoice.period_start and period_end align to the billing calendar without gaps.',
    joinEvidence: [
      {
        signal: 'invoice.period_start',
        value: 'date',
        detail: 'aligns to calendar',
        role: 'complete',
      },
      {
        signal: 'invoice.period_end',
        value: 'date',
        detail: 'no overlapping periods',
        role: 'complete',
      },
    ],
    signals: [
      { text: 'Dates align to the published billing calendar', weight: 0.88 },
      { text: 'Period is derived rather than referenced', weight: 0.68 },
    ],
  },
  {
    source: 'Agent',
    predicate: 'memberOf',
    target: 'Team',
    confidence: 0.84,
    cardinality: 'N : 1',
    role: OBJECT_PROPERTY,
    definition: 'The team an agent reports into.',
    evidence: 'Agent.team_id references team.id with full coverage across active agents.',
    joinEvidence: [
      { signal: 'agent.team_id', value: 'bigint', detail: '→ team.team_id', role: 'foreign key' },
      {
        signal: 'coverage',
        value: '100%',
        detail: 'every active agent has a team',
        role: 'complete',
      },
    ],
    signals: [
      { text: 'Declared foreign key, no nulls on active rows', weight: 0.93 },
      { text: 'Historic team moves are not modelled', weight: 0.66 },
    ],
  },
  {
    source: 'Claim',
    predicate: 'raisedAgainst',
    target: 'Contract',
    confidence: 0.88,
    cardinality: 'N : 1',
    role: OBJECT_PROPERTY,
    definition: 'The contract whose terms a claim is made under.',
    evidence: 'Claim.contract_id references contract.contract_id, enforced in the schema.',
    joinEvidence: [
      {
        signal: 'claim.contract_id',
        value: 'bigint',
        detail: '→ contract.contract_id',
        role: 'foreign key',
      },
      {
        signal: 'coverage',
        value: '99.1%',
        detail: 'goodwill claims have no contract',
        role: 'expected gap',
      },
    ],
    signals: [
      { text: 'Enforced foreign key', weight: 0.94 },
      { text: 'Goodwill claims are a deliberate exception', weight: 0.79 },
    ],
  },
  {
    source: 'Payment',
    predicate: 'madeBy',
    target: 'Customer',
    confidence: 0.9,
    cardinality: 'N : 1',
    role: OBJECT_PROPERTY,
    definition: 'The customer who made a payment, which may differ from the contract holder.',
    evidence: 'Payment.payer_id references customer.customer_id on 99.6% of rows.',
    joinEvidence: [
      {
        signal: 'payment.payer_id',
        value: 'bigint',
        detail: '→ customer.customer_id',
        role: 'foreign key',
      },
      {
        signal: 'third-party',
        value: '2.1%',
        detail: 'payer differs from contract holder',
        role: 'total',
      },
    ],
    signals: [
      { text: 'Foreign key with near-total coverage', weight: 0.93 },
      { text: 'Third-party payers justify a separate link from holds', weight: 0.85 },
    ],
  },
  {
    source: 'Interaction',
    predicate: 'aboutClaim',
    target: 'Claim',
    confidence: 0.61,
    cardinality: 'N : 1',
    role: OBJECT_PROPERTY,
    definition: 'The claim an interaction was about, where one was identified.',
    evidence: 'Interaction.reference_id matched to claim ids by pattern, not by a declared key.',
    joinEvidence: [
      {
        signal: 'interaction.reference_id',
        value: 'varchar',
        detail: 'polymorphic reference',
        role: 'weak',
      },
      {
        signal: 'coverage',
        value: '31%',
        detail: 'reference points at several types',
        role: 'partial',
      },
    ],
    signals: [
      { text: 'Pattern match is plausible but unenforced', weight: 0.6 },
      { text: 'The column also points at contracts and invoices', weight: 0.42 },
    ],
  },
  {
    source: 'Contract',
    predicate: 'supersedes',
    target: 'Contract',
    confidence: 0.69,
    cardinality: 'N : 1',
    role: OBJECT_PROPERTY,
    definition: 'A renewal contract that replaces an earlier one for the same customer.',
    evidence: 'Contract.previous_contract_id is self-referential on 18% of rows.',
    joinEvidence: [
      {
        signal: 'contract.previous_contract_id',
        value: 'bigint',
        detail: 'self-referential',
        role: 'foreign key',
      },
      { signal: 'coverage', value: '18%', detail: 'only renewals carry it', role: 'expected gap' },
    ],
    signals: [
      { text: 'Self-join resolves without cycles', weight: 0.8 },
      { text: 'Renewal chains longer than two are rare and untested', weight: 0.55 },
    ],
  },
  {
    source: 'Invoice',
    predicate: 'hasLine',
    target: 'InvoiceLine',
    confidence: 0.94,
    cardinality: '1 : N',
    role: OBJECT_PROPERTY,
    definition: 'The individual charges that make up an invoice total.',
    evidence: 'InvoiceLine.invoice_id references invoice.invoice_id; totals reconcile exactly.',
    joinEvidence: [
      {
        signal: 'invoice_line.invoice_id',
        value: 'bigint',
        detail: '→ invoice.invoice_id',
        role: 'foreign key',
      },
      {
        signal: 'reconciliation',
        value: '100%',
        detail: 'line sums match invoice totals',
        role: 'complete',
      },
    ],
    signals: [
      { text: 'Foreign key with exact total reconciliation', weight: 0.97 },
      { text: 'Composition rather than association', weight: 0.9 },
    ],
  },
  {
    source: 'InvoiceLine',
    predicate: 'charges',
    target: 'Product',
    confidence: 0.79,
    cardinality: 'N : 1',
    role: OBJECT_PROPERTY,
    definition: 'The product or service an invoice line is billing for.',
    evidence: 'InvoiceLine.product_code maps to product.code across 142 distinct values.',
    joinEvidence: [
      {
        signal: 'invoice_line.product_code',
        value: 'varchar',
        detail: '→ product.code',
        role: 'foreign key',
      },
      {
        signal: 'coverage',
        value: '92%',
        detail: 'adjustments carry no product',
        role: 'expected gap',
      },
    ],
    signals: [
      { text: 'Lookup resolves for every billable line', weight: 0.86 },
      { text: 'Credits and adjustments need a separate treatment', weight: 0.64 },
    ],
  },
  {
    source: 'Customer',
    predicate: 'hasSegment',
    target: 'CustomerSegment',
    confidence: 0.71,
    cardinality: 'N : 1',
    role: OBJECT_PROPERTY,
    definition: 'The commercial segment a customer is classified into.',
    evidence: 'Customer.segment holds 5 values with no lookup table behind them.',
    joinEvidence: [
      {
        signal: 'customer.segment',
        value: 'varchar',
        detail: '5 distinct values',
        role: 'identifier',
      },
    ],
    signals: [
      { text: 'Stable low-cardinality vocabulary', weight: 0.8 },
      { text: 'Segments are re-cut yearly and not versioned', weight: 0.5 },
    ],
  },
  {
    source: 'Agent',
    predicate: 'resolves',
    target: 'Claim',
    confidence: 0.58,
    cardinality: 'N : M',
    role: OBJECT_PROPERTY,
    status: REVIEW_STATUS.rejected,
    comment: 'Duplicates assessedBy through ClaimAssessment. One path to the agent is enough.',
    definition: 'The agent who closed a claim.',
    evidence: 'Derived by joining claim through assessment to agent; no direct column exists.',
    joinEvidence: [
      { signal: 'derived', value: '2 hops', detail: 'claim → assessment → agent', role: 'weak' },
    ],
    signals: [
      { text: 'The path exists but is already modelled', weight: 0.55 },
      { text: 'Adds a second route between the same two classes', weight: 0.34 },
    ],
  },
  {
    source: 'Customer',
    predicate: 'residesAt',
    target: 'ServiceAddress',
    confidence: 0.52,
    cardinality: 'N : 1',
    role: OBJECT_PROPERTY,
    definition: 'The address a service is delivered to, as distinct from the billing address.',
    evidence: 'No column distinguishes service from billing address; inferred from usage patterns.',
    joinEvidence: [
      { signal: 'address.type', value: 'absent', detail: 'no discriminator column', role: 'gap' },
    ],
    signals: [
      { text: 'The distinction appears in documents, not in data', weight: 0.5 },
      { text: 'Would need a new column to be materialised', weight: 0.36 },
    ],
  },
  {
    source: 'Household',
    predicate: 'contains',
    target: 'Customer',
    confidence: 0.44,
    cardinality: '1 : N',
    role: OBJECT_PROPERTY,
    definition: 'A group of customers sharing an address and, usually, a bill.',
    evidence: 'Inferred by grouping on address_id; flats and shared addresses break the grouping.',
    joinEvidence: [
      { signal: 'grouped', value: 'address_id', detail: 'no household table exists', role: 'weak' },
      {
        signal: 'false positives',
        value: '12%',
        detail: 'flats share a street address',
        role: 'gap',
      },
    ],
    signals: [
      { text: 'Grouping is a heuristic, not a key', weight: 0.42 },
      { text: 'Depends on Household being approved as a concept', weight: 0.34 },
    ],
  },
  {
    source: 'Team',
    predicate: 'ownsQueue',
    target: 'Queue',
    confidence: 0.63,
    cardinality: '1 : N',
    role: OBJECT_PROPERTY,
    definition: 'The work queues a team is responsible for clearing.',
    evidence: 'Queue.owning_team_id is populated on 74% of queues; the rest are unassigned.',
    joinEvidence: [
      {
        signal: 'queue.owning_team_id',
        value: 'bigint',
        detail: '→ team.team_id',
        role: 'foreign key',
      },
      { signal: 'coverage', value: '74%', detail: 'shared queues have no owner', role: 'partial' },
    ],
    signals: [
      { text: 'Foreign key where it is populated', weight: 0.75 },
      { text: 'Shared queues may need a many-to-many instead', weight: 0.48 },
    ],
  },
];

/** Fixture ids are UUID-shaped so the dialog renders the width the API will send. */
const refId = (index) => `7b2c41df-93a6-4e15-8c07-4d1e6a${String(index).padStart(6, '0')}`;

/** Items arrive newest first, a little under a minute apart. */
const stampedAt = (index, offsetMs = 0) =>
  new Date(Date.parse(FIRST_CREATED_AT) - index * 47_000 + offsetMs).toISOString();

function toItem(seed, index) {
  const status = seed.status ?? REVIEW_STATUS.pending;
  const decided = status !== REVIEW_STATUS.pending;
  const itemRefId = refId(index);

  return {
    item_ref_id: itemRefId,
    item_type: REVIEW_ITEM_TYPE.relationship,
    status,
    confidence: seed.confidence,
    reviewed_by_id: decided ? REVIEWER_ID : null,
    reviewed_at: decided ? stampedAt(index, 38 * 60_000) : null,
    review_comment: seed.comment ?? null,
    payload: {
      source_concept: seed.source,
      relationship_type: seed.predicate,
      target_concept: seed.target,
      cardinality: seed.cardinality,
      ontology_role: seed.role,
      definition: seed.definition,
      evidence: seed.evidence,
      join_evidence: JSON.stringify(seed.joinEvidence),
      signals: JSON.stringify(seed.signals),
      confidence: String(seed.confidence),
      canonical_relationship_id: itemRefId,
      execution_run_id: EXECUTION_RUN_ID,
      created_at: stampedAt(index),
    },
  };
}

const ITEMS = SEED.map(toItem);

/** The response body of the relationship review endpoint, verbatim in shape. */
export const RELATIONSHIP_REVIEW = toEnvelope(REVIEW_ITEM_TYPE.relationship, ITEMS);

/** What the reviewer had already decided before they arrived. */
export const INITIAL_RELATIONSHIP_DECISIONS = seedDecisions(ITEMS);
