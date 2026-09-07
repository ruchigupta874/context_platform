import { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@/components/ui/Modal';
import {
  WORKSPACE_DIALOG_COPY,
  WORKSPACE_DIALOG_STEP,
  WORKSPACE_DIALOG_STEPS,
} from '@/features/workspaces/constants';
import DetailsStep from './DetailsStep';
import ImportStep from './ImportStep';
import { useWorkspaceForm } from './useWorkspaceForm';
import styles from './WorkspaceDialog.module.css';

/**
 * Create or edit a workspace, depending on whether `workspace` is passed.
 *
 * Creating is a wizard — step 2 unlocks once the name is there. Editing is not:
 * the workspace already exists, so both steps are reachable from the start and
 * the stepper works as a pair of tabs.
 *
 * The caller mounts this per target (keyed), so the form seeds once and there
 * is no reset to keep in step with the fields.
 */
export default function WorkspaceDialog({ workspace = null, onOpenChange, onSubmit }) {
  const editing = Boolean(workspace);
  const form = useWorkspaceForm(workspace);
  const onDetails = form.step === WORKSPACE_DIALOG_STEP.details;
  const activeIndex = WORKSPACE_DIALOG_STEPS.findIndex((entry) => entry.id === form.step);

  const submit = () => {
    if (!form.nameValid) {
      form.goNext();
      return;
    }
    onSubmit(form.buildWorkspace());
    onOpenChange(false);
  };

  return (
    <Modal open onOpenChange={onOpenChange}>
      <ModalContent
        title={editing ? WORKSPACE_DIALOG_COPY.editTitle : WORKSPACE_DIALOG_COPY.title}
        description={
          editing ? WORKSPACE_DIALOG_COPY.editBlurb : WORKSPACE_DIALOG_STEPS[activeIndex].blurb
        }
        size={onDetails ? 'md' : 'lg'}
      >
        {/* Steps you can reach are buttons, so the stepper doubles as navigation. */}
        <nav className={styles.stepper} aria-label="Workspace steps">
          {WORKSPACE_DIALOG_STEPS.map((entry, index) => {
            const state = index === activeIndex ? 'current' : index < activeIndex ? 'done' : 'todo';
            const reachable = editing || state === 'done';
            return (
              <Fragment key={entry.id}>
                {index > 0 && (
                  <span className={styles.connector} data-filled={index <= activeIndex} />
                )}
                <button
                  type="button"
                  className={styles.step}
                  data-state={state}
                  disabled={state === 'current' || !reachable}
                  onClick={() => form.goTo(entry.id)}
                  aria-current={state === 'current' ? 'step' : undefined}
                >
                  <span className={styles.disc}>
                    {state === 'done' && !editing ? (
                      <Icon name="check" size={11} strokeWidth={2.4} />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className={styles.stepText}>
                    <span className={styles.stepLabel}>{entry.label}</span>
                    <span className={styles.stepCaption}>{entry.caption}</span>
                  </span>
                </button>
              </Fragment>
            );
          })}
        </nav>

        <ModalBody
          flush={!onDetails}
          className={onDetails ? styles.detailsBody : styles.importBody}
        >
          {onDetails ? (
            <DetailsStep
              details={form.details}
              setField={form.setField}
              showNameError={form.showNameError}
              showIntro={!editing}
            />
          ) : (
            <ImportStep
              query={form.query}
              setQuery={form.setQuery}
              visible={form.visible}
              selection={form.selection}
              allVisibleSelected={form.allVisibleSelected}
              toggleAllVisible={form.toggleAllVisible}
              totalCount={form.totalCount}
            />
          )}
        </ModalBody>

        <ModalFooter>
          {!onDetails && (
            <Button variant="ghost" iconLeft="arrowLeft" onClick={form.goBack}>
              Back
            </Button>
          )}
          <div className={styles.spacer} />
          <span className={styles.footerSummary}>
            {form.selection.count > 0
              ? `${form.selection.count} to import`
              : 'No workspaces imported'}
          </span>
          {onDetails && (
            <Button variant="secondary" iconRight="arrowRight" onClick={form.goNext}>
              {editing ? WORKSPACE_DIALOG_COPY.goToImportEdit : WORKSPACE_DIALOG_COPY.goToImport}
            </Button>
          )}
          <Button variant="primary" onClick={submit}>
            {editing ? WORKSPACE_DIALOG_COPY.submitEdit : WORKSPACE_DIALOG_COPY.submit}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

WorkspaceDialog.propTypes = {
  workspace: PropTypes.shape({ id: PropTypes.string.isRequired }),
  onOpenChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
