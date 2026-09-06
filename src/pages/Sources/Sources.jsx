import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import { PageBody } from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import SearchInput from '@/components/ui/SearchInput';
import { Banner } from '@/components/ui/Surfaces';
import {
  DataTable,
  DataTableBody,
  DataTableFooter,
  DataTableHead,
  DataTableRow,
} from '@/components/ui/DataTable';
import {
  DOCUMENT_COLUMNS,
  SOURCE_TAB,
  SOURCE_TABS,
  TABLE_COLUMNS,
  UPLOAD_HINT,
} from '@/config/constants/sources';
import { CATALOG, CURRENT_VERSION, DOCUMENTS, LAST_SYNCED, TABLES } from '@/mocks/sources';
import { useWorkspace } from '@/hooks/useWorkspace';
import { buildPath } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import { canExtract, extractLabel, sourceStatus } from './sourceStatus';
import styles from './Sources.module.css';

export default function Sources() {
  const navigate = useNavigate();
  const { workspace, workspaceId } = useWorkspace();
  const [tab, setTab] = useState('tables');
  const [query, setQuery] = useState('');

  /**
   * Extraction is per source: one table or one document at a time. Triggering
   * is the whole interaction, so all this screen has to remember is which
   * sources are now on their way.
   */
  const [triggered, setTriggered] = useState(() => new Set());

  const trigger = (source) => {
    setTriggered((prev) => new Set(prev).add(source.id));
  };

  const visibleTables = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? TABLES.filter((table) => table.name.includes(needle)) : TABLES;
  }, [query]);

  const driftedTables = useMemo(() => TABLES.filter((table) => table.drift), []);

  const renderAction = (source) => (
    <div className={styles.actionCell}>
      <Button
        size="sm"
        variant={source.drift ? 'warn' : 'secondary'}
        iconLeft={source.lastRun ? 'refresh' : undefined}
        disabled={!canExtract(source, triggered)}
        onClick={() => trigger(source)}
      >
        {extractLabel(source, triggered)}
      </Button>
    </div>
  );

  const renderStatus = (source) => {
    const state = sourceStatus(source, triggered);
    return (
      <div>
        <Chip tone={state.tone}>{state.label}</Chip>
      </div>
    );
  };

  return (
    <>
      <TopBar
        crumbs={[{ label: workspace.name }, { label: 'Data sources' }]}
        actions={
          <Button
            variant="primary"
            iconLeft="plus"
            onClick={() => navigate(buildPath.newRun(workspaceId))}
          >
            New extraction
          </Button>
        }
      />

      <PageBody>
        <PageHeader
          title="Data sources"
          subtitle="Everything an extraction can read from. Run one against a single table or document — the Status column says whether it is already on its way."
          actions={
            <Button variant="secondary" iconLeft="refresh">
              Sync from catalog
            </Button>
          }
        />

        <div className={styles.tabs} role="group" aria-label="Source type">
          {SOURCE_TABS.map((sourceTab) => {
            const active = tab === sourceTab.id;
            const count = sourceTab.id === SOURCE_TAB.tables ? TABLES.length : DOCUMENTS.length;
            return (
              <button
                key={sourceTab.id}
                type="button"
                aria-pressed={active}
                className={[styles.tab, active ? styles.tabActive : ''].filter(Boolean).join(' ')}
                onClick={() => setTab(sourceTab.id)}
              >
                {sourceTab.label}
                <span className={styles.tabCount}>{count}</span>
              </button>
            );
          })}
        </div>

        {tab === SOURCE_TAB.tables ? (
          <div className={styles.panel}>
            <div className={styles.controls}>
              <div className={styles.catalogPicker}>
                <Icon name="database" size={14} style={{ color: 'var(--text-3)' }} />
                {CATALOG}
                <Icon name="chevronDown" size={13} style={{ color: 'var(--text-5)' }} />
              </div>
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Filter tables"
                width={200}
              />
              <div className={styles.spacer} />
              <span className={styles.syncNote}>Last synced {LAST_SYNCED}</span>
            </div>

            {driftedTables.length > 0 && (
              <Banner
                tone="warn"
                title={`${driftedTables.length} sources have changed since ${CURRENT_VERSION} was built`}
                note={`${driftedTables.map((t) => `${t.name} ${t.drift}`).join(', ')}. Re-extract them one at a time from the row.`}
              />
            )}

            <DataTable>
              <DataTableHead columns={TABLE_COLUMNS} />
              <DataTableBody>
                {visibleTables.map((table) => (
                  <DataTableRow
                    key={table.id}
                    columns={TABLE_COLUMNS}
                    flagged={Boolean(table.drift)}
                  >
                    <div className={styles.tableName}>{table.name}</div>
                    <div className={styles.num}>{table.cols}</div>
                    <div className={styles.num}>{table.rows}</div>
                    <div
                      className={[
                        styles.description,
                        table.description ? '' : styles.descriptionEmpty,
                      ]
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
                    {renderStatus(table)}
                    {renderAction(table)}
                  </DataTableRow>
                ))}
              </DataTableBody>

              <DataTableFooter>
                <div className={styles.footerCount}>
                  Showing {visibleTables.length} of {pluralize(TABLES.length, 'table')}
                </div>
                <div className={styles.spacer} />
                <div className={styles.footerBreakdown}>
                  {driftedTables.length} changed since {CURRENT_VERSION}
                </div>
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
              <DataTableHead columns={DOCUMENT_COLUMNS} />
              <DataTableBody>
                {DOCUMENTS.map((doc) => (
                  <DataTableRow
                    key={doc.id}
                    columns={DOCUMENT_COLUMNS}
                    flagged={Boolean(doc.drift)}
                  >
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
                    {renderStatus(doc)}
                    {renderAction(doc)}
                  </DataTableRow>
                ))}
              </DataTableBody>

              <DataTableFooter>
                <div className={styles.footerCount}>{pluralize(DOCUMENTS.length, 'document')}</div>
              </DataTableFooter>
            </DataTable>
          </div>
        )}
      </PageBody>
    </>
  );
}
