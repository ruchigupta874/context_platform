import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import SearchInput from '@/components/ui/SearchInput';
import { Banner } from '@/components/ui/Surfaces';
import {
  DataTable,
  DataTableBody,
  DataTableFooter,
  DataTableHead,
  DataTableRow,
} from '@/components/ui/DataTable';
import { TABLE_COLUMNS } from '@/features/sources/constants';
import { CATALOG, CURRENT_VERSION, LAST_SYNCED } from '@/features/sources/mocks';
import { pluralize } from '@/utils/format';
import { ActionCell, StatusCell } from './SourceCells';
import styles from './Sources.module.css';

/** Catalog tables: the sources the workspace is connected to rather than given. */
export default function TableList({ tables, triggered, onTrigger }) {
  const [query, setQuery] = useState('');

  // Derived, not stored: the filter is a pure function of the query.
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? tables.filter((table) => table.name.includes(needle)) : tables;
  }, [query, tables]);

  const drifted = useMemo(() => tables.filter((table) => table.drift), [tables]);

  return (
    <>
      <div className={styles.panelBody}>
        <div className={styles.controls}>
          <div className={styles.catalogPicker}>
            <Icon name="database" size={14} className={styles.pickerIcon} />
            {CATALOG}
            <Icon name="chevronDown" size={13} className={styles.mutedIcon} />
          </div>
          <SearchInput value={query} onChange={setQuery} placeholder="Filter tables" width={200} />
          <div className={styles.spacer} />
          <span className={styles.syncNote}>Last synced {LAST_SYNCED}</span>
        </div>

        {drifted.length > 0 && (
          <Banner
            tone="warn"
            title={`${drifted.length} sources have changed since ${CURRENT_VERSION} was built`}
            note={`${drifted.map((table) => `${table.name} ${table.drift}`).join(', ')}. Re-extract them one at a time from the row.`}
          />
        )}
      </div>

      <DataTable className={styles.flushTable}>
        <DataTableHead columns={TABLE_COLUMNS} />
        <DataTableBody>
          {visible.map((table) => (
            <DataTableRow
              key={table.id}
              columns={TABLE_COLUMNS}
              flagged={Boolean(table.drift)}
              className={styles.sourceRow}
            >
              <div className={styles.tableName}>{table.name}</div>
              <div className={styles.num}>{table.cols}</div>
              <div className={styles.num}>{table.rows}</div>
              <div
                className={[styles.description, table.description ? '' : styles.descriptionEmpty]
                  .filter(Boolean)
                  .join(' ')}
              >
                {table.description || 'No description in catalog'}
              </div>
              <div
                className={[styles.lastRun, table.lastRun ? '' : styles.lastRunNever]
                  .filter(Boolean)
                  .join(' ')}
              >
                {table.lastRun ?? 'never'}
              </div>
              <StatusCell source={table} triggered={triggered} />
              <ActionCell source={table} triggered={triggered} onTrigger={onTrigger} />
            </DataTableRow>
          ))}
        </DataTableBody>

        <DataTableFooter>
          <div className={styles.footerCount}>
            Showing {visible.length} of {pluralize(tables.length, 'table')}
          </div>
          <div className={styles.spacer} />
          <div className={styles.footerBreakdown}>
            {drifted.length} changed since {CURRENT_VERSION}
          </div>
        </DataTableFooter>
      </DataTable>
    </>
  );
}

TableList.propTypes = {
  tables: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      cols: PropTypes.number.isRequired,
      rows: PropTypes.string.isRequired,
      description: PropTypes.string,
      lastRun: PropTypes.string,
      drift: PropTypes.string,
    }),
  ).isRequired,
  triggered: PropTypes.instanceOf(Set).isRequired,
  onTrigger: PropTypes.func.isRequired,
};
