import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../components/layout/TopBar';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import Chip from '../../components/ui/Chip';
import SearchInput from '../../components/ui/SearchInput';
import SegmentedControl from '../../components/ui/SegmentedControl';
import { Banner, CodeBlock, SectionLabel } from '../../components/ui/Surfaces';
import StageStepper from '../../components/pipeline/StageStepper';
import DecisionActions from '../../components/review/DecisionActions';
import {
  GateDetail,
  GateDetailBody,
  GateFooter,
  GateList,
  GateListBody,
  GateShell,
  GateSplit,
  GateToolbar,
  ToolbarSpacer,
} from '../../components/review/ReviewGate';
import { DECISION } from '../../config/constants/common';
import {
  COVERAGE,
  COVERAGE_FILTERS,
  COVERAGE_TONES,
  QUESTION_ACTION_LABELS,
  REQUIREMENT_STATUS,
  VERDICTS,
} from '../../config/constants/questions';
import { describeStages } from '../../config/constants/pipeline';
import { INITIAL_QUESTION_DECISIONS, QUESTIONS } from '../../mocks/questions';
import { useDecisions } from '../../hooks/useDecisions';
import { useWorkspace } from '../../hooks/useWorkspace';
import { buildPath } from '../../routes/paths';
import gateStyles from '../../components/review/ReviewGate.module.css';
import styles from './ReviewQuestions.module.css';

export default function ReviewQuestions() {
  const navigate = useNavigate();
  const { workspaceId } = useWorkspace();
  const { runId = 'R-2416' } = useParams();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState('q4');

  const decisions = useDecisions(INITIAL_QUESTION_DECISIONS);

  const counts = useMemo(
    () =>
      COVERAGE_FILTERS.reduce((acc, option) => {
        acc[option.id] =
          option.id === 'all'
            ? QUESTIONS.length
            : QUESTIONS.filter((question) => question.coverage === option.id).length;
        return acc;
      }, {}),
    [],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return QUESTIONS.filter((question) => {
      if (needle && !question.text.toLowerCase().includes(needle)) return false;
      if (filter !== 'all' && question.coverage !== filter) return false;
      return true;
    });
  }, [query, filter]);

  const allIds = useMemo(() => QUESTIONS.map((question) => question.id), []);
  const tally = decisions.tally(allIds);

  const question = QUESTIONS.find((item) => item.id === selectedId) ?? QUESTIONS[0];
  const verdict = VERDICTS[question.coverage];
  const currentDecision = decisions.decisionFor(question.id);

  // Questions the reviewer kept that the model still cannot answer — the gap this gate exists to surface.
  const gaps = QUESTIONS.filter(
    (item) => decisions.decisionFor(item.id) === DECISION.approved && item.coverage !== COVERAGE.covered,
  ).length;

  const stages = describeStages('questions', 'needs-review');

  return (
    <>
      <TopBar
        crumbs={[
          { label: 'Runs', to: buildPath.runs(workspaceId) },
          { label: runId, mono: true, to: buildPath.runDetail(workspaceId, runId) },
          { label: 'Competency questions' },
        ]}
      />

      <StageStepper stages={stages} variant="compact" />

      <GateShell>
        <GateToolbar>
          <SegmentedControl
            options={COVERAGE_FILTERS.map((option) => ({ ...option, count: counts[option.id] }))}
            value={filter}
            onChange={setFilter}
            size="lg"
            ariaLabel="Filter by coverage"
          />
          <SearchInput value={query} onChange={setQuery} placeholder="Filter questions" width={210} subtle />
          <ToolbarSpacer />
          <Button variant="ghost" iconLeft="plus">
            Write your own question
          </Button>
        </GateToolbar>

        <GateSplit>
          <GateList width={468}>
            <GateListBody>
              {visible.map((item) => {
                const decision = decisions.decisionFor(item.id);
                const dropped = decision === DECISION.rejected;
                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    className={[styles.item, selectedId === item.id ? styles.selected : '']
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setSelectedId(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedId(item.id);
                      }
                    }}
                  >
                    <span className={styles.number}>{item.number}</span>
                    <div className={styles.body}>
                      <div className={[styles.text, dropped ? styles.dropped : ''].filter(Boolean).join(' ')}>
                        {item.text}
                      </div>
                      <div className={styles.tags}>
                        <Chip tone="neutral">{item.theme.toUpperCase()}</Chip>
                        <Chip tone={COVERAGE_TONES[item.coverage]}>{item.coverage}</Chip>
                      </div>
                    </div>
                    <span className={styles.mark}>
                      {decision === DECISION.approved && (
                        <Icon name="check" size={14} strokeWidth={2.2} className={styles.markKept} />
                      )}
                      {dropped && <Icon name="close" size={13} strokeWidth={2} className={styles.markDropped} />}
                    </span>
                  </div>
                );
              })}
            </GateListBody>
          </GateList>

          <GateDetail>
            <header className={gateStyles.detailHead}>
              <div className={gateStyles.detailHeadBody}>
                <div className={styles.eyebrow}>
                  Question {question.number} · {question.theme}
                </div>
                <p className={styles.question}>{question.text}</p>
                <div className={styles.origin}>
                  <Icon name={question.originIcon} size={13} />
                  {question.origin}
                </div>
              </div>
              <div className={gateStyles.detailActions}>
                <DecisionActions
                  decision={currentDecision}
                  onApprove={() => decisions.approve(question.id)}
                  onReject={() => decisions.reject(question.id)}
                  onEdit={() => {}}
                  labels={QUESTION_ACTION_LABELS}
                />
              </div>
            </header>

            <GateDetailBody>
              <Banner tone={verdict.tone} icon={verdict.icon} title={verdict.title} note={verdict.note} />

              <div>
                <SectionLabel>The ontology must carry</SectionLabel>
                <div className={styles.requires}>
                  {question.requires.map((requirement) => {
                    const status = REQUIREMENT_STATUS[requirement.status];
                    return (
                      <div key={requirement.id} className={styles.requirement}>
                        <Icon
                          name={requirement.kind === 'class' ? 'node' : 'link'}
                          size={14}
                          style={{ color: 'var(--text-5)' }}
                        />
                        <span className={styles.requirementName}>{requirement.name}</span>
                        <span className={styles.requirementKind}>{requirement.kind}</span>
                        <span>
                          <Chip tone={status.tone}>{status.label}</Chip>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <SectionLabel note="runs against the knowledge graph once it is built">
                  Generated query
                </SectionLabel>
                <CodeBlock className="mono" style={{ marginTop: 9 }}>
                  {question.query}
                </CodeBlock>
              </div>
            </GateDetailBody>
          </GateDetail>
        </GateSplit>

        <GateFooter
          tally={tally}
          undecidedWarning={
            gaps > 0 ? `${gaps} kept questions the current ontology cannot fully answer` : null
          }
          primaryLabel="Build the ontology"
          onPrimary={() => navigate(buildPath.ontology(workspaceId))}
          secondary={
            <Button variant="secondary" size="lg" onClick={() => navigate(buildPath.reviewConcepts(workspaceId, runId))}>
              Back to concepts
            </Button>
          }
        />
      </GateShell>
    </>
  );
}
