import { TONE } from './common';

export const SOURCE_TABS = [
  { id: 'tables', label: 'Catalog tables' },
  { id: 'documents', label: 'Documents' },
];

/**
 * Extraction state of a single source, in the order the Status column resolves
 * them. `triggered` outranks the rest: once a run is on its way, whatever the
 * previous result was is no longer the interesting fact about this source.
 */
export const SOURCE_STATE = {
  triggered: { id: 'triggered', label: 'Extraction triggered', tone: TONE.info },
  indexing: { id: 'indexing', label: 'Indexing', tone: TONE.info },
  never: { id: 'never', label: 'Not extracted', tone: TONE.neutral },
  drifted: { id: 'drifted', tone: TONE.warn }, // label comes from the drift itself, e.g. "+2 columns"
  extracted: { id: 'extracted', label: 'Extracted', tone: TONE.ok },
};

export const TABLE_COLUMNS = [
  { id: 'name', label: 'Table', width: '188px' },
  { id: 'cols', label: 'Cols', width: '62px' },
  { id: 'rows', label: 'Rows', width: '74px' },
  { id: 'description', label: 'Description', width: 'minmax(0, 1fr)' },
  { id: 'lastRun', label: 'Last extraction', width: '146px' },
  { id: 'state', label: 'Status', width: '158px' },
  { id: 'action', width: '136px' },
];

export const DOCUMENT_COLUMNS = [
  { id: 'name', label: 'Document', width: 'minmax(0, 1fr)' },
  { id: 'kind', label: 'Type', width: '66px' },
  { id: 'pages', label: 'Pages', width: '60px' },
  { id: 'uploaded', label: 'Uploaded', width: '116px' },
  { id: 'lastRun', label: 'Last extraction', width: '146px' },
  { id: 'state', label: 'Status', width: '158px' },
  { id: 'action', width: '136px' },
];

export const UPLOAD_HINT =
  'PDF, DOCX, MD, TXT, XLSX · up to 50 MB each · data dictionaries, policy docs, schema notes';

/** What a source is. Drives the row icon and which tab a source belongs to. */
export const SOURCE_KIND = {
  table: 'table',
  document: 'document',
};
