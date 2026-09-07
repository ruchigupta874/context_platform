/**
 * Public surface of the sources feature.
 *
 * Pages are deliberately absent: only the router renders them, it imports them
 * by path, and exporting them here would make every feature barrel pull in every
 * other feature's pages and close an import cycle.
 */
export * from './constants';
export { sourceStatus, canExtract, extractLabel, sourceCounts, sourceStats } from './sourceStatus';
export {
  TABLES,
  DOCUMENTS,
  CATALOG,
  CURRENT_VERSION,
  LAST_SYNCED,
  DEFAULT_TABLE_SELECTION,
  DEFAULT_DOCUMENT_SELECTION,
} from './mocks';
