import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput';
import Skeleton from '@/components/ui/Skeleton';
import Brand from '@/components/layout/Brand';
import { REGISTRY_COPY } from '@/features/workspaces/constants';
import WorkspaceDialog from '@/features/workspaces/components/WorkspaceDialog';
import { buildPath } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import FeaturedWorkspace from './FeaturedWorkspace';
import WorkspaceCard from './WorkspaceCard';
import { CardSkeleton, FeaturedSkeleton } from './RegistrySkeleton';
import { useRegistryData } from './useRegistryData';
import styles from './WorkspaceRegistry.module.css';

/** How many cards hold space while the list is in flight. */
const SKELETON_IDS = ['s1', 's2'];

export default function WorkspaceRegistry() {
  const navigate = useNavigate();
  const { workspaces, stats, isLoading } = useRegistryData();
  const [query, setQuery] = useState('');
  // Nothing is selected until the list arrives. The featured panel falls back
  // to the first workspace, so it is never empty once it can render at all.
  const [selectedId, setSelectedId] = useState(null);
  // null = closed, { workspace: null } = creating, { workspace } = editing.
  const [dialog, setDialog] = useState(null);
  // Until the API lands there is nowhere to persist any of this, so new
  // workspaces and edits to existing ones both live here for the session.
  const [created, setCreated] = useState([]);
  const [edits, setEdits] = useState({});

  // One list, one override pass — so an edit reaches a fixture workspace and
  // one someone just made by exactly the same route.
  const allWorkspaces = useMemo(
    () => [...created, ...workspaces].map((workspace) => edits[workspace.id] ?? workspace),
    [created, workspaces, edits],
  );

  // Derived, not stored: filtering is a pure function of the query.
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return allWorkspaces.filter((workspace) => {
      const matchesQuery =
        !needle ||
        workspace.name.toLowerCase().includes(needle) ||
        workspace.businessDomain.toLowerCase().includes(needle) ||
        workspace.blurb.toLowerCase().includes(needle);
      return matchesQuery;
    });
  }, [query, allWorkspaces]);

  // Counted across every workspace, not just the visible ones — a run does not
  // stop because you typed in the search box.
  const activeRuns = allWorkspaces.reduce((total, workspace) => total + workspace.activeRuns, 0);

  // The featured panel is a view of whichever card is selected, so its identity
  // stays in step with the grid even though the KPI numbers are still static.
  const selected =
    allWorkspaces.find((workspace) => workspace.id === selectedId) ?? allWorkspaces[0];

  const open = (workspaceId) => navigate(buildPath.overview(workspaceId));

  // A new workspace goes to the front of the grid and takes the featured slot,
  // so the thing you just made is the thing you are looking at. An edit keeps
  // its id, so it stays exactly where it already was.
  const handleSubmit = (workspace) => {
    if (dialog?.workspace) setEdits((prev) => ({ ...prev, [workspace.id]: workspace }));
    else setCreated((prev) => [workspace, ...prev]);
    setSelectedId(workspace.id);
    setQuery('');
  };

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Brand />
        <span className={styles.version}>v0.4.0</span>
        <div className={styles.spacer} />
        <Button variant="primary" iconLeft="plus" onClick={() => setDialog({ workspace: null })}>
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

          {isLoading ? (
            <FeaturedSkeleton />
          ) : (
            selected && (
              <FeaturedWorkspace
                workspace={selected}
                stats={stats}
                onOpen={() => open(selected.id)}
                onEdit={() => setDialog({ workspace: selected })}
              />
            )
          )}

          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{REGISTRY_COPY.sectionTitle}</h2>
            <span className={styles.sectionMeta}>
              {isLoading ? (
                <Skeleton width={74} height={9} />
              ) : (
                <>{pluralize(activeRuns, 'run')} active</>
              )}
            </span>
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
            <span className={styles.count}>
              {isLoading ? (
                <Skeleton width={70} height={9} />
              ) : (
                pluralize(visible.length, 'workspace')
              )}
            </span>
          </div>

          <div className={styles.grid} aria-busy={isLoading}>
            {isLoading && (
              <span role="status" className={styles.srOnly}>
                Loading workspaces
              </span>
            )}

            {isLoading && SKELETON_IDS.map((id) => <CardSkeleton key={id} />)}

            {!isLoading &&
              visible.map((workspace, index) => (
                <WorkspaceCard
                  key={workspace.id}
                  workspace={workspace}
                  index={index}
                  isSelected={workspace.id === selectedId}
                  onSelect={() => setSelectedId(workspace.id)}
                  onOpen={() => open(workspace.id)}
                  onEdit={() => setDialog({ workspace })}
                />
              ))}

            <button
              type="button"
              className={styles.newCard}
              onClick={() => setDialog({ workspace: null })}
            >
              <span className={styles.newCardIcon}>
                <Icon name="plus" size={16} />
              </span>
              <span className={styles.newCardTitle}>{REGISTRY_COPY.newCardTitle}</span>
              <span className={styles.newCardHint}>{REGISTRY_COPY.newCardHint}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Keyed per target so the form seeds once and needs no reset path. */}
      {dialog && (
        <WorkspaceDialog
          key={dialog.workspace?.id ?? 'new'}
          workspace={dialog.workspace}
          onOpenChange={(next) => !next && setDialog(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
