import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import RunShell from '../components/layout/RunShell';
import RunDetail from '../pages/RunDetail';
import WorkspaceRegistry from '../pages/WorkspaceRegistry';
import ReviewQueue from '../pages/ReviewQueue';
import Overview from '../pages/Overview';
import Sources from '../pages/Sources';
import NewRun from '../pages/NewRun';
import Runs from '../pages/Runs';
import ReviewConcepts from '../pages/ReviewConcepts';
import ReviewQuestions from '../pages/ReviewQuestions';
import Ontology from '../pages/Ontology';
import KnowledgeGraph from '../pages/KnowledgeGraph';
import Placeholder from '../pages/Placeholder';
import { DEFAULT_WORKSPACE_ID } from './paths';

/**
 * Route tree.
 *
 * Everything under /w/:workspaceId renders inside AppShell, which owns the
 * sidebar and the workspace context. The registry sits outside it because it is
 * the screen you use before a workspace is chosen.
 *
 * Note the two gates are nested under their run rather than living at workspace
 * level: a review always belongs to one run, and the URL should say so.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/workspaces" replace />} />
      <Route path="/workspaces" element={<WorkspaceRegistry />} />

      <Route path="/w/:workspaceId" element={<AppShell />}>
        <Route index element={<Navigate to="overview" replace />} />

        <Route path="overview" element={<Overview />} />
        <Route path="sources" element={<Sources />} />
        <Route path="runs" element={<Runs />} />
        <Route path="runs/new" element={<NewRun />} />

        {/* Every view of a run shares the run bar, the stepper and the tabs. */}
        <Route path="runs/:runId" element={<RunShell />}>
          <Route index element={<RunDetail />} />
          <Route path="graph" element={<KnowledgeGraph />} />
          <Route path="ontology" element={<Ontology />} />
          <Route path="review/concepts" element={<ReviewConcepts />} />
          <Route path="review/questions" element={<ReviewQuestions />} />
        </Route>
        <Route path="review" element={<ReviewQueue />} />

        <Route
          path="graph"
          element={
            <Placeholder
              title="Knowledge graph"
              icon="graph"
              hint="The whole domain in one graph, merged across every run. Until that exists, each run carries the graph it built — open a finished run to see one."
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={`/w/${DEFAULT_WORKSPACE_ID}/runs`} replace />} />
    </Routes>
  );
}
