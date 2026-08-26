import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import { PageBody } from '../../components/layout/AppShell';
import PageHeader from '../../components/layout/PageHeader';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import Chip from '../../components/ui/Chip';
import Checkbox from '../../components/ui/Checkbox';
import SearchInput from '../../components/ui/SearchInput';
import { Banner } from '../../components/ui/Surfaces';
import {
  DataTable,
  DataTableBody,
  DataTableFooter,
  DataTableHead,
  DataTableRow,
} from '../../components/ui/DataTable';
import { DOCUMENT_COLUMNS, SOURCE_TABS, TABLE_COLUMNS, UPLOAD_HINT } from '../../config/constants/sources';
import {
  CATALOG,
  CURRENT_VERSION,
  DEFAULT_DOCUMENT_SELECTION,
  DEFAULT_TABLE_SELECTION,
  DOCUMENTS,
  LAST_SYNCED,
  TABLES,
} from '../../mocks/sources';
import { useSelection } from '../../hooks/useSelection';
import { useWorkspace } from '../../hooks/useWorkspace';
import { buildPath } from '../../routes/paths';
import { pluralize } from '../../utils/format';
import { sourceState, useSourceInsights } from './useSourceSelection';
import styles from './Sources.module.css';

export default function Sources() {
  const navigate = useNavigate();
  const { workspaceId } = useWorkspace();
  const [tab, setTab] = useState('tables');
  const [query, setQuery] = useState('');

  const tableSelection = useSelection(DEFAULT_TABLE_SELECTION);
  const docSelection = useSelection(DEFAULT_DOCUMENT_SELECTION);

  const visibleTables = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? TABLES.filter((table) => table.name.includes(needle)) : TABLES;
  }, [query]);

  const tableInsights = useSourceInsights(TABLES, tableSelection.selectedIds);
  const docInsights = useSourceInsights(DOCUMENTS, docSelection.selectedIds);

  const selectedColumns = tableInsights.selected.reduce((total, table) => total + table.cols, 0);
  const visibleTableIds = visibleTables.map((table) => table.id);
  const allVisibleSelected = tableSelection.allSelected(visibleTableIds);

  const goToNewRun = () => navigate(buildPath.newRun(workspaceId));

  return (
    <>
      <TopBar
        crumbs={[{ label: 'Cust360Auto' }, { label: 'Data sources' }]}
        actions={
          <Button variant="primary" iconLeft="plus" onClick={goToNewRun}>
            New extraction
          </Button>
        }
      />

      <PageBody>
        <PageHeader
          title="Data sources"
          subtitle="Everything an extraction can read from. Tables bring structure; documents bring the language your business actually uses."
          actions={
            <Button variant="secondary" iconLeft="refresh">
              Sync from catalog
            </Button>
          }
        />

        <div className={styles.tabs} role="tablist">
          {SOURCE_TABS.map((sourceTab) => {
            const active = tab === sourceTab.id;
            const count = sourceTab.id === 'tables' ? TABLES.length : DOCUMENTS.length;
            return (
              <button
                key={sourceTab.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={[styles.tab, active ? styles.tabActive : ''].filter(Boolean).join(' ')}
                onClick={() => setTab(sourceTab.id)}
              >
                {sourceTab.label}
                <span className={styles.tabCount}>{count}</span>
              </button>
            );
          })}
        </div>

        {tab === 'tables' ? (
          <div className={styles.panel}>
            <div className={styles.controls}>
              <div className={styles.catalogPicker}>
                <Icon name="database" size={14} style={{ color: 'var(--text-3)' }} />
                {CATALOG}
                <Icon name="chevronDown" size={13} style={{ color: 'var(--text-5)' }} />
              </div>
              <SearchInput value={query} onChange={setQuery} placeholder="Filter tables" width={200} />
              <div className={styles.spacer} />
              <span className={styles.syncNote}>Last synced {LAST_SYNCED}</span>
            </div>

            {tableInsights.drifted.length > 0 && (
              <Banner
                tone="warn"
                title={`${tableInsights.drifted.length} sources have changed since ${CURRENT_VERSION} was built`}
                note={`${tableInsights.driftSummary}. Your approved concepts are kept — a re-extraction only asks you about what changed.`}
                actions={
                  <>
                    <Button variant="warnOutline" size="sm">
                      Review changes
                    </Button>
                    <Button
                      variant="warn"
                      size="sm"
                      iconLeft="refresh"
                      onClick={() => tableSelection.replace(tableInsights.drifted.map((t) => t.id))}
                    >
                      Re-extract changed
                    </Button>
                  </>
                }
              />
            )}

            <DataTable>
              <DataTableHead
                columns={TABLE_COLUMNS}
                leading={
                  <Checkbox
                    checked={allVisibleSelected}
                    onChange={(next) => tableSelection.toggleMany(visibleTableIds, next)}
                    label="Select all tables"
                  />
                }
              />
              <DataTableBody>
                {visibleTables.map((table) => {
                  const state = sourceState(table);
                  const selected = tableSelection.isSelected(table.id);
                  return (
                    <DataTableRow
                      key={table.id}
                      columns={TABLE_COLUMNS}
                      selected={selected}
                      flagged={Boolean(table.drift)}
                      onClick={() => tableSelection.toggle(table.id)}
                    >
                      <Checkbox
                        checked={selected}
                        onChange={() => tableSelection.toggle(table.id)}
                        label={`Select ${table.name}`}
                      />
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
                      <div>
                        <Chip tone={state.tone}>{state.label}</Chip>
                      </div>
                    </DataTableRow>
                  );
                })}
              </DataTableBody>

              <DataTableFooter tall>
                <div className={styles.footerBody}>
                  <div className={styles.footerCount}>
                    <span className={styles.footerCountStrong}>{tableSelection.count}</span> of {TABLES.length}{' '}
                    tables selected
                    <span className={styles.footerCols}>{selectedColumns} columns</span>
                  </div>
                  <div className={styles.footerBreakdown}>{tableInsights.breakdown}</div>
                </div>
                <div className={styles.spacer} />
                <Button variant="secondary">Edit descriptions</Button>
                <Button variant="secondary" iconLeft="refresh" disabled={!tableInsights.canUpdate}>
                  Update {CURRENT_VERSION}
                </Button>
                <Button
                  variant="primary"
                  iconRight="arrowRight"
                  disabled={tableSelection.count === 0}
                  onClick={goToNewRun}
                >
                  New extraction
                </Button>
              </DataTableFooter>
            </DataTable>
          </div>
        ) : (
          <div className={styles.panel}>
            <button type="button" className={styles.dropzone}>
              <span className={styles.dropIcon}>
                <Icon name="upload" size={19} />
              </span>
              <span className={styles.dropTitle}>Drop files here, or browse</span>
              <span className={styles.dropHint}>{UPLOAD_HINT}</span>
            </button>

            <DataTable>
              <DataTableHead columns={DOCUMENT_COLUMNS} leading={<span />} />
              <DataTableBody>
                {DOCUMENTS.map((doc) => {
                  const state = doc.indexed
                    ? sourceState(doc)
                    : { label: 'Indexing', tone: 'info' };
                  const selected = docSelection.isSelected(doc.id);
                  return (
                    <DataTableRow
                      key={doc.id}
                      columns={DOCUMENT_COLUMNS}
                      selected={selected}
                      flagged={Boolean(doc.drift)}
                      onClick={() => docSelection.toggle(doc.id)}
                    >
                      <Checkbox
                        checked={selected}
                        onChange={() => docSelection.toggle(doc.id)}
                        label={`Select ${doc.name}`}
                      />
                      <div className={styles.docName}>
                        <Icon name="doc" size={15} style={{ color: 'var(--text-4)' }} />
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
                      <div>
                        <Chip tone={state.tone}>{state.label}</Chip>
                      </div>
                    </DataTableRow>
                  );
                })}
              </DataTableBody>

              <DataTableFooter tall>
                <div className={styles.footerBody}>
                  <div className={styles.footerCount}>
                    <span className={styles.footerCountStrong}>{docSelection.count}</span> of{' '}
                    {pluralize(DOCUMENTS.length, 'document')} selected
                  </div>
                  <div className={styles.footerBreakdown}>{docInsights.breakdown}</div>
                </div>
                <div className={styles.spacer} />
                <Button variant="secondary" iconLeft="refresh" disabled={!docInsights.canUpdate}>
                  Update {CURRENT_VERSION}
                </Button>
                <Button
                  variant="primary"
                  iconRight="arrowRight"
                  disabled={docSelection.count === 0}
                  onClick={goToNewRun}
                >
                  New extraction
                </Button>
              </DataTableFooter>
            </DataTable>
          </div>
        )}
      </PageBody>
    </>
  );
}
