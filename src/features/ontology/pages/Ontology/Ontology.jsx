import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RunOutputEmpty, findRun } from '@/features/runs';
import { CLASS_DETAILS, DEFAULT_EXPANDED, ONTOLOGY_TREE } from '@/features/ontology/mocks';
import { useWorkspace } from '@/features/workspaces';
import ClassDetail from './ClassDetail';
import ClassTree from './ClassTree';
import OntologyRail from './OntologyRail';
import styles from './Ontology.module.css';

function fallbackDetail(id) {
  return {
    name: id,
    parent: 'owl:Thing',
    instances: '—',
    definition:
      'This class was created during the ontology build. Select Customer, Contract or Invoice to see a fully mapped class.',
    objectProperties: [],
    dataProperties: [],
    axioms: [],
    mapping: `# No mapping generated yet for ${id}.`,
  };
}

/** The built ontology: pick a class on the left, read it in the middle. */
export default function Ontology() {
  const { workspaceId } = useWorkspace();
  const { runId } = useParams();
  const run = findRun(runId);
  const [selectedId, setSelectedId] = useState('Customer');
  const [expanded, setExpanded] = useState(() => new Set(DEFAULT_EXPANDED));
  const [query, setQuery] = useState('');

  const hasChildren = useMemo(() => (id) => ONTOLOGY_TREE.some((node) => node.parent === id), []);

  /** A node is visible when every ancestor is expanded — or when a search is active. */
  const visibleNodes = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle) return ONTOLOGY_TREE.filter((node) => node.name.toLowerCase().includes(needle));

    const byId = Object.fromEntries(ONTOLOGY_TREE.map((node) => [node.id, node]));
    return ONTOLOGY_TREE.filter((node) => {
      let parent = node.parent;
      while (parent) {
        if (!expanded.has(parent)) return false;
        parent = byId[parent]?.parent;
      }
      return true;
    });
  }, [expanded, query]);

  const detail = CLASS_DETAILS[selectedId] ?? fallbackDetail(selectedId);

  const toggleExpanded = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Hooks above run unconditionally; the bail-out has to come after them.
  if (!run?.output) return <RunOutputEmpty artifact="Ontology" run={run} runId={runId} />;

  return (
    <div className={styles.layout}>
      <ClassTree
        nodes={visibleNodes}
        selectedId={selectedId}
        onSelect={setSelectedId}
        expanded={expanded}
        onToggleExpanded={toggleExpanded}
        hasChildren={hasChildren}
        query={query}
        onQueryChange={setQuery}
      />
      <ClassDetail detail={detail} workspaceId={workspaceId} />
      <OntologyRail />
    </div>
  );
}
