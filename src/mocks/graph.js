/**
 * A depth-2 neighbourhood around one customer. Positions are pre-computed on a
 * radial layout so the picture is stable and readable — a force simulation would
 * reshuffle on every render and make the screen impossible to reason about.
 */

export const ROOT_ENTITY = 'n0';

export const GRAPH_NODES = [
  { id: 'n0', label: 'Jacob Martin', type: 'Customer', x: 340, y: 300, r: 21, root: true },

  { id: 'h1', label: 'CTR-77104223', type: 'Contract', x: 238, y: 241, r: 14, parent: 'n0', predicate: 'holds' },
  { id: 'h2', label: 'CTR-77104881', type: 'Contract', x: 238, y: 359, r: 14, parent: 'n0', predicate: 'holds' },
  { id: 'h3', label: 'BA-77120', type: 'BillingAccount', x: 340, y: 418, r: 14, parent: 'n0', predicate: 'billedUnder' },
  { id: 'h4', label: 'CLM-30119', type: 'Claim', x: 442, y: 359, r: 14, parent: 'n0', predicate: 'files' },
  { id: 'h5', label: 'INT-88240113', type: 'Interaction', x: 442, y: 241, r: 14, parent: 'n0', predicate: 'participatesIn' },
  { id: 'h6', label: 'INT-88245567', type: 'Interaction', x: 340, y: 182, r: 14, parent: 'n0', predicate: 'participatesIn' },

  { id: 'a1', label: 'INV-9102338', type: 'Invoice', x: 202, y: 123, r: 9, parent: 'h1', predicate: 'generates' },
  { id: 'a2', label: 'INV-9102412', type: 'Invoice', x: 145, y: 188, r: 9, parent: 'h1', predicate: 'generates' },
  { id: 'a3', label: 'INV-9102590', type: 'Invoice', x: 117, y: 269, r: 9, parent: 'h1', predicate: 'generates' },

  { id: 'b1', label: 'INV-9103771', type: 'Invoice', x: 117, y: 331, r: 9, parent: 'h2', predicate: 'generates' },
  { id: 'b2', label: 'INV-9103824', type: 'Invoice', x: 145, y: 413, r: 9, parent: 'h2', predicate: 'generates' },
  { id: 'b3', label: 'PAY-5512443', type: 'Payment', x: 202, y: 477, r: 9, parent: 'h2', predicate: 'settledBy', inferred: true },

  { id: 'c1', label: 'PAY-5512009', type: 'Payment', x: 256, y: 509, r: 9, parent: 'h3', predicate: 'covers' },
  { id: 'c2', label: 'CTR-77105110', type: 'Contract', x: 340, y: 525, r: 9, parent: 'h3', predicate: 'covers' },
  { id: 'c3', label: 'Priya Raman', type: 'Customer', x: 424, y: 509, r: 9, parent: 'h3', predicate: 'billedUnder', inferred: true },

  { id: 'd1', label: 'AGT-1187', type: 'Agent', x: 479, y: 477, r: 9, parent: 'h4', predicate: 'assessedBy' },
  { id: 'd2', label: 'INT-88231004', type: 'Interaction', x: 535, y: 413, r: 9, parent: 'h4', predicate: 'precededBy', inferred: true },
  { id: 'd3', label: 'INT-88231702', type: 'Interaction', x: 563, y: 331, r: 9, parent: 'h4', predicate: 'precededBy', inferred: true },

  { id: 'e1', label: 'CALL-0000170', type: 'Interaction', x: 563, y: 269, r: 9, parent: 'h5', predicate: 'recordedAs' },
  { id: 'e2', label: 'AGT-1342', type: 'Agent', x: 535, y: 188, r: 9, parent: 'h5', predicate: 'handledBy' },
  { id: 'e3', label: 'CALL-0000221', type: 'Interaction', x: 479, y: 123, r: 9, parent: 'h5', predicate: 'recordedAs' },

  { id: 'f1', label: 'CALL-0000402', type: 'Interaction', x: 424, y: 91, r: 9, parent: 'h6', predicate: 'recordedAs' },
  { id: 'f2', label: 'AGT-1503', type: 'Agent', x: 340, y: 75, r: 9, parent: 'h6', predicate: 'handledBy' },
  { id: 'f3', label: 'CALL-0000318', type: 'Interaction', x: 256, y: 91, r: 9, parent: 'h6', predicate: 'recordedAs' },
];

/** Edges are derived from parent links — one source of truth for the topology. */
export const GRAPH_EDGES = GRAPH_NODES.filter((n) => n.parent).map((n) => ({
  id: `${n.parent}->${n.id}`,
  from: n.parent,
  to: n.id,
  predicate: n.predicate,
  inferred: Boolean(n.inferred),
  primary: n.parent === ROOT_ENTITY,
}));

export const ENTITY_COUNTS = {
  Customer: '482k',
  Contract: '611k',
  Invoice: '7.2m',
  Payment: '6.9m',
  Claim: '94k',
  Interaction: '3.1m',
  Agent: '2.4k',
  BillingAccount: '38k',
};

export const GRAPH_TOTALS = { nodes: '12,438', edges: '31,204' };

/** Rich inspector payloads for the nodes worth clicking first. */
export const ENTITY_DETAILS = {
  n0: {
    properties: [
      { id: 'p1', key: 'ex:customerId', value: '4821993' },
      { id: 'p2', key: 'ex:fullName', value: 'Jacob Martin' },
      { id: 'p3', key: 'ex:segment', value: 'residential' },
      { id: 'p4', key: 'ex:createdAt', value: '2019-03-11' },
    ],
    sourceRow: 'customer#4821993',
    mapping: '#CustomerMap',
  },
  h1: {
    properties: [
      { id: 'p1', key: 'ex:contractId', value: '77104223' },
      { id: 'p2', key: 'ex:startDate', value: '2019-04-01' },
      { id: 'p3', key: 'ex:status', value: 'active' },
      { id: 'p4', key: 'ex:planCode', value: 'RES-STD-24' },
    ],
    sourceRow: 'contract#77104223',
    mapping: '#ContractMap',
  },
  h4: {
    properties: [
      { id: 'p1', key: 'ex:claimId', value: '30119' },
      { id: 'p2', key: 'ex:claimType', value: 'billing_dispute' },
      { id: 'p3', key: 'ex:filedOn', value: '2026-06-14' },
      { id: 'p4', key: 'ex:resolvedAt', value: 'null' },
    ],
    sourceRow: 'claim#30119',
    mapping: '#ClaimMap',
  },
};

export const BUILT_BY_RUN = 'R-2413';
