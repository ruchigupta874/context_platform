import { TONE } from '@/config/constants/common';

/**
 * The two kinds of source, in the order they read. `unit` is the noun the
 * screen counts them in, so "10 tables" and "5 documents" come from the tab
 * rather than from a branch at every call site.
 */
export const SOURCE_TABS = [
  // Catalog sync is not wired yet, so the tab announces itself as unavailable
  // rather than opening a screen that cannot do anything.
  { id: 'tables', label: 'Catalog tables', icon: 'database', unit: 'table', disabled: true },
  { id: 'documents', label: 'Documents', icon: 'doc', unit: 'document' },
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
  // Wide enough for both row actions: a source that has been through a run
  // offers the run alongside the next extraction.
  { id: 'action', width: '248px' },
];

export const DOCUMENT_COLUMNS = [
  { id: 'name', label: 'Document', width: 'minmax(0, 1fr)' },
  { id: 'kind', label: 'Type', width: '66px' },
  { id: 'pages', label: 'Pages', width: '60px' },
  { id: 'uploaded', label: 'Uploaded', width: '116px' },
  { id: 'lastRun', label: 'Last extraction', width: '146px' },
  { id: 'state', label: 'Status', width: '158px' },
  // Wide enough for both row actions: a source that has been through a run
  // offers the run alongside the next extraction.
  { id: 'action', width: '248px' },
];

export const UPLOAD_HINT =
  'PDF, DOCX, MD, TXT, XLSX · up to 50 MB each · data dictionaries, policy docs, schema notes';

/** What a source is. Drives the row icon and which tab a source belongs to. */
export const SOURCE_KIND = {
  table: 'table',
  document: 'document',
};

/** Which source list the Sources page is showing. Mirrors SOURCE_TABS ids. */
export const SOURCE_TAB = {
  tables: 'tables',
  documents: 'documents',
};

/** Columns of one workspace's asset table inside the import dialog. */
export const ASSET_COLUMNS = [
  { id: 'select', label: '', width: '32px' },
  { id: 'name', label: 'Asset', width: 'minmax(0, 1fr)' },
  { id: 'kind', label: 'Type', width: '62px' },
  { id: 'pages', label: 'Pages', width: '56px' },
  { id: 'updated', label: 'Updated', width: '84px' },
  { id: 'state', label: '', width: '78px' },
];

export const IMPORT_COPY = {
  action: 'Import assets',
  title: 'Import assets',
  blurb: 'Pick assets from any workspace. They arrive here as documents, ready to extract.',
  empty: 'No workspace has an asset library yet.',
  done: 'Import',
  cancel: 'Cancel',
  imported: 'Imported',
  search: 'Filter assets',
  selected: 'Selected',
  clear: 'Clear',
  railEmpty:
    'Nothing picked yet. Your selection follows you between workspaces, so you can gather assets from several and import them in one go.',
  noMatch: 'No assets match that filter.',
  hint: 'Bring documents in from another workspace.',
};
