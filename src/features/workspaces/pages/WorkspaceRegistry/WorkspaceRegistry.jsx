import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput';
import Brand from '@/components/layout/Brand';
import { REGISTRY_COPY } from '@/features/workspaces/constants';
import { WORKSPACES, WORKSPACE_STATS } from '@/features/workspaces/mocks';
import { buildPath } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import FeaturedWorkspace from './FeaturedWorkspace';
import WorkspaceCard from './WorkspaceCard';
import styles from './WorkspaceRegistry.module.css';

export default function WorkspaceRegistry() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(WORKSPACES[0].id);

  // Derived, not stored: filtering is a pure function of the query.
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return WORKSPACES.filter((workspace) => {
      const matchesQuery =
        !needle ||
        workspace.name.toLowerCase().includes(needle) ||
        workspace.businessDomain.toLowerCase().includes(needle) ||
        workspace.blurb.toLowerCase().includes(needle);
      return matchesQuery;
    });
  }, [query]);

  // Counted across every workspace, not just the visible ones — a run does not
  // stop because you typed in the search box.
  const activeRuns = WORKSPACES.reduce((total, workspace) => total + workspace.activeRuns, 0);

  // The featured panel is a view of whichever card is selected, so its identity
  // stays in step with the grid even though the KPI numbers are still static.
  const selected = WORKSPACES.find((workspace) => workspace.id === selectedId) ?? WORKSPACES[0];

  const open = (workspaceId) => navigate(buildPath.overview(workspaceId));

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Brand />
        <span className={styles.version}>v0.4.0</span>
        <div className={styles.spacer} />
        <Button variant="primary" iconLeft="plus" disabled>
          New workspace
        </Button>
        <span className={styles.avatar}>AS</span>
      </header>

      <div className={styles.scroll}>
        <div className={styles.container}>
          <div className={styles.intro}>
            <h1 className={styles.title}>{REGISTRY_COPY.title}</h1>
            <p className={styles.subtitle}>{REGISTRY_COPY.subtitle}</p>
          </div>

          <FeaturedWorkspace
            workspace={selected}
            stats={WORKSPACE_STATS}
            onOpen={() => open(selected.id)}
          />

          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{REGISTRY_COPY.sectionTitle}</h2>
            <span className={styles.sectionMeta}>{pluralize(activeRuns, 'run')} active</span>
          </div>

          <div className={styles.filters}>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search workspaces"
              width={260}
              aria-label="Search workspaces"
            />
            <div className={styles.spacer} />
            <span className={styles.count}>{pluralize(visible.length, 'workspace')}</span>
          </div>

          <div className={styles.grid}>
            {visible.map((workspace, index) => (
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                index={index}
                isSelected={workspace.id === selectedId}
                onSelect={() => setSelectedId(workspace.id)}
                onOpen={() => open(workspace.id)}
              />
            ))}

            <button type="button" className={styles.newCard} disabled>
              <span className={styles.newCardIcon}>
                <Icon name="plus" size={16} />
              </span>
              <span className={styles.newCardTitle}>{REGISTRY_COPY.newCardTitle}</span>
              <span className={styles.newCardHint}>{REGISTRY_COPY.newCardHint}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
