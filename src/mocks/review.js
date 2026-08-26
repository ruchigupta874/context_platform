import { DECISION } from '../config/constants/common';

/**
 * Proposals from run R-2418. Shape mirrors what the review API will return:
 * an item carries its own evidence and its own confidence reasoning, because
 * the reviewer needs both in front of them to decide.
 */
/** The run these proposals came out of. */
export const PROPOSAL_RUN = 'R-2418';

export const CONCEPTS = [
  {
    id: 'c1',
    name: 'Customer',
    confidence: 0.96,
    source: 'from uc.customer',
    definition:
      'A party that holds one or more service contracts and is billed against them. Includes both residential and small-business account holders, but not internal test accounts.',
    definitionSource: 'Customer Data Dictionary 2026.pdf, p.4 — matched to uc.customer',
    sourceIcon: 'doc',
    evidence: [
      { id: 'e1', a: 'customer_id', b: 'bigint', c: '4821993', role: 'identifier' },
      { id: 'e2', a: 'full_name', b: 'string', c: 'Jacob Martin', role: 'label' },
      { id: 'e3', a: 'segment', b: 'string', c: 'residential', role: 'attribute' },
      { id: 'e4', a: 'created_at', b: 'timestamp', c: '2019-03-11 09:22', role: 'attribute' },
    ],
    signals: [
      { id: 's1', text: 'Primary key with 482k distinct values, no nulls', weight: 0.98 },
      { id: 's2', text: 'Named in the data dictionary and the billing glossary', weight: 0.94 },
      { id: 's3', text: 'Referenced by 5 foreign keys across the selected tables', weight: 0.91 },
    ],
    relationIds: ['r1', 'r4', 'r5'],
  },
  {
    id: 'c2',
    name: 'Contract',
    confidence: 0.94,
    source: 'from uc.contract',
    definition:
      'A signed service agreement between the business and a customer, valid over a date range and carrying the terms that invoices are raised against.',
    definitionSource: 'Billing Domain Glossary.docx, §2.1 — matched to uc.contract',
    sourceIcon: 'doc',
    evidence: [
      { id: 'e1', a: 'contract_id', b: 'bigint', c: '77104223', role: 'identifier' },
      { id: 'e2', a: 'customer_id', b: 'bigint', c: '4821993', role: 'foreign key' },
      { id: 'e3', a: 'start_date', b: 'date', c: '2019-04-01', role: 'attribute' },
      { id: 'e4', a: 'status', b: 'string', c: 'active', role: 'attribute' },
    ],
    signals: [
      { id: 's1', text: 'Primary key, 611k rows, clean cardinality against customer', weight: 0.96 },
      { id: 's2', text: 'Glossary defines the term explicitly', weight: 0.93 },
      { id: 's3', text: 'Central to three downstream tables', weight: 0.88 },
    ],
    relationIds: ['r1', 'r2', 'r9'],
  },
  {
    id: 'c3',
    name: 'Invoice',
    confidence: 0.93,
    source: 'from uc.invoice',
    definition:
      'A billing document issued against a contract for one billing period, listing charges and the amount due.',
    definitionSource: 'Billing Domain Glossary.docx, §3 — matched to uc.invoice',
    sourceIcon: 'doc',
    evidence: [
      { id: 'e1', a: 'invoice_id', b: 'bigint', c: '910233871', role: 'identifier' },
      { id: 'e2', a: 'contract_id', b: 'bigint', c: '77104223', role: 'foreign key' },
      { id: 'e3', a: 'amount_due', b: 'decimal', c: '84.20', role: 'attribute' },
      { id: 'e4', a: 'issued_on', b: 'date', c: '2026-07-01', role: 'attribute' },
    ],
    signals: [
      { id: 's1', text: '7.2m rows, one per contract per billing period', weight: 0.95 },
      { id: 's2', text: 'Glossary term with a precise definition', weight: 0.92 },
      { id: 's3', text: 'Settlement chain to payment is unambiguous', weight: 0.9 },
    ],
    relationIds: ['r2', 'r3'],
  },
  {
    id: 'c4',
    name: 'Payment',
    confidence: 0.9,
    source: 'from uc.payment',
    definition: 'A settlement event that discharges some or all of the amount due on an invoice.',
    definitionSource: 'Inferred from uc.payment structure and glossary context',
    sourceIcon: 'database',
    evidence: [
      { id: 'e1', a: 'payment_id', b: 'bigint', c: '551200934', role: 'identifier' },
      { id: 'e2', a: 'invoice_id', b: 'bigint', c: '910233871', role: 'foreign key' },
      { id: 'e3', a: 'amount', b: 'decimal', c: '84.20', role: 'attribute' },
      { id: 'e4', a: 'method', b: 'string', c: 'direct_debit', role: 'attribute' },
    ],
    signals: [
      { id: 's1', text: 'Clean foreign key into invoice, 6.9m rows', weight: 0.94 },
      { id: 's2', text: 'Partial-payment rows imply many-to-one, not one-to-one', weight: 0.86 },
      { id: 's3', text: 'Term appears in the glossary without a formal definition', weight: 0.79 },
    ],
    relationIds: ['r3'],
  },
  {
    id: 'c5',
    name: 'Claim',
    confidence: 0.88,
    source: 'from uc.claim',
    definition:
      'A request raised by a customer for compensation, correction or goodwill, tracked from submission through to resolution.',
    definitionSource: 'Claims Handling Policy v3.pdf, p.2 — matched to uc.claim',
    sourceIcon: 'doc',
    evidence: [
      { id: 'e1', a: 'claim_id', b: 'bigint', c: '30119', role: 'identifier' },
      { id: 'e2', a: 'customer_id', b: 'bigint', c: '4821993', role: 'foreign key' },
      { id: 'e3', a: 'claim_type', b: 'string', c: 'billing_dispute', role: 'attribute' },
      { id: 'e4', a: 'resolved_at', b: 'timestamp', c: 'null (23% of rows)', role: 'attribute' },
    ],
    signals: [
      { id: 's1', text: 'Policy document defines the lifecycle in detail', weight: 0.93 },
      { id: 's2', text: 'Table has no description in the catalog', weight: 0.71 },
      { id: 's3', text: '94k rows, key structure is clean', weight: 0.9 },
    ],
    relationIds: ['r4', 'r8'],
  },
  {
    id: 'c6',
    name: 'Interaction',
    confidence: 0.86,
    source: 'from uc.interaction',
    definition:
      'Any recorded touchpoint between a customer and the business, across voice, chat, email and in-person channels.',
    definitionSource: 'Contact Centre Taxonomy + uc.interaction structure',
    sourceIcon: 'doc',
    evidence: [
      { id: 'e1', a: 'interaction_id', b: 'bigint', c: '88231004', role: 'identifier' },
      { id: 'e2', a: 'customer_id', b: 'bigint', c: '4821993', role: 'foreign key' },
      { id: 'e3', a: 'channel', b: 'string', c: 'voice', role: 'attribute' },
      { id: 'e4', a: 'agent_id', b: 'bigint', c: '1187', role: 'foreign key' },
    ],
    signals: [
      { id: 's1', text: 'Superset of the call table by row count and key overlap', weight: 0.89 },
      { id: 's2', text: 'Channel column suggests a subtype hierarchy', weight: 0.84 },
      { id: 's3', text: 'Seeded from ContactCentre v7 where the term is published', weight: 0.87 },
    ],
    relationIds: ['r5', 'r6', 'r7'],
  },
  {
    id: 'c7',
    name: 'Call',
    confidence: 0.84,
    source: 'from uc.call',
    definition:
      'A voice interaction handled by the contact centre, carrying duration, queue and outcome detail that other channels do not have.',
    definitionSource: 'Inferred from uc.call structure and its overlap with interaction',
    sourceIcon: 'database',
    evidence: [
      { id: 'e1', a: 'call_id', b: 'bigint', c: 'CALL0000170', role: 'identifier' },
      { id: 'e2', a: 'interaction_id', b: 'bigint', c: '88231004', role: 'foreign key' },
      { id: 'e3', a: 'duration_sec', b: 'int', c: '412', role: 'attribute' },
      { id: 'e4', a: 'queue', b: 'string', c: 'billing_l1', role: 'attribute' },
    ],
    signals: [
      { id: 's1', text: 'Every call row maps to an interaction row', weight: 0.92 },
      { id: 's2', text: 'Adds four columns interaction does not carry', weight: 0.85 },
      { id: 's3', text: 'Could be modelled as a subclass or a channel value', weight: 0.62 },
    ],
    relationIds: ['r7'],
  },
  {
    id: 'c8',
    name: 'Agent',
    confidence: 0.83,
    source: 'from uc.agent',
    definition:
      'A member of contact-centre staff who handles customer interactions, identified by an employee reference.',
    definitionSource: 'Inferred from uc.agent structure',
    sourceIcon: 'database',
    evidence: [
      { id: 'e1', a: 'agent_id', b: 'bigint', c: '1187', role: 'identifier' },
      { id: 'e2', a: 'display_name', b: 'string', c: 'AGT138', role: 'label' },
      { id: 'e3', a: 'team', b: 'string', c: 'billing_l1', role: 'attribute' },
      { id: 'e4', a: 'active', b: 'boolean', c: 'true', role: 'attribute' },
    ],
    signals: [
      { id: 's1', text: 'Small dimension table, 2.4k rows, referenced by interaction', weight: 0.9 },
      { id: 's2', text: 'No description in the catalog and no glossary entry', weight: 0.68 },
      { id: 's3', text: 'Name overlaps with the AI sense of "agent" in the docs', weight: 0.55 },
    ],
    relationIds: ['r6'],
  },
  {
    id: 'c9',
    name: 'BillingAccount',
    confidence: 0.74,
    source: 'inferred',
    definition:
      'The billing identity a set of contracts is invoiced under. Proposed because several customers share an invoicing reference that is not the customer key.',
    definitionSource: 'Inferred from a repeated billing_ref across customer and invoice',
    sourceIcon: 'node',
    evidence: [
      { id: 'e1', a: 'customer.billing_ref', b: 'string', c: 'BA-77120', role: 'identifier' },
      { id: 'e2', a: 'invoice.billing_ref', b: 'string', c: 'BA-77120', role: 'join column' },
      { id: 'e3', a: '—', b: '—', c: '38k distinct values', role: 'cardinality' },
    ],
    signals: [
      { id: 's1', text: 'Repeated non-key reference shared by two tables', weight: 0.81 },
      { id: 's2', text: 'No table of its own, would be a virtual class', weight: 0.58 },
      { id: 's3', text: 'Not named in any supplied document', weight: 0.44 },
    ],
    relationIds: [],
  },
  {
    id: 'c10',
    name: 'ClaimAssessment',
    confidence: 0.71,
    source: 'inferred',
    definition:
      'The recorded judgement on a claim, including the decision, the assessor and the reasoning. Described in policy but not yet present as a table.',
    definitionSource: 'Claims Handling Policy v3.pdf, p.31 — no matching table',
    sourceIcon: 'doc',
    evidence: [
      { id: 'e1', a: 'claim.decision', b: 'string', c: 'upheld', role: 'attribute' },
      { id: 'e2', a: 'claim.assessed_by', b: 'bigint', c: '1187', role: 'foreign key' },
      { id: 'e3', a: '—', b: '—', c: 'policy §7 describes 4 more fields', role: 'gap' },
    ],
    signals: [
      { id: 's1', text: 'Policy describes it as a first-class artefact', weight: 0.86 },
      { id: 's2', text: 'Only two of six described fields exist in the data', weight: 0.52 },
      { id: 's3', text: 'Could be folded into Claim as attributes instead', weight: 0.6 },
    ],
    relationIds: ['r8'],
  },
  {
    id: 'c11',
    name: 'ServiceChannel',
    confidence: 0.68,
    source: 'inferred',
    definition:
      'The medium an interaction takes place over. Proposed as a class so channels can carry their own service-level attributes.',
    definitionSource: 'Inferred from the interaction.channel enumeration',
    sourceIcon: 'node',
    evidence: [
      { id: 'e1', a: 'interaction.channel', b: 'string', c: 'voice, chat, email', role: 'enumeration' },
      { id: 'e2', a: '—', b: '—', c: '5 distinct values', role: 'cardinality' },
    ],
    signals: [
      { id: 's1', text: 'Low-cardinality enum, a classic lookup candidate', weight: 0.77 },
      { id: 's2', text: 'A code list may serve better than a class', weight: 0.48 },
      { id: 's3', text: 'ContactCentre v7 models this as a code list, not a class', weight: 0.41 },
    ],
    relationIds: [],
  },
  {
    id: 'c12',
    name: 'Tariff',
    confidence: 0.62,
    source: 'inferred',
    definition:
      'The pricing scheme applied to a contract. Named repeatedly in the glossary but not represented in any selected table.',
    definitionSource: 'Billing Domain Glossary.docx, §4 — no matching table',
    sourceIcon: 'doc',
    evidence: [
      { id: 'e1', a: 'contract.plan_code', b: 'string', c: 'RES-STD-24', role: 'weak identifier' },
      { id: 'e2', a: '—', b: '—', c: 'no tariff table in scope', role: 'gap' },
    ],
    signals: [
      { id: 's1', text: 'Glossary treats it as a core business term', weight: 0.84 },
      { id: 's2', text: 'Only a plan code exists in the selected sources', weight: 0.46 },
      { id: 's3', text: 'Would need a table outside this run to populate', weight: 0.38 },
    ],
    relationIds: ['r9'],
  },
  {
    id: 'c13',
    name: 'Household',
    confidence: 0.54,
    source: 'inferred',
    definition:
      'A group of customers at the same address. Proposed from address-string clustering, with no key or table to support it.',
    definitionSource: 'Inferred by clustering customer.address_line1',
    sourceIcon: 'node',
    evidence: [
      { id: 'e1', a: 'customer.address_line1', b: 'string', c: '14 Ashgrove Terrace', role: 'clustered' },
      { id: 'e2', a: '—', b: '—', c: '11% of clusters ambiguous', role: 'quality' },
    ],
    signals: [
      { id: 's1', text: 'Address clustering is fuzzy and unvalidated', weight: 0.34 },
      { id: 's2', text: 'No identifier exists to make instances stable', weight: 0.29 },
      { id: 's3', text: 'Not mentioned in any document', weight: 0.31 },
    ],
    relationIds: ['r11'],
  },
  {
    id: 'c14',
    name: 'ServiceAddress',
    confidence: 0.49,
    source: 'inferred',
    definition:
      'The premises a service is delivered to. Proposed from free-text address columns with no normalisation.',
    definitionSource: 'Inferred from unparsed address columns',
    sourceIcon: 'node',
    evidence: [
      { id: 'e1', a: 'customer.address_line1', b: 'string', c: '14 Ashgrove Terrace', role: 'unparsed' },
      { id: 'e2', a: 'customer.postcode', b: 'string', c: 'LS6 3QN', role: 'attribute' },
    ],
    signals: [
      { id: 's1', text: 'Address is free text with no reference data behind it', weight: 0.31 },
      { id: 's2', text: 'Billing and service addresses are not distinguished', weight: 0.26 },
      { id: 's3', text: 'No document defines the term', weight: 0.33 },
    ],
    relationIds: ['r10'],
  },
];

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
      { id: 'e1', a: 'contract.customer_id', b: 'bigint', c: '→ customer.customer_id', role: 'foreign key' },
      { id: 'e2', a: 'coverage', b: '100%', c: '611k of 611k rows resolve', role: 'complete' },
      { id: 'e3', a: 'fan-out', b: 'avg 1.27', c: 'max 41 contracts per customer', role: 'cardinality' },
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
      { id: 'e1', a: 'invoice.contract_id', b: 'bigint', c: '→ contract.contract_id', role: 'foreign key' },
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
      { id: 'e1', a: 'payment.invoice_id', b: 'bigint', c: '→ invoice.invoice_id', role: 'foreign key' },
      { id: 'e2', a: 'coverage', b: '96.1%', c: 'unpaid invoices have no rows', role: 'expected gap' },
      { id: 'e3', a: 'fan-out', b: 'avg 1.04', c: 'max 9 payments per invoice', role: 'cardinality' },
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
      { id: 'e1', a: 'claim.customer_id', b: 'bigint', c: '→ customer.customer_id', role: 'foreign key' },
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
    definition: 'Links a customer to every recorded touchpoint they were part of, across all channels.',
    definitionSource: 'Foreign key interaction.customer_id',
    sourceIcon: 'database',
    evidence: [
      { id: 'e1', a: 'interaction.customer_id', b: 'bigint', c: '→ customer.customer_id', role: 'foreign key' },
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
    definition: 'The staff member who took the interaction. Automated and self-service interactions have no agent.',
    definitionSource: 'Foreign key interaction.agent_id',
    sourceIcon: 'database',
    evidence: [
      { id: 'e1', a: 'interaction.agent_id', b: 'bigint', c: '→ agent.agent_id', role: 'foreign key' },
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
      { id: 'e1', a: 'call.interaction_id', b: 'bigint', c: '→ interaction.interaction_id', role: 'foreign key' },
      { id: 'e2', a: 'overlap', b: '100%', c: 'every call has an interaction', role: 'total' },
      { id: 'e3', a: 'extra columns', b: '4', c: 'duration, queue, outcome, recording', role: 'specialisation' },
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
      { id: 'e1', a: 'customer.address_line1', b: 'string', c: '14 Ashgrove Terrace', role: 'unparsed' },
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
  c1: DECISION.approved,
  c2: DECISION.approved,
  c3: DECISION.approved,
  c4: DECISION.approved,
  c13: DECISION.rejected,
  r1: DECISION.approved,
  r2: DECISION.approved,
};
