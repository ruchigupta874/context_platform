import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import ErrorBoundary from '@/app/ErrorBoundary';
import AppShell from '@/components/layout/AppShell';
import RunShell from '@/components/layout/RunShell';
import { DEFAULT_WORKSPACE_ID } from './paths';
import styles from './AppRoutes.module.css';

/**
 * Pages load on demand. The graph and ontology screens carry the heaviest
 * render code in the app, and someone opening the run list has no reason to
 * download either.
 *
 * AppShell and RunShell stay eager: they are the chrome every route renders
 * inside, so splitting them would only add a waterfall.
 */
const WorkspaceRegistry = lazy(() => import('@/pages/WorkspaceRegistry'));
const Overview = lazy(() => import('@/pages/Overview'));
const Sources = lazy(() => import('@/pages/Sources'));
const Runs = lazy(() => import('@/pages/Runs'));
const NewRun = lazy(() => import('@/pages/NewRun'));
const RunDetail = lazy(() => import('@/pages/RunDetail'));
const ReviewQueue = lazy(() => import('@/pages/ReviewQueue'));
const ReviewConcepts = lazy(() => import('@/pages/ReviewConcepts'));
const ReviewQuestions = lazy(() => import('@/pages/ReviewQuestions'));
const Ontology = lazy(() => import('@/pages/Ontology'));
const KnowledgeGraph = lazy(() => import('@/pages/KnowledgeGraph'));
const Placeholder = lazy(() => import('@/pages/Placeholder'));

/**
 * One boundary per route rather than one for the tree: a page that fails to
 * load or throws while rendering should not take the shell down with it, and
 * the fallback needs to sit inside the shell's layout.
 */
function Screen({ children }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className={styles.pending} aria-busy="true" />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

Screen.propTypes = { children: PropTypes.node };

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
      <Route
        path="/workspaces"
        element={
          <Screen>
            <WorkspaceRegistry />
          </Screen>
        }
      />

      <Route path="/w/:workspaceId" element={<AppShell />}>
        <Route index element={<Navigate to="overview" replace />} />

        <Route
          path="overview"
          element={
            <Screen>
              <Overview />
            </Screen>
          }
        />
        <Route
          path="sources"
          element={
            <Screen>
              <Sources />
            </Screen>
          }
        />
        <Route
          path="runs"
          element={
            <Screen>
              <Runs />
            </Screen>
          }
        />
        <Route
          path="runs/new"
          element={
            <Screen>
              <NewRun />
            </Screen>
          }
        />

        {/* Every view of a run shares the run bar, the stepper and the tabs. */}
        <Route path="runs/:runId" element={<RunShell />}>
          <Route
            index
            element={
              <Screen>
                <RunDetail />
              </Screen>
            }
          />
          <Route
            path="graph"
            element={
              <Screen>
                <KnowledgeGraph />
              </Screen>
            }
          />
          <Route
            path="ontology"
            element={
              <Screen>
                <Ontology />
              </Screen>
            }
          />
          <Route
            path="review/concepts"
            element={
              <Screen>
                <ReviewConcepts />
              </Screen>
            }
          />
          <Route
            path="review/questions"
            element={
              <Screen>
                <ReviewQuestions />
              </Screen>
            }
          />
        </Route>
        <Route
          path="review"
          element={
            <Screen>
              <ReviewQueue />
            </Screen>
          }
        />

        <Route
          path="graph"
          element={
            <Screen>
              <Placeholder
                title="Knowledge graph"
                icon="graph"
                hint="The whole domain in one graph, merged across every run. Until that exists, each run carries the graph it built — open a finished run to see one."
              />
            </Screen>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={`/w/${DEFAULT_WORKSPACE_ID}/runs`} replace />} />
    </Routes>
  );
}
