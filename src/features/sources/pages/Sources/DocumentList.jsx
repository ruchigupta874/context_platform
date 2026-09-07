import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import {
  DataTable,
  DataTableBody,
  DataTableFooter,
  DataTableHead,
  DataTableRow,
} from '@/components/ui/DataTable';
import { DOCUMENT_COLUMNS, UPLOAD_HINT } from '@/features/sources/constants';
import { pluralize } from '@/utils/format';
import { ActionCell, StatusCell } from './SourceCells';
import styles from './Sources.module.css';

/** Uploaded documents: the sources that arrive by hand rather than from a catalog. */
export default function DocumentList({ documents, triggered, onTrigger }) {
  return (
    <>
      <div className={styles.panelBody}>
        <button type="button" className={styles.dropzone}>
          <span className={styles.dropIcon}>
            <Icon name="upload" size={19} />
          </span>
          <span className={styles.dropTitle}>Drop files here, or browse</span>
          <span className={styles.dropHint}>{UPLOAD_HINT}</span>
        </button>
      </div>

      <DataTable className={styles.flushTable}>
        <DataTableHead columns={DOCUMENT_COLUMNS} />
        <DataTableBody>
          {documents.map((doc) => (
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
              <ActionCell source={doc} triggered={triggered} onTrigger={onTrigger} />
            </DataTableRow>
          ))}
        </DataTableBody>

        <DataTableFooter>
          <div className={styles.footerCount}>{pluralize(documents.length, 'document')}</div>
        </DataTableFooter>
      </DataTable>
    </>
  );
}

DocumentList.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      kind: PropTypes.string.isRequired,
      pages: PropTypes.number.isRequired,
      uploaded: PropTypes.string.isRequired,
      lastRun: PropTypes.string,
      drift: PropTypes.string,
    }),
  ).isRequired,
  triggered: PropTypes.instanceOf(Set).isRequired,
  onTrigger: PropTypes.func.isRequired,
};
