import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import { PageBody } from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Skeleton from '@/components/ui/Skeleton';
import { SOURCE_TAB, SOURCE_TABS } from '@/features/sources/constants';
import { assetToDocument } from '@/features/sources/assets';
import ImportAssetsDialog from '@/features/sources/components/ImportAssetsDialog';
import { sourceStats } from '@/features/sources/sourceStatus';
import { useWorkspace } from '@/features/workspaces';
import { buildPath } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import DocumentList from './DocumentList';
import SourceStats from './SourceStats';
import TableList from './TableList';
import { useSourcesData } from './useSourcesData';
import styles from './Sources.module.css';

export default function Sources() {
  const navigate = useNavigate();
  const { workspace, workspaceId } = useWorkspace();
  const { tables, documents: fetched, isLoading } = useSourcesData();
  const [tab, setTab] = useState(SOURCE_TAB.documents);
  // Assets imported this session. There is nowhere to persist them until the
  // API lands, so they live here alongside the picker's open state.
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState([]);

  /**
   * Extraction is per source: one table or one document at a time. Triggering
   * is the whole interaction, so all this screen has to remember is which
   * sources are now on their way.
   */
  const [triggered, setTriggered] = useState(() => new Set());

  const trigger = (source) => {
    setTriggered((prev) => new Set(prev).add(source.id));
  };

  /**
   * A source's last extraction is a run, and the run is where the provenance
   * lives — what it read, what a reviewer approved, what it built. So the row
   * links to that run rather than trying to restate it here.
   */
  const openRun = (runId) => navigate(buildPath.runDetail(workspaceId, runId));

  const activeTab = SOURCE_TABS.find((sourceTab) => sourceTab.id === tab);
  const documents = useMemo(() => [...imported, ...fetched], [imported, fetched]);
  const sources = tab === SOURCE_TAB.tables ? tables : documents;

  // What you just brought in goes to the front, so it is what you are looking at.
  const handleImport = (assets) => {
    setImported((prev) => [...assets.map(assetToDocument), ...prev]);
  };

  const tabOptions = SOURCE_TABS.map((sourceTab) => ({
    ...sourceTab,
    // No count until there is one to give: a tab reading "Documents 0" while
    // its list is still in flight is a worse answer than no number at all.
    count: isLoading
      ? undefined
      : sourceTab.id === SOURCE_TAB.tables
        ? tables.length
        : documents.length,
  }));

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
            <Button variant="secondary" iconLeft="refresh" disabled>
              Sync from catalog
            </Button>
          }
        />

        <SourceStats stats={sourceStats(sources, activeTab.label)} isLoading={isLoading} />

        <section className={styles.panel} aria-busy={isLoading}>
          <header className={styles.panelHead}>
            <SegmentedControl
              options={tabOptions}
              value={tab}
              onChange={setTab}
              ariaLabel="Source type"
            />
            <div className={styles.spacer} />
            <span className={styles.panelCount}>
              {isLoading ? (
                <Skeleton width={70} height={9} />
              ) : (
                pluralize(sources.length, activeTab.unit)
              )}
            </span>
          </header>

          {tab === SOURCE_TAB.tables ? (
            <TableList
              tables={tables}
              triggered={triggered}
              onTrigger={trigger}
              onOpenRun={openRun}
            />
          ) : (
            <DocumentList
              documents={documents}
              triggered={triggered}
              onTrigger={trigger}
              onOpenRun={openRun}
              onImport={() => setImporting(true)}
              isLoading={isLoading}
            />
          )}
        </section>
      </PageBody>

      {importing && (
        <ImportAssetsDialog
          importedIds={documents.map((doc) => doc.id)}
          onOpenChange={(next) => !next && setImporting(false)}
          onImport={handleImport}
        />
      )}
    </>
  );
}
