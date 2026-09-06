import { useParams } from 'react-router-dom';
import { RunOutputEmpty, findRun } from '@/features/runs';
import GraphCanvas from './GraphCanvas';
import GraphControls from './GraphControls';
import GraphInspector from './GraphInspector';
import { useGraphView } from './useGraphView';
import styles from './KnowledgeGraph.module.css';

/**
 * Three panels over one filtered view of the graph: what to show, the canvas,
 * and what is selected. The filtering that ties them together lives in
 * useGraphView.
 */
export default function KnowledgeGraph() {
  const { runId } = useParams();
  const run = findRun(runId);
  const view = useGraphView(runId);

  // Hooks above run unconditionally; the bail-out has to come after them.
  if (!run?.output) return <RunOutputEmpty artifact="Knowledge graph" run={run} runId={runId} />;

  return (
    <div className={styles.layout}>
      <GraphControls
        query={view.query}
        onQueryChange={view.setQuery}
        depth={view.depth}
        onDepthChange={view.setDepth}
        hiddenTypes={view.hiddenTypes}
        onToggleType={view.toggleType}
        onShowAllTypes={view.showAllTypes}
        showLabels={view.showLabels}
        onShowLabelsChange={view.setShowLabels}
        showInferred={view.showInferred}
        onShowInferredChange={view.setShowInferred}
      />

      <GraphCanvas
        nodesById={view.nodesById}
        visibleNodes={view.visibleNodes}
        visibleEdges={view.visibleEdges}
        neighbourIds={view.neighbourIds}
        selected={view.selected}
        onSelect={view.setSelectedId}
        showLabels={view.showLabels}
        totalNodes={run.output.nodes}
      />

      <GraphInspector
        selected={view.selected}
        inspector={view.inspector}
        onSelect={view.setSelectedId}
        runId={runId}
      />
    </div>
  );
}
