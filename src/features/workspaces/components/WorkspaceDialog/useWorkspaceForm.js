import { useCallback, useMemo, useState } from 'react';
import { useSelection } from '@/hooks/useSelection';
import { WORKSPACE_DIALOG_STEP, WORKSPACE_STATUS } from '@/features/workspaces/constants';
import { UMC_WORKSPACES } from '@/features/workspaces/mocks';

const EMPTY_DETAILS = {
  name: '',
  description: '',
  businessDomain: '',
  businessContext: '',
  modellingGuidance: '',
};

/** What a workspace starts life with. Spread under an edit so real counts survive. */
const NEW_WORKSPACE_DEFAULTS = {
  status: WORKSPACE_STATUS.draft,
  version: 'v1',
  concepts: 0,
  relations: 0,
  activeRuns: 0,
};

function seedDetails(workspace) {
  if (!workspace) return EMPTY_DETAILS;
  return {
    name: workspace.name ?? '',
    description: workspace.blurb ?? '',
    businessDomain: workspace.businessDomain ?? '',
    businessContext: workspace.businessContext ?? '',
    modellingGuidance: workspace.modellingGuidance ?? '',
  };
}

/** Lowercased once per keystroke rather than once per row per keystroke. */
function matches(workspace, needle) {
  return (
    workspace.name.toLowerCase().includes(needle) ||
    workspace.description.toLowerCase().includes(needle)
  );
}

/**
 * All the state behind the workspace dialog, for both creating and editing.
 *
 * `initial` is the workspace being edited, or null when creating. The caller
 * remounts this on a different target rather than reseeding through an effect,
 * so there is no reset path to keep in step with the fields.
 *
 * Step 1 is the only gate: a workspace needs a name, and nothing in step 2 is
 * required. `showNameError` stays false until someone actually tries to move
 * on, so the form does not open already complaining.
 */
export function useWorkspaceForm(initial = null) {
  const [step, setStep] = useState(WORKSPACE_DIALOG_STEP.details);
  const [details, setDetails] = useState(() => seedDetails(initial));
  const [query, setQuery] = useState('');
  const [attemptedNext, setAttemptedNext] = useState(false);
  const selection = useSelection(initial?.importedWorkspaceIds ?? []);

  const setField = useCallback((key, value) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  }, []);

  const trimmedName = details.name.trim();
  const nameValid = trimmedName.length > 0;
  const showNameError = attemptedNext && !nameValid;

  // Derived, not stored: the filter is a pure function of the query.
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle
      ? UMC_WORKSPACES.filter((workspace) => matches(workspace, needle))
      : UMC_WORKSPACES;
  }, [query]);

  const visibleIds = useMemo(() => visible.map((workspace) => workspace.id), [visible]);

  // "Select all" means "select all visible" — what people expect once filtered.
  const { toggleMany } = selection;
  const allVisibleSelected = selection.allSelected(visibleIds);
  const toggleAllVisible = useCallback(
    () => toggleMany(visibleIds, !allVisibleSelected),
    [toggleMany, visibleIds, allVisibleSelected],
  );

  /** Leaving step 1 is the only move that can be refused. */
  const goTo = useCallback(
    (next) => {
      if (next === WORKSPACE_DIALOG_STEP.import && !nameValid) {
        setAttemptedNext(true);
        return;
      }
      setAttemptedNext(false);
      setStep(next);
    },
    [nameValid],
  );

  const goNext = useCallback(() => goTo(WORKSPACE_DIALOG_STEP.import), [goTo]);
  const goBack = useCallback(() => goTo(WORKSPACE_DIALOG_STEP.details), [goTo]);

  /**
   * The workspace the registry will store. Shaped like the fixtures rather than
   * like the form, so the grid needs no special case for one someone made.
   *
   * An edit keeps the original id even when the name changes: the id is the
   * route and the key everything else is filed under, so renaming must not
   * silently mint a new workspace.
   */
  const buildWorkspace = useCallback(() => {
    const id = initial
      ? initial.id
      : trimmedName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

    return {
      ...NEW_WORKSPACE_DEFAULTS,
      ...(initial ?? {}),
      id,
      slug: id,
      name: trimmedName,
      businessDomain: details.businessDomain.trim(),
      blurb: details.description.trim(),
      businessContext: details.businessContext.trim(),
      modellingGuidance: details.modellingGuidance.trim(),
      importedWorkspaceIds: selection.selectedIds,
    };
  }, [initial, trimmedName, details, selection.selectedIds]);

  return {
    step,
    details,
    setField,
    query,
    setQuery,
    visible,
    visibleIds,
    selection,
    allVisibleSelected,
    toggleAllVisible,
    nameValid,
    showNameError,
    goTo,
    goNext,
    goBack,
    buildWorkspace,
    totalCount: UMC_WORKSPACES.length,
  };
}
