import { DECISION } from '@/config/constants/common';

/**
 * Relationship proposals from run R-2418. An item carries its own evidence and
 * its own confidence reasoning, because the reviewer needs both in front of
 * them to decide.
 *
 * The concepts these links run between come from `conceptMocks.js`, which is
 * already in the review endpoint's shape. Relationships have not been moved
 * onto it yet — they will be when their own endpoint is written.
 */

/** The run these proposals came out of. */
export const PROPOSAL_RUN = 'R-2418';

export const RELATIONS = [
  {
    id: 'r1',
    subject: 'Customer',
    predicate: 'holds',
    object: 'Contract',
    confidence: 0.95,
    cardinality: '1 : N',
    kind: 'Object property',
    definition:
      'Each contract belongs to exactly one customer, and a customer may hold many contracts over time, including expired ones.',
    definitionSource: 'Foreign key contract.customer_id, confirmed by the glossary',
    sourceIcon: 'database',
    evidence: [
      {
        id: 'e1',
        a: 'contract.customer_id',
        b: 'bigint',
        c: '→ customer.customer_id',
        role: 'foreign key',
      },
      { id: 'e2', a: 'coverage', b: '100%', c: '611k of 611k rows resolve', role: 'complete' },
      {
        id: 'e3',
        a: 'fan-out',
        b: 'avg 1.27',
        c: 'max 41 contracts per customer',
        role: 'cardinality',
      },
    ],
    signals: [
      { id: 's1', text: 'Declared foreign key with full referential integrity', weight: 0.98 },
      { id: 's2', text: 'Glossary states the relationship in words', weight: 0.92 },
      { id: 's3', text: 'Inverse name "heldBy" reads naturally', weight: 0.88 },
    ],
  },
  {
    id: 'r2',
    subject: 'Contract',
    predicate: 'generates',
    object: 'Invoice',
    confidence: 0.93,
    cardinality: '1 : N',
    kind: 'Object property',
    definition: 'A contract produces one invoice per billing period for as long as it is active.',
    definitionSource: 'Foreign key invoice.contract_id',
    sourceIcon: 'database',
    evidence: [
      {
        id: 'e1',
        a: 'invoice.contract_id',
        b: 'bigint',
        c: '→ contract.contract_id',
        role: 'foreign key',
      },
      { id: 'e2', a: 'coverage', b: '99.8%', c: '14k orphaned invoices', role: 'near-complete' },
      { id: 'e3', a: 'fan-out', b: 'avg 11.8', c: 'one per billing period', role: 'cardinality' },
    ],
    signals: [
      { id: 's1', text: 'Foreign key present, small orphan set from migrations', weight: 0.91 },
      { id: 's2', text: 'Periodicity matches the glossary billing cycle', weight: 0.9 },
      { id: 's3', text: '14k orphans need a rule before the graph is built', weight: 0.72 },
    ],
  },
  {
    id: 'r3',
    subject: 'Invoice',
    predicate: 'settledBy',
    object: 'Payment',
    confidence: 0.91,
    cardinality: '1 : N',
    kind: 'Object property',
    definition:
      'An invoice is discharged by one or more payments; partial and instalment payments make this many rather than one.',
    definitionSource: 'Foreign key payment.invoice_id',
    sourceIcon: 'database',
    evidence: [
      {
        id: 'e1',
        a: 'payment.invoice_id',
        b: 'bigint',
        c: '→ invoice.invoice_id',
        role: 'foreign key',
      },
      {
        id: 'e2',
        a: 'coverage',
        b: '96.1%',
        c: 'unpaid invoices have no rows',
        role: 'expected gap',
      },
      {
        id: 'e3',
        a: 'fan-out',
        b: 'avg 1.04',
        c: 'max 9 payments per invoice',
        role: 'cardinality',
      },
    ],
    signals: [
      { id: 's1', text: 'Foreign key with sensible fan-out', weight: 0.94 },
      { id: 's2', text: 'Partial payments rule out a one-to-one model', weight: 0.89 },
      { id: 's3', text: 'Unmatched payments exist and need a policy', weight: 0.74 },
    ],
  },
  {
    id: 'r4',
    subject: 'Customer',
    predicate: 'files',
    object: 'Claim',
    confidence: 0.89,
    cardinality: '1 : N',
    kind: 'Object property',
    definition:
      'A customer raises claims against the business. Claims filed on behalf of a customer by staff carry the same key.',
    definitionSource: 'Foreign key claim.customer_id, described in the claims policy',
    sourceIcon: 'doc',
    evidence: [
      {
        id: 'e1',
        a: 'claim.customer_id',
        b: 'bigint',
        c: '→ customer.customer_id',
        role: 'foreign key',
      },
      { id: 'e2', a: 'coverage', b: '100%', c: '94k of 94k rows resolve', role: 'complete' },
      { id: 'e3', a: 'fan-out', b: 'avg 0.19', c: 'most customers file none', role: 'cardinality' },
    ],
    signals: [
      { id: 's1', text: 'Clean foreign key with full coverage', weight: 0.95 },
      { id: 's2', text: 'Policy describes who may file a claim', weight: 0.88 },
      { id: 's3', text: 'Third-party claims blur the domain slightly', weight: 0.7 },
    ],
  },
  {
    id: 'r5',
    subject: 'Customer',
    predicate: 'participatesIn',
    object: 'Interaction',
    confidence: 0.87,
    cardinality: '1 : N',
    kind: 'Object property',
    definition:
      'Links a customer to every recorded touchpoint they were part of, across all channels.',
    definitionSource: 'Foreign key interaction.customer_id',
    sourceIcon: 'database',
    evidence: [
      {
        id: 'e1',
        a: 'interaction.customer_id',
        b: 'bigint',
        c: '→ customer.customer_id',
        role: 'foreign key',
      },
      { id: 'e2', a: 'coverage', b: '94.2%', c: '180k anonymous interactions', role: 'partial' },
      { id: 'e3', a: 'fan-out', b: 'avg 6.4', c: 'heavy tail', role: 'cardinality' },
    ],
    signals: [
      { id: 's1', text: 'Foreign key present across 3.1m rows', weight: 0.92 },
      { id: 's2', text: 'Anonymous pre-identification contacts do not resolve', weight: 0.68 },
      { id: 's3', text: 'ContactCentre v7 uses the same property name', weight: 0.9 },
    ],
  },
  {
    id: 'r6',
    subject: 'Interaction',
    predicate: 'handledBy',
    object: 'Agent',
    confidence: 0.85,
    cardinality: 'N : 1',
    kind: 'Object property',
    definition:
      'The staff member who took the interaction. Automated and self-service interactions have no agent.',
    definitionSource: 'Foreign key interaction.agent_id',
    sourceIcon: 'database',
    evidence: [
      {
        id: 'e1',
        a: 'interaction.agent_id',
        b: 'bigint',
        c: '→ agent.agent_id',
        role: 'foreign key',
      },
      { id: 'e2', a: 'coverage', b: '71.5%', c: 'self-service rows are null', role: 'partial' },
      { id: 'e3', a: 'fan-in', b: 'avg 920', c: 'interactions per agent', role: 'cardinality' },
    ],
    signals: [
      { id: 's1', text: 'Foreign key resolves cleanly where populated', weight: 0.9 },
      { id: 's2', text: 'High null rate is expected, not a defect', weight: 0.82 },
      { id: 's3', text: 'Transfers mean one interaction can have two agents', weight: 0.64 },
    ],
  },
  {
    id: 'r7',
    subject: 'Call',
    predicate: 'subClassOf',
    object: 'Interaction',
    confidence: 0.82,
    cardinality: 'is-a',
    kind: 'Subclass axiom',
    definition:
      'Every call is an interaction with additional voice-specific attributes. Modelling it as a subclass keeps channel queries uniform.',
    definitionSource: 'Key overlap analysis plus the contact centre taxonomy',
    sourceIcon: 'doc',
    evidence: [
      {
        id: 'e1',
        a: 'call.interaction_id',
        b: 'bigint',
        c: '→ interaction.interaction_id',
        role: 'foreign key',
      },
      { id: 'e2', a: 'overlap', b: '100%', c: 'every call has an interaction', role: 'total' },
      {
        id: 'e3',
        a: 'extra columns',
        b: '4',
        c: 'duration, queue, outcome, recording',
        role: 'specialisation',
      },
    ],
    signals: [
      { id: 's1', text: 'Total participation in one direction only', weight: 0.91 },
      { id: 's2', text: 'Four attributes that only apply to voice', weight: 0.86 },
      { id: 's3', text: 'A channel attribute would model this too', weight: 0.58 },
    ],
  },
  {
    id: 'r8',
    subject: 'Claim',
    predicate: 'assessedBy',
    object: 'ClaimAssessment',
    confidence: 0.73,
    cardinality: '1 : N',
    kind: 'Object property',
    definition:
      'Connects a claim to the assessments made against it. Described in policy; only partially present in the data.',
    definitionSource: 'Claims Handling Policy v3.pdf §7',
    sourceIcon: 'doc',
    evidence: [
      { id: 'e1', a: 'claim.assessed_by', b: 'bigint', c: '→ agent.agent_id', role: 'weak proxy' },
      { id: 'e2', a: 'coverage', b: '77%', c: 'open claims are unassessed', role: 'partial' },
      { id: 'e3', a: '—', b: '—', c: 'no assessment table exists', role: 'gap' },
    ],
    signals: [
      { id: 's1', text: 'Policy describes a repeated assessment process', weight: 0.84 },
      { id: 's2', text: 'Data only records the final assessor', weight: 0.55 },
      { id: 's3', text: 'Depends on ClaimAssessment being approved', weight: 0.62 },
    ],
  },
  {
    id: 'r9',
    subject: 'Contract',
    predicate: 'pricedBy',
    object: 'Tariff',
    confidence: 0.66,
    cardinality: 'N : 1',
    kind: 'Object property',
    definition:
      'The pricing scheme a contract is billed under, inferred from a plan code with no reference table behind it.',
    definitionSource: 'Billing Domain Glossary.docx §4',
    sourceIcon: 'doc',
    evidence: [
      { id: 'e1', a: 'contract.plan_code', b: 'string', c: 'RES-STD-24', role: 'weak identifier' },
      { id: 'e2', a: 'distinct', b: '46', c: 'plan codes in use', role: 'cardinality' },
      { id: 'e3', a: '—', b: '—', c: 'no tariff table in scope', role: 'gap' },
    ],
    signals: [
      { id: 's1', text: 'Plan code is stable and low cardinality', weight: 0.74 },
      { id: 's2', text: 'No table to resolve codes into tariff instances', weight: 0.42 },
      { id: 's3', text: 'Depends on Tariff being approved', weight: 0.55 },
    ],
  },
  {
    id: 'r10',
    subject: 'Customer',
    predicate: 'residesAt',
    object: 'ServiceAddress',
    confidence: 0.52,
    cardinality: 'N : 1',
    kind: 'Object property',
    definition: 'Links a customer to the premises served, derived from unparsed address text.',
    definitionSource: 'Inferred from address columns, no reference data',
    sourceIcon: 'node',
    evidence: [
      {
        id: 'e1',
        a: 'customer.address_line1',
        b: 'string',
        c: '14 Ashgrove Terrace',
        role: 'unparsed',
      },
      { id: 'e2', a: 'match rate', b: '61%', c: 'to a normalised form', role: 'weak' },
    ],
    signals: [
      { id: 's1', text: 'Address parsing is unreliable without reference data', weight: 0.36 },
      { id: 's2', text: 'Billing and service address are conflated', weight: 0.3 },
      { id: 's3', text: 'Depends on ServiceAddress being approved', weight: 0.42 },
    ],
  },
  {
    id: 'r11',
    subject: 'Household',
    predicate: 'contains',
    object: 'Customer',
    confidence: 0.44,
    cardinality: '1 : N',
    kind: 'Object property',
    definition:
      'Groups customers sharing an address into a household. Derived from clustering, with no stable identifier.',
    definitionSource: 'Inferred by address clustering',
    sourceIcon: 'node',
    evidence: [
      { id: 'e1', a: 'cluster key', b: 'derived', c: 'normalised address hash', role: 'synthetic' },
      { id: 'e2', a: 'ambiguous', b: '11%', c: 'of clusters', role: 'quality' },
    ],
    signals: [
      { id: 's1', text: 'Clustering is heuristic and unvalidated', weight: 0.28 },
      { id: 's2', text: 'Flats and shared addresses break the grouping', weight: 0.24 },
      { id: 's3', text: 'Depends on Household being approved', weight: 0.34 },
    ],
  },
];

/** Decisions already made when the reviewer arrives — a partly-worked gate. */
export const INITIAL_DECISIONS = {
  r1: DECISION.approved,
  r2: DECISION.approved,
};
