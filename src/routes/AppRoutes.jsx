import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import WorkspaceRegistry from '../pages/WorkspaceRegistry';
import Sources from '../pages/Sources';
import NewRun from '../pages/NewRun';
import Runs from '../pages/Runs';
import RunDetail from '../pages/RunDetail';
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

        <Route path="overview" element={<Placeholder title="Overview" icon="grid" />} />
        <Route path="sources" element={<Sources />} />
        <Route
          path="documents"
          element={
            <Placeholder
              title="Documents"
              icon="doc"
              hint="Document management lives on the Documents tab of Data sources today."
            />
          }
        />

        <Route path="runs" element={<Runs />} />
        <Route path="runs/new" element={<NewRun />} />
        <Route path="runs/:runId" element={<RunDetail />} />
        <Route path="runs/:runId/review/concepts" element={<ReviewConcepts />} />
        <Route path="runs/:runId/review/questions" element={<ReviewQuestions />} />
        <Route
          path="review"
          element={
            <Placeholder
              title="Review queue"
              icon="inbox"
              hint="A cross-run inbox of every gate waiting on you. Filter the Runs list by 'Needs review' for now."
            />
          }
        />

        <Route path="ontology" element={<Ontology />} />
        <Route path="questions" element={<Placeholder title="Competency questions" icon="help" />} />
        <Route path="graph" element={<KnowledgeGraph />} />
        <Route path="validation" element={<Placeholder title="Validation" icon="shield" />} />
      </Route>

      <Route path="*" element={<Navigate to={`/w/${DEFAULT_WORKSPACE_ID}/runs`} replace />} />
    </Routes>
  );
}
