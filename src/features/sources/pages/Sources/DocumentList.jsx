import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import {
  DataTable,
  DataTableBody,
  DataTableFooter,
  DataTableHead,
  DataTableRow,
} from '@/components/ui/DataTable';
import { DOCUMENT_COLUMNS, IMPORT_COPY } from '@/features/sources/constants';
import { pluralize } from '@/utils/format';
import { ActionCell, StatusCell } from './SourceCells';
import DocumentRowSkeleton from './DocumentRowSkeleton';
import styles from './Sources.module.css';

/** How many rows hold space while the list is in flight. */
const SKELETON_IDS = ['s1', 's2', 's3', 's4', 's5'];

/** Uploaded documents: the sources that arrive by hand rather than from a catalog. */
export default function DocumentList({
  documents,
  triggered,
  onTrigger,
  onOpenRun,
  onImport,
  isLoading,
}) {
  return (
    <>
      <div className={styles.panelBody}>
        <div className={styles.docToolbar}>
          <Button variant="secondary" iconLeft="download" onClick={onImport} disabled={isLoading}>
            {IMPORT_COPY.action}
          </Button>
          <span className={styles.toolbarHint}>{IMPORT_COPY.hint}</span>
          {isLoading && (
            <span role="status" className={styles.srOnly}>
              Loading documents
            </span>
          )}
        </div>

        {/*
         * Upload is parked, not gone: there is nowhere to put a file until the
         * API can take one, and a drop target that silently does nothing is
         * worse than no drop target. Restore this block — and the UPLOAD_HINT
         * import — when uploads are wired.
         *
         * <button type="button" className={styles.dropzone}>
         *   <span className={styles.dropIcon}>
         *     <Icon name="upload" size={19} />
         *   </span>
         *   <span className={styles.dropTitle}>Drop files here, or browse</span>
         *   <span className={styles.dropHint}>{UPLOAD_HINT}</span>
         * </button>
         */}
      </div>

      <DataTable className={styles.flushTable}>
        <DataTableHead columns={DOCUMENT_COLUMNS} />
        <DataTableBody>
          {isLoading
            ? SKELETON_IDS.map((id) => <DocumentRowSkeleton key={id} />)
            : documents.map((doc) => (
                <DataTableRow
                  key={doc.id}
                  columns={DOCUMENT_COLUMNS}
                  flagged={Boolean(doc.drift)}
                  className={styles.sourceRow}
                >
                  <div className={styles.docName}>
                    <Icon name="doc" size={15} className={styles.docIcon} />
                    <span className={styles.docNameText}>{doc.name}</span>
                  </div>
                  <div className={styles.num}>{doc.kind}</div>
                  <div className={styles.num}>{doc.pages}</div>
                  <div className={styles.description}>{doc.uploaded}</div>
                  <div
                    className={[styles.lastRun, doc.lastRun ? '' : styles.lastRunNever]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {doc.lastRun ?? 'never'}
                  </div>
                  <StatusCell source={doc} triggered={triggered} />
                  <ActionCell
                    source={doc}
                    triggered={triggered}
                    onTrigger={onTrigger}
                    onOpenRun={onOpenRun}
                  />
                </DataTableRow>
              ))}
        </DataTableBody>

        <DataTableFooter>
          <div className={styles.footerCount}>
            {isLoading ? (
              <Skeleton width={76} height={10} />
            ) : (
              pluralize(documents.length, 'document')
            )}
          </div>
        </DataTableFooter>
      </DataTable>
    </>
  );
}

DocumentList.propTypes = {
  onImport: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      kind: PropTypes.string.isRequired,
      pages: PropTypes.number.isRequired,
      uploaded: PropTypes.string.isRequired,
      lastRun: PropTypes.string,
      lastRunId: PropTypes.string,
      drift: PropTypes.string,
    }),
  ).isRequired,
  triggered: PropTypes.instanceOf(Set).isRequired,
  onTrigger: PropTypes.func.isRequired,
  onOpenRun: PropTypes.func.isRequired,
};
