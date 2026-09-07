import PropTypes from 'prop-types';
import Field from '@/components/ui/Field';
import Icon from '@/components/ui/Icon';
import { WORKSPACE_DIALOG_COPY } from '@/features/workspaces/constants';
import styles from './WorkspaceDialog.module.css';

/** A raised card of related fields. Two of these beat one undifferentiated stack. */
function FieldGroup({ title, note, children }) {
  return (
    <section className={styles.group}>
      <header className={styles.groupHead}>
        <h3 className={styles.groupTitle}>{title}</h3>
        <p className={styles.groupNote}>{note}</p>
      </header>
      <div className={styles.groupFields}>{children}</div>
    </section>
  );
}

FieldGroup.propTypes = {
  title: PropTypes.string.isRequired,
  note: PropTypes.string.isRequired,
  children: PropTypes.node,
};

/**
 * Step 1. The callout above the fields is the only place the whole flow is
 * explained — that both steps exist, and that the second one can be skipped.
 * It is creation-only: when editing, the workspace already exists and the
 * explanation is just noise above the fields someone came to change.
 */
export default function DetailsStep({ details, setField, showNameError, showIntro }) {
  return (
    <div className={styles.details}>
      {showIntro && (
        <aside className={styles.intro}>
          <span className={styles.introIcon}>
            <Icon name="info" size={14} />
          </span>
          <div className={styles.introText}>
            <p className={styles.introTitle}>{WORKSPACE_DIALOG_COPY.introTitle}</p>
            <p className={styles.introBody}>{WORKSPACE_DIALOG_COPY.introBody}</p>
            <p className={styles.introNote}>
              <Icon name="check" size={12} strokeWidth={2.4} className={styles.introNoteIcon} />
              {WORKSPACE_DIALOG_COPY.introNote}
            </p>
          </div>
        </aside>
      )}

      <FieldGroup
        title={WORKSPACE_DIALOG_COPY.groupBasics}
        note={WORKSPACE_DIALOG_COPY.groupBasicsNote}
      >
        <div className={styles.formRow}>
          <Field
            label="Workspace name"
            value={details.name}
            onChange={(value) => setField('name', value)}
            placeholder={WORKSPACE_DIALOG_COPY.namePlaceholder}
            hint={WORKSPACE_DIALOG_COPY.nameHint}
            error={showNameError ? WORKSPACE_DIALOG_COPY.nameRequired : undefined}
            maxLength={60}
          />
          <Field
            label="Business domain"
            value={details.businessDomain}
            onChange={(value) => setField('businessDomain', value)}
            placeholder={WORKSPACE_DIALOG_COPY.domainPlaceholder}
            hint={WORKSPACE_DIALOG_COPY.domainHint}
            optional
            maxLength={60}
          />
        </div>

        <Field
          label="Description"
          value={details.description}
          onChange={(value) => setField('description', value)}
          placeholder={WORKSPACE_DIALOG_COPY.descriptionPlaceholder}
          optional
          multiline
          rows={2}
          maxLength={280}
        />
      </FieldGroup>

      <FieldGroup
        title={WORKSPACE_DIALOG_COPY.groupContext}
        note={WORKSPACE_DIALOG_COPY.groupContextNote}
      >
        <Field
          label="Business context"
          value={details.businessContext}
          onChange={(value) => setField('businessContext', value)}
          placeholder={WORKSPACE_DIALOG_COPY.contextPlaceholder}
          optional
          multiline
          rows={3}
        />

        <Field
          label="Modelling guidance"
          value={details.modellingGuidance}
          onChange={(value) => setField('modellingGuidance', value)}
          placeholder={WORKSPACE_DIALOG_COPY.guidancePlaceholder}
          optional
          multiline
          rows={3}
        />
      </FieldGroup>
    </div>
  );
}

DetailsStep.propTypes = {
  details: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    businessDomain: PropTypes.string.isRequired,
    businessContext: PropTypes.string.isRequired,
    modellingGuidance: PropTypes.string.isRequired,
  }).isRequired,
  setField: PropTypes.func.isRequired,
  showNameError: PropTypes.bool.isRequired,
  showIntro: PropTypes.bool.isRequired,
};
