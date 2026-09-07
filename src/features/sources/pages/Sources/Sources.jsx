import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import { PageBody } from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import SegmentedControl from '@/components/ui/SegmentedControl';
import { SOURCE_TAB, SOURCE_TABS } from '@/features/sources/constants';
import { DOCUMENTS, TABLES } from '@/features/sources/mocks';
import { sourceStats } from '@/features/sources/sourceStatus';
import { useWorkspace } from '@/features/workspaces';
import { buildPath } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import DocumentList from './DocumentList';
import SourceStats from './SourceStats';
import TableList from './TableList';
import styles from './Sources.module.css';

export default function Sources() {
  const navigate = useNavigate();
  const { workspace, workspaceId } = useWorkspace();
  const [tab, setTab] = useState(SOURCE_TAB.tables);

  /**
   * Extraction is per source: one table or one document at a time. Triggering
   * is the whole interaction, so all this screen has to remember is which
   * sources are now on their way.
   */
  const [triggered, setTriggered] = useState(() => new Set());

  const trigger = (source) => {
    setTriggered((prev) => new Set(prev).add(source.id));
  };

  const activeTab = SOURCE_TABS.find((sourceTab) => sourceTab.id === tab);
  const sources = tab === SOURCE_TAB.tables ? TABLES : DOCUMENTS;

  const tabOptions = SOURCE_TABS.map((sourceTab) => ({
    ...sourceTab,
    count: sourceTab.id === SOURCE_TAB.tables ? TABLES.length : DOCUMENTS.length,
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

        <SourceStats stats={sourceStats(sources, activeTab.label)} />

        <section className={styles.panel}>
          <header className={styles.panelHead}>
            <SegmentedControl
              options={tabOptions}
              value={tab}
              onChange={setTab}
              ariaLabel="Source type"
            />
            <div className={styles.spacer} />
            <span className={styles.panelCount}>{pluralize(sources.length, activeTab.unit)}</span>
          </header>

          {tab === SOURCE_TAB.tables ? (
            <TableList tables={TABLES} triggered={triggered} onTrigger={trigger} />
          ) : (
            <DocumentList documents={DOCUMENTS} triggered={triggered} onTrigger={trigger} />
          )}
        </section>
      </PageBody>
    </>
  );
}
