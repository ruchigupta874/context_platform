import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import ProgressBar from '@/components/ui/ProgressBar';
import { Panel, PanelHeader } from '@/components/ui/Surfaces';
import { QUESTION_COVERAGE } from '@/features/ontology';
import { BUILT_BY_RUN } from '@/features/graph';
import { pluralize } from '@/utils/format';
import styles from '../Overview.module.css';

/**
 * How much of the approved question set this ontology can actually answer. The
 * unanswered count is stated outright rather than as a percentage — the gap is
 * the honest measure of a version.
 */
export default function CoveragePanel({ unanswered, onOpenOntology }) {
  return (
    <Panel>
      <PanelHeader title="Coverage" meta={pluralize(QUESTION_COVERAGE.total, 'question')} />
      <div className={styles.coverage}>
        <ProgressBar
          total={QUESTION_COVERAGE.total}
          label={`${QUESTION_COVERAGE.answerable} of ${QUESTION_COVERAGE.total} questions answerable`}
          segments={[
            { id: 'answerable', value: QUESTION_COVERAGE.answerable, tone: 'ok' },
            { id: 'partial', value: QUESTION_COVERAGE.partial, tone: 'warn' },
            { id: 'unanswered', value: unanswered, tone: 'danger' },
          ]}
        />
        <ul className={styles.legend}>
          <li>
            <span className={`${styles.key} ${styles.keyOk}`} />
            <span className={styles.legendValue}>{QUESTION_COVERAGE.answerable}</span> answerable
          </li>
          <li>
            <span className={`${styles.key} ${styles.keyWarn}`} />
            <span className={styles.legendValue}>{QUESTION_COVERAGE.partial}</span> partial
          </li>
          <li>
            <span className={`${styles.key} ${styles.keyDanger}`} />
            <span className={styles.legendValue}>{unanswered}</span> unanswered
          </li>
        </ul>
        <p className={styles.coverageNote}>
          {unanswered > 0
            ? `${pluralize(unanswered, 'question')} the ontology cannot answer yet. That gap is the honest measure of this version, not the percentage.`
            : 'Every approved question can be answered from the current ontology.'}
        </p>
        <button type="button" className={styles.panelLink} onClick={onOpenOntology}>
          See coverage in {BUILT_BY_RUN}
          <Icon name="arrowRight" size={13} />
        </button>
      </div>
    </Panel>
  );
}

CoveragePanel.propTypes = {
  unanswered: PropTypes.number.isRequired,
  onOpenOntology: PropTypes.func.isRequired,
};
