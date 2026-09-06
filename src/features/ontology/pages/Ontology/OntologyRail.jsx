import ProgressBar from '@/components/ui/ProgressBar';
import { Banner, SectionLabel } from '@/components/ui/Surfaces';
import { ONTOLOGY_STATS, QUESTION_COVERAGE, VALIDATION_FINDINGS } from '@/features/ontology/mocks';
import styles from './Ontology.module.css';

/** Whole-ontology figures: size, question coverage, and what fails validation. */
export default function OntologyRail() {
  const coveragePercent = Math.round(
    (QUESTION_COVERAGE.answerable / QUESTION_COVERAGE.total) * 100,
  );

  return (
    <aside className={styles.rail}>
      <div className={styles.railBlock}>
        <SectionLabel>Ontology</SectionLabel>
        <div className={styles.statPairGrid}>
          {ONTOLOGY_STATS.map((stat) => (
            <div key={stat.id}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.railBlock}>
        <div className={styles.coverageRow}>
          <SectionLabel>Question coverage</SectionLabel>
          <span className={styles.coverageValue}>
            {QUESTION_COVERAGE.answerable}/{QUESTION_COVERAGE.total}
          </span>
        </div>
        <ProgressBar
          total={QUESTION_COVERAGE.total}
          label={`${coveragePercent}% answerable`}
          segments={[
            { id: 'answerable', value: QUESTION_COVERAGE.answerable, tone: 'ok' },
            { id: 'partial', value: QUESTION_COVERAGE.partial, tone: 'warn' },
          ]}
        />
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={`${styles.legendSwatch} ${styles.legendSwatchOk}`} />
            {QUESTION_COVERAGE.answerable} answerable
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendSwatch} ${styles.legendSwatchWarn}`} />
            {QUESTION_COVERAGE.partial} partial
          </span>
        </div>
      </div>

      <div className={styles.validation}>
        <SectionLabel>Validation</SectionLabel>
        <div className={styles.validationList}>
          {VALIDATION_FINDINGS.map((finding) => (
            <Banner
              key={finding.id}
              tone={finding.tone}
              title={finding.title}
              note={finding.detail}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
