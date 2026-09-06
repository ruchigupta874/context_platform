/**
 * Entity type -> colour. Read from CSS custom properties so the palette has one
 * home (tokens.css) even though SVG needs literal values at paint time.
 */
export const ENTITY_TYPES = [
  { id: 'Customer', cssVar: '--entity-customer' },
  { id: 'Contract', cssVar: '--entity-contract' },
  { id: 'Invoice', cssVar: '--entity-invoice' },
  { id: 'Payment', cssVar: '--entity-payment' },
  { id: 'Claim', cssVar: '--entity-claim' },
  { id: 'Interaction', cssVar: '--entity-interaction' },
  { id: 'Agent', cssVar: '--entity-agent' },
  { id: 'BillingAccount', cssVar: '--entity-billing-account' },
];

/** Fallbacks used when the SVG paints before custom properties resolve. */
export const ENTITY_COLORS = {
  Customer: '#5b54c4',
  Contract: '#2073ae',
  Invoice: '#0e7c74',
  Payment: '#3c7a2e',
  Claim: '#ae4763',
  Interaction: '#97671a',
  Agent: '#8a4fa8',
  BillingAccount: '#4a6076',
};

export const DEPTH_OPTIONS = [1, 2, 3, 4];
export const DEFAULT_DEPTH = 2;

export const GRAPH_VIEWBOX = '60 40 560 520';

export const EDGE_LEGEND = [
  { id: 'asserted', label: 'asserted', dashed: false },
  { id: 'inferred', label: 'inferred', dashed: true },
];
