import { useCallback, useMemo, useState } from 'react';
import { ENTITY_DETAILS, GRAPH_EDGES, GRAPH_NODES, ROOT_ENTITY } from '@/features/graph/mocks';
import { DEFAULT_DEPTH } from '@/features/graph/constants';

/**
 * Everything the graph screen filters, selects and derives.
 *
 * Split out of the page because it is where the actual logic lives: the JSX is
 * three independent panels, but the depth/type/inferred filters feed all of
 * them and only make sense together.
 */
export function useGraphView(runId) {
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

  const toggleType = useCallback((type) => {
    setHiddenTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const showAllTypes = useCallback(() => setHiddenTypes(new Set()), []);

  return {
    nodesById,
    visibleNodes,
    visibleEdges,
    neighbourIds,
    selected,
    setSelectedId,
    inspector,
    query,
    setQuery,
    depth,
    setDepth,
    showLabels,
    setShowLabels,
    showInferred,
    setShowInferred,
    hiddenTypes,
    toggleType,
    showAllTypes,
  };
}
