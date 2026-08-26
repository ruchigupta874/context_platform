export const CATALOG = 'prod_uc.cust360';
export const CURRENT_VERSION = 'v5';
export const LAST_BUILD_RUN = 'R-2413';

/**
 * `lastRun` null means this source has never been through an extraction.
 * `drift` non-null means it has changed since `lastRun` — that pair is what
 * makes the difference between "extract" and "re-extract" visible on screen.
 */
export const TABLES = [
  {
    id: 'customer',
    name: 'customer',
    cols: 14,
    rows: '482k',
    description: 'Master customer record, one row per billing account holder',
    lastRun: 'R-2413 · 24 Aug',
    drift: '+2 columns',
  },
  {
    id: 'contract',
    name: 'contract',
    cols: 10,
    rows: '611k',
    description: 'Signed service agreements with start and end dates',
    lastRun: 'R-2413 · 24 Aug',
    drift: null,
  },
  {
    id: 'invoice',
    name: 'invoice',
    cols: 11,
    rows: '7.2m',
    description: 'Monthly billing documents issued against a contract',
    lastRun: 'R-2413 · 24 Aug',
    drift: null,
  },
  {
    id: 'payment',
    name: 'payment',
    cols: 8,
    rows: '6.9m',
    description: 'Settlement events posted against invoices',
    lastRun: 'R-2413 · 24 Aug',
    drift: null,
  },
  {
    id: 'claim',
    name: 'claim',
    cols: 11,
    rows: '94k',
    description: '',
    lastRun: 'R-2413 · 24 Aug',
    drift: null,
  },
  {
    id: 'interaction',
    name: 'interaction',
    cols: 10,
    rows: '3.1m',
    description: 'Any customer touchpoint across channels',
    lastRun: 'R-2413 · 24 Aug',
    drift: null,
  },
  {
    id: 'call',
    name: 'call',
    cols: 9,
    rows: '1.8m',
    description: 'Voice interactions handled by the contact centre',
    lastRun: 'R-2413 · 24 Aug',
    drift: null,
  },
  {
    id: 'agent',
    name: 'agent',
    cols: 7,
    rows: '2.4k',
    description: '',
    lastRun: 'R-2413 · 24 Aug',
    drift: '+1 column',
  },
  {
    id: 'meter',
    name: 'meter',
    cols: 9,
    rows: '512k',
    description: 'Physical metering devices installed at a premises',
    lastRun: null,
    drift: null,
  },
  {
    id: 'meter_reading',
    name: 'meter_reading',
    cols: 8,
    rows: '84m',
    description: 'Interval consumption readings',
    lastRun: null,
    drift: null,
  },
];

export const DOCUMENTS = [
  {
    id: 'd1',
    name: 'Customer Data Dictionary 2026.pdf',
    kind: 'PDF',
    pages: 48,
    uploaded: '12 Aug',
    indexed: true,
    lastRun: 'R-2413 · 24 Aug',
    drift: null,
  },
  {
    id: 'd2',
    name: 'Billing Domain Glossary.docx',
    kind: 'DOCX',
    pages: 22,
    uploaded: '12 Aug',
    indexed: true,
    lastRun: 'R-2413 · 24 Aug',
    drift: null,
  },
  {
    id: 'd3',
    name: 'Claims Handling Policy v3.pdf',
    kind: 'PDF',
    pages: 67,
    uploaded: '19 Aug',
    indexed: true,
    lastRun: null,
    drift: null,
  },
  {
    id: 'd4',
    name: 'Metering Standards Extract.md',
    kind: 'MD',
    pages: 9,
    uploaded: '24 Aug',
    indexed: true,
    lastRun: null,
    drift: null,
  },
  {
    id: 'd5',
    name: 'Contact Centre Taxonomy.xlsx',
    kind: 'XLSX',
    pages: 4,
    uploaded: '26 Aug',
    indexed: false,
    lastRun: 'R-2413 · 24 Aug',
    drift: 're-uploaded',
  },
];

/** Which sources arrive pre-selected on the Sources screen. */
export const DEFAULT_TABLE_SELECTION = [
  'customer',
  'contract',
  'invoice',
  'payment',
  'claim',
  'interaction',
  'call',
  'agent',
];

export const DEFAULT_DOCUMENT_SELECTION = ['d1', 'd2'];

export const LAST_SYNCED = '14 min ago';
