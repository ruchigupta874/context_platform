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
    activeRun: 'R-2417',
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

/**
 * The asset library each workspace keeps, keyed by workspace id.
 *
 * Assets are files a workspace already holds; importing one copies it into
 * this workspace's documents, where it becomes an ordinary source. A workspace
 * with no library simply has no entry here.
 */
export const WORKSPACE_ASSETS = {
  cms: [
    {
      id: 'cms-a1',
      name: 'Formulary Tier Definitions 2026.pdf',
      kind: 'PDF',
      pages: 31,
      updated: '02 Sep',
    },
    {
      id: 'cms-a2',
      name: 'Prior Authorization Criteria.docx',
      kind: 'DOCX',
      pages: 18,
      updated: '28 Aug',
    },
    {
      id: 'cms-a3',
      name: 'Drug Utilization Review Policy.pdf',
      kind: 'PDF',
      pages: 54,
      updated: '21 Aug',
    },
    { id: 'cms-a4', name: 'Member Eligibility Notes.md', kind: 'MD', pages: 7, updated: '19 Aug' },
    {
      id: 'cms-a5',
      name: 'Step Therapy Protocols 2026.pdf',
      kind: 'PDF',
      pages: 42,
      updated: '18 Aug',
    },
    {
      id: 'cms-a6',
      name: 'Medicaid Rebate Agreement Summary.docx',
      kind: 'DOCX',
      pages: 26,
      updated: '15 Aug',
    },
    {
      id: 'cms-a7',
      name: 'Specialty Pharmacy Network List.xlsx',
      kind: 'XLSX',
      pages: 9,
      updated: '14 Aug',
    },
    {
      id: 'cms-a8',
      name: 'Appeals and Grievances Handbook.pdf',
      kind: 'PDF',
      pages: 88,
      updated: '12 Aug',
    },
    { id: 'cms-a9', name: 'Quantity Limit Schedule.csv', kind: 'CSV', pages: 4, updated: '11 Aug' },
    {
      id: 'cms-a10',
      name: 'Coverage Determination Letters.docx',
      kind: 'DOCX',
      pages: 33,
      updated: '08 Aug',
    },
    {
      id: 'cms-a11',
      name: 'Encounter Data Dictionary.md',
      kind: 'MD',
      pages: 21,
      updated: '06 Aug',
    },
    {
      id: 'cms-a12',
      name: 'Dual Eligible Enrollment Rules.pdf',
      kind: 'PDF',
      pages: 47,
      updated: '04 Aug',
    },
    {
      id: 'cms-a13',
      name: 'Pharmacy Benefit Manager Contract.pdf',
      kind: 'PDF',
      pages: 112,
      updated: '01 Aug',
    },
    {
      id: 'cms-a14',
      name: 'Claims Adjudication Edits.xlsx',
      kind: 'XLSX',
      pages: 15,
      updated: '29 Jul',
    },
    {
      id: 'cms-a15',
      name: 'Provider Directory Standards.docx',
      kind: 'DOCX',
      pages: 24,
      updated: '26 Jul',
    },
    {
      id: 'cms-a16',
      name: 'Care Management Referral Flow.md',
      kind: 'MD',
      pages: 11,
      updated: '22 Jul',
    },
  ],
  emr: [
    {
      id: 'emr-a1',
      name: 'Active Ingredient Registry.xlsx',
      kind: 'XLSX',
      pages: 12,
      updated: '01 Sep',
    },
    {
      id: 'emr-a2',
      name: 'Mechanism of Action Glossary.pdf',
      kind: 'PDF',
      pages: 44,
      updated: '26 Aug',
    },
    {
      id: 'emr-a3',
      name: 'Therapeutic Class Hierarchy.csv',
      kind: 'CSV',
      pages: 3,
      updated: '24 Aug',
    },
    {
      id: 'emr-a4',
      name: 'Excipient Reference Tables.xlsx',
      kind: 'XLSX',
      pages: 18,
      updated: '20 Aug',
    },
    {
      id: 'emr-a5',
      name: 'Clinical Trial Phase Definitions.pdf',
      kind: 'PDF',
      pages: 29,
      updated: '17 Aug',
    },
    {
      id: 'emr-a6',
      name: 'Adverse Event Coding Guide.docx',
      kind: 'DOCX',
      pages: 36,
      updated: '13 Aug',
    },
    {
      id: 'emr-a7',
      name: 'Route of Administration Codes.csv',
      kind: 'CSV',
      pages: 2,
      updated: '09 Aug',
    },
    {
      id: 'emr-a8',
      name: 'Biosimilar Naming Conventions.pdf',
      kind: 'PDF',
      pages: 22,
      updated: '05 Aug',
    },
    {
      id: 'emr-a9',
      name: 'Manufacturing Site Registry.xlsx',
      kind: 'XLSX',
      pages: 7,
      updated: '31 Jul',
    },
    { id: 'emr-a10', name: 'Pharmacovigilance SOP.pdf', kind: 'PDF', pages: 64, updated: '27 Jul' },
  ],
};
