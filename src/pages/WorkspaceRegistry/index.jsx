import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/ui/Icon";
import Button from "../../components/ui/Button";
import Chip from "../../components/ui/Chip";
import SearchInput from "../../components/ui/SearchInput";
import { StatGrid } from "../../components/ui/Surfaces";
import {
  WORKSPACE_STATUS_TONES,
  REGISTRY_COPY,
} from "../../config/constants/workspaces";
import { WORKSPACES, WORKSPACE_STATS } from "../../mocks/workspaces";
import { buildPath } from "../../routes/paths";
import { pluralize } from "../../utils/format";
import styles from "./WorkspaceRegistry.module.css";

export default function WorkspaceRegistry() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
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

  // The header panel is a view of whichever card is selected, so its identity
  // stays in step with the grid even though the KPI numbers are still static.
  const selected =
    WORKSPACES.find((workspace) => workspace.id === selectedId) ??
    WORKSPACES[0];

  const open = (workspaceId) => navigate(buildPath.overview(workspaceId));

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <span className={styles.mark}>
          <Icon name="graph" size={15} strokeWidth={1.5} />
        </span>
        <span className={styles.wordmark}>Context Platform</span>
        <span className={styles.version}>v0.4.0</span>
        <div className={styles.spacer} />
        <Button variant="primary" iconLeft="plus" disabled>
          New workspace
        </Button>
        <span className={styles.avatar}>AS</span>
      </header>

      <div className={styles.scroll}>
        <div className={styles.container}>
          <div>
            <h1 className={styles.title}>{REGISTRY_COPY.title}</h1>
            <p className={styles.subtitle}>{REGISTRY_COPY.subtitle}</p>
          </div>

          <section
            className={`${styles.featured} ${styles.card}`}
            style={{ cursor: "default" }}
          >
            <div className={styles.featuredTop}>
              <div className={styles.featuredBody}>
                <div className={styles.eyebrow}>
                  <span className={styles.eyebrowLabel}>
                    {REGISTRY_COPY.selectedLabel}
                  </span>
                  <Chip tone="warn">
                    {pluralize(selected.activeRuns, "run")} active
                  </Chip>
                </div>
                <div className={styles.featuredName}>{selected.name}</div>
                <div className={styles.featuredMeta}>
                  <span className={styles.featuredDomain}>
                    {selected.businessDomain}
                  </span>
                </div>
              </div>
              <div className={styles.featuredActions}>
                <Button
                  variant="primary"
                  iconRight="arrowRight"
                  onClick={() => open(selected.id)}
                >
                  Open
                </Button>
              </div>
            </div>
            <StatGrid stats={WORKSPACE_STATS} columns={6} />
          </section>

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
              {pluralize(visible.length, "workspace")}
            </span>
          </div>

          <div className={styles.grid}>
            {visible.map((workspace) => (
              <div
                key={workspace.id}
                role="button"
                tabIndex={0}
                className={[
                  styles.card,
                  selectedId === workspace.id ? styles.cardSelected : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setSelectedId(workspace.id)}
                onDoubleClick={() => open(workspace.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") open(workspace.id);
                }}
              >
                <div className={styles.cardTop}>
                  <span className={styles.cardIcon}>
                    <Icon name="database" size={14} />
                  </span>
                  <div className={styles.cardBody}>
                    <div className={styles.cardName}>{workspace.name}</div>
                    <div className={styles.cardDomain}>
                      {workspace.businessDomain}
                    </div>
                  </div>
                  <Chip tone={WORKSPACE_STATUS_TONES[workspace.status]}>
                    {workspace.status}
                  </Chip>
                </div>
                <p className={styles.cardBlurb}>{workspace.blurb}</p>
                <div className={styles.cardFoot}>
                  <span className={styles.cardFootStrong}>
                    {workspace.concepts}
                  </span>{" "}
                  concepts
                  <span style={{ color: "var(--border-strong)" }}>·</span>
                  <span className={styles.cardFootStrong}>
                    {workspace.relations}
                  </span>{" "}
                  relations
                  <span className={styles.cardFootSpacer} />
                </div>
              </div>
            ))}

            <button type="button" className={styles.newCard} disabled>
              <span className={styles.newCardIcon}>
                <Icon name="plus" size={16} />
              </span>
              <span className={styles.newCardTitle}>
                {REGISTRY_COPY.newCardTitle}
              </span>
              <span className={styles.newCardHint}>
                {REGISTRY_COPY.newCardHint}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
