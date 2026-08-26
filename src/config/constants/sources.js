import { TONE } from './common';

export const SOURCE_TABS = [
  { id: 'tables', label: 'Catalog tables' },
  { id: 'documents', label: 'Documents' },
];

/**
 * Extraction state of a single source. This is what makes re-extraction possible:
 * without it the screen cannot tell you whether a source is already in the ontology.
 */
export const SOURCE_STATE = {
  upToDate: { id: 'up-to-date', label: 'Up to date', tone: TONE.ok },
  drifted: { id: 'drifted', tone: TONE.warn }, // label comes from the drift itself, e.g. "+2 columns"
  never: { id: 'never', label: 'Not extracted', tone: TONE.neutral },
  indexing: { id: 'indexing', label: 'Indexing', tone: TONE.info },
};

export const TABLE_COLUMNS = [
  { id: 'select', width: '36px' },
  { id: 'name', label: 'Table', width: '196px' },
  { id: 'cols', label: 'Cols', width: '62px' },
  { id: 'rows', label: 'Rows', width: '74px' },
  { id: 'description', label: 'Description', width: 'minmax(0, 1fr)' },
  { id: 'lastRun', label: 'Last extraction', width: '146px' },
  { id: 'state', label: 'Status', width: '132px' },
];

export const DOCUMENT_COLUMNS = [
  { id: 'select', width: '36px' },
  { id: 'name', label: 'Document', width: 'minmax(0, 1fr)' },
  { id: 'kind', label: 'Type', width: '66px' },
  { id: 'pages', label: 'Pages', width: '60px' },
  { id: 'uploaded', label: 'Uploaded', width: '116px' },
  { id: 'lastRun', label: 'Last extraction', width: '146px' },
  { id: 'state', label: 'Status', width: '132px' },
];

export const UPLOAD_HINT =
  'PDF, DOCX, MD, TXT, XLSX · up to 50 MB each · data dictionaries, policy docs, schema notes';
