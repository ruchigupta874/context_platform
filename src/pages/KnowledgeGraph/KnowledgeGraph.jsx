import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import Checkbox from '@/components/ui/Checkbox';
import SearchInput from '@/components/ui/SearchInput';
import Toggle from '@/components/ui/Toggle';
import { SectionLabel } from '@/components/ui/Surfaces';
import RunOutputEmpty from '@/components/pipeline/RunOutputEmpty';
import {
  DEFAULT_DEPTH,
  DEPTH_OPTIONS,
  EDGE_LEGEND,
  ENTITY_COLORS,
  GRAPH_VIEWBOX,
} from '@/config/constants/graph';
import {
  ENTITY_COUNTS,
  ENTITY_DETAILS,
  GRAPH_EDGES,
  GRAPH_NODES,
  ROOT_ENTITY,
} from '@/mocks/graph';
import { findRun } from '@/mocks/runs';
import { useWorkspace } from '@/hooks/useWorkspace';
import { entityIri } from '@/utils/format';
import styles from './KnowledgeGraph.module.css';

export default function KnowledgeGraph() {
  const { workspaceId } = useWorkspace();
  const { runId } = useParams();
  const run = findRun(runId);

  const [selectedId, setSelectedId] = useState(ROOT_ENTITY);
  const [query, setQuery] = useState('Jacob Martin');
  const [depth, setDepth] = useState(DEFAULT_DEPTH);
  const [showLabels, setShowLabels] = useState(true);
  const [showInferred, setShowInferred] = useState(true);
  const [hiddenTypes, setHiddenTypes] = useState(() => new Set());

  const nodesById = useMemo(
    () => Object.fromEntries(GRAPH_NODES.map((node) => [node.id, node])),
    [],
  );

  /** Depth 1 shows only the root's direct neighbours; leaves have a grandparent. */
  const visibleNodes = useMemo(
    () =>
      GRAPH_NODES.filter((node) => {
        if (hiddenTypes.has(node.type)) return false;
        const isLeaf = node.parent && node.parent !== ROOT_ENTITY;
        if (isLeaf && depth < 2) return false;
        return true;
      }),
    [hiddenTypes, depth],
  );

  const visibleIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);

  const visibleEdges = useMemo(
    () =>
      GRAPH_EDGES.filter((edge) => {
        if (!visibleIds.has(edge.from) || !visibleIds.has(edge.to)) return false;
        if (edge.inferred && !showInferred) return false;
        return true;
      }),
    [visibleIds, showInferred],
  );

  const selected = nodesById[selectedId] ?? nodesById[ROOT_ENTITY];

  const neighbourIds = useMemo(() => {
    const set = new Set();
    visibleEdges.forEach((edge) => {
      if (edge.from === selected.id) set.add(edge.to);
      if (edge.to === selected.id) set.add(edge.from);
    });
    return set;
  }, [visibleEdges, selected.id]);

  /** Falls back to a generic inspector payload for nodes without a fixture. */
  const inspector = useMemo(() => {
    const fixture = ENTITY_DETAILS[selected.id];
    const incident = GRAPH_EDGES.filter(
      (edge) => edge.from === selected.id || edge.to === selected.id,
    ).map((edge) => {
      const outgoing = edge.from === selected.id;
      const otherId = outgoing ? edge.to : edge.from;
      return {
        id: edge.id,
        predicate: edge.predicate,
        other: nodesById[otherId].label,
        otherId,
        otherType: nodesById[otherId].type,
        outgoing,
      };
    });

    return {
      properties: fixture?.properties ?? [
        { id: 'p1', key: 'rdf:type', value: `ex:${selected.type}` },
        { id: 'p2', key: 'rdfs:label', value: selected.label },
        { id: 'p3', key: 'ex:sourceRun', value: runId },
      ],
      relationships: incident,
      sourceRow: fixture?.sourceRow ?? `${selected.type.toLowerCase()}#${selected.label}`,
      mapping: fixture?.mapping ?? `#${selected.type}Map`,
    };
  }, [selected, nodesById, runId]);

  const toggleType = (type) => {
    setHiddenTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  // Hooks above run unconditionally; the bail-out has to come after them.
  if (!run?.output) return <RunOutputEmpty artifact="Knowledge graph" run={run} runId={runId} />;

  return (
    <div className={styles.layout}>
      <div className={styles.controls}>
        <div className={styles.controlBlock}>
          <div>
            <SectionLabel>Start from</SectionLabel>
            <div style={{ marginTop: 7 }}>
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search an entity"
                width="100%"
              />
            </div>
          </div>
          <div>
            <div className={styles.depthRow}>
              <SectionLabel>Traversal depth</SectionLabel>
              <span className={styles.depthValue}>{depth}</span>
            </div>
            <div className={styles.depthButtons}>
              {DEPTH_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={[styles.depthButton, depth === option ? styles.depthActive : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setDepth(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.types}>
          <div className={styles.typesHead}>
            <SectionLabel>Entity types</SectionLabel>
            <button
              type="button"
              className={styles.selectAll}
              onClick={() => setHiddenTypes(new Set())}
            >
              All
            </button>
          </div>
          {Object.keys(ENTITY_COLORS).map((type) => {
            const on = !hiddenTypes.has(type);
            return (
              <div
                key={type}
                role="button"
                tabIndex={0}
                className={styles.typeRow}
                onClick={() => toggleType(type)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggleType(type);
                  }
                }}
              >
                <Checkbox size="sm" checked={on} onChange={() => toggleType(type)} label={type} />
                <span
                  className={styles.typeSwatch}
                  style={{ background: ENTITY_COLORS[type], opacity: on ? 1 : 0.35 }}
                />
                <span
                  className={[styles.typeName, on ? '' : styles.typeOff].filter(Boolean).join(' ')}
                >
                  {type}
                </span>
                <span className={styles.typeCount}>{ENTITY_COUNTS[type]}</span>
              </div>
            );
          })}
        </div>

        <div className={styles.toggles}>
          <Toggle checked={showLabels} onChange={setShowLabels} label="Node labels" />
          <Toggle checked={showInferred} onChange={setShowInferred} label="Inferred edges" />
        </div>
      </div>

      <div className={styles.canvasColumn}>
        <div className={styles.canvasBar}>
          <span className={styles.canvasTitle}>
            Neighbourhood of{' '}
            <span className={styles.canvasTitleStrong}>{nodesById[ROOT_ENTITY].label}</span>
          </span>
          <span className={styles.canvasCount}>
            {visibleNodes.length} of {run.output.nodes} shown
          </span>
          <div className={styles.spacer} />
          <button type="button" className={styles.zoomButton} aria-label="Zoom out">
            <Icon name="minus" size={13} />
          </button>
          <button type="button" className={styles.zoomButton} aria-label="Zoom in">
            <Icon name="plus" size={13} />
          </button>
          <button type="button" className={styles.zoomButton} aria-label="Fit to view">
            <Icon name="expand" size={13} />
          </button>
        </div>

        <div className={styles.canvas}>
          <svg viewBox={GRAPH_VIEWBOX} preserveAspectRatio="xMidYMid meet" className={styles.svg}>
            <g strokeLinecap="round">
              {visibleEdges.map((edge) => {
                const from = nodesById[edge.from];
                const to = nodesById[edge.to];
                const hot = edge.from === selected.id || edge.to === selected.id;
                return (
                  <line
                    key={edge.id}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={hot ? 'var(--accent)' : edge.primary ? '#b4b4be' : '#dcdce3'}
                    strokeWidth={hot ? 1.8 : edge.primary ? 1.4 : 1}
                    strokeDasharray={edge.inferred ? '4 4' : undefined}
                  />
                );
              })}
            </g>

            {showLabels && (
              <g>
                {visibleEdges
                  .filter((edge) => edge.primary)
                  .map((edge) => {
                    const from = nodesById[edge.from];
                    const to = nodesById[edge.to];
                    return (
                      <text
                        key={`label-${edge.id}`}
                        x={(from.x + to.x) / 2}
                        y={(from.y + to.y) / 2 - 4}
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                        fontSize="9"
                        fill="var(--text-5)"
                      >
                        {edge.predicate}
                      </text>
                    );
                  })}
              </g>
            )}

            <g>
              {visibleNodes.map((node) => {
                const isSelected = node.id === selected.id;
                const isNeighbour = neighbourIds.has(node.id);
                const dim = !isSelected && !isNeighbour && selected.id !== ROOT_ENTITY;
                return (
                  <g
                    key={node.id}
                    className={styles.node}
                    onClick={() => setSelectedId(node.id)}
                    role="button"
                    aria-label={`${node.type} ${node.label}`}
                  >
                    {isSelected && (
                      <circle cx={node.x} cy={node.y} r={node.r + 6} fill="rgba(75,69,198,.14)" />
                    )}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r}
                      fill={ENTITY_COLORS[node.type]}
                      stroke={isSelected ? '#16161d' : '#ffffff'}
                      strokeWidth={isSelected ? 2 : 1.6}
                    />
                    {showLabels && (
                      <text
                        x={node.x}
                        y={node.y + node.r + 12}
                        textAnchor="middle"
                        fontFamily="var(--font-sans)"
                        fontSize="9.5"
                        fontWeight={node.root || isSelected ? 600 : 400}
                        fill={isSelected ? '#16161d' : '#6e6e7a'}
                        opacity={dim ? 0.35 : 1}
                      >
                        {node.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          <div className={styles.legend}>
            <span className={styles.legendLabel}>Edge type</span>
            {EDGE_LEGEND.map((entry) => (
              <span key={entry.id} className={styles.legendItem}>
                <span className={entry.dashed ? styles.legendDashed : styles.legendLine} />
                {entry.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <aside className={styles.inspector}>
        <div className={styles.inspectorHead}>
          <div className={styles.inspectorType}>
            <span
              className={styles.inspectorSwatch}
              style={{ background: ENTITY_COLORS[selected.type] }}
            />
            <span className={styles.inspectorTypeLabel}>{selected.type}</span>
          </div>
          <div className={styles.inspectorLabel}>{selected.label}</div>
          <div className={styles.inspectorIri}>
            {entityIri(workspaceId, selected.type, selected.label)}
          </div>
        </div>

        <div className={styles.inspectorBody}>
          <div>
            <SectionLabel>Properties</SectionLabel>
            <div className={styles.props}>
              {inspector.properties.map((property) => (
                <div key={property.id} className={styles.prop}>
                  <span className={styles.propKey}>{property.key}</span>
                  <span className={styles.propValue}>{property.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel note={String(inspector.relationships.length)}>Relationships</SectionLabel>
            <div className={styles.rels}>
              {inspector.relationships.map((relationship) => (
                <button
                  key={relationship.id}
                  type="button"
                  className={styles.rel}
                  onClick={() => setSelectedId(relationship.otherId)}
                >
                  <Icon
                    name={relationship.outgoing ? 'arrowRight' : 'arrowLeft'}
                    size={12}
                    style={{ color: 'var(--text-disabled)' }}
                  />
                  <span className={styles.relPredicate}>{relationship.predicate}</span>
                  <span className={styles.relOther}>{relationship.other}</span>
                  <span
                    className={styles.relSwatch}
                    style={{ background: ENTITY_COLORS[relationship.otherType] }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Provenance</SectionLabel>
            <div className={styles.provenance}>
              <div className={styles.provRow}>
                <span className={styles.provKey}>source row</span>
                <span className={styles.provValue}>{inspector.sourceRow}</span>
              </div>
              <div className={styles.provRow}>
                <span className={styles.provKey}>mapping</span>
                <span className={styles.provValue}>{inspector.mapping}</span>
              </div>
              <div className={styles.provRow}>
                <span className={styles.provKey}>built by</span>
                <span className={styles.provValue}>{runId}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
