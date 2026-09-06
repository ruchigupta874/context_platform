import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import { PageBody } from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import Toggle from '@/components/ui/Toggle';
import { Panel, SectionLabel, StatPairs } from '@/components/ui/Surfaces';
import { DEFAULT_STRATEGY, STRATEGIES, estimateMinutes } from '@/features/runs/constants';
import { PIPELINE_STAGES } from '@/features/runs/pipeline';
import {
  DEFAULT_DOCUMENT_SELECTION,
  DEFAULT_TABLE_SELECTION,
  DOCUMENTS,
  TABLES,
  SOURCE_KIND,
} from '@/features/sources';
import { useWorkspace } from '@/features/workspaces';
import { buildPath } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import styles from './NewRun.module.css';

const DEFAULT_GUIDANCE =
  'Use singular CamelCase class names. Treat "party" and "account holder" as Customer. Do not create separate classes for soft-deleted rows.';

export default function NewRun() {
  const navigate = useNavigate();
  const { workspace, workspaceId } = useWorkspace();

  const [strategy, setStrategy] = useState(DEFAULT_STRATEGY);
  const [guidance, setGuidance] = useState(DEFAULT_GUIDANCE);
  const [questionGate, setQuestionGate] = useState(true);
  const [removed, setRemoved] = useState([]);

  const sources = useMemo(() => {
    const tables = TABLES.filter((t) => DEFAULT_TABLE_SELECTION.includes(t.id)).map((t) => ({
      id: t.id,
      label: t.name,
      kind: 'table',
    }));
    const docs = DOCUMENTS.filter((d) => DEFAULT_DOCUMENT_SELECTION.includes(d.id)).map((d) => ({
      id: d.id,
      label: d.name,
      kind: 'document',
    }));
    return [...tables, ...docs].filter((source) => !removed.includes(source.id));
  }, [removed]);

  const tableCount = sources.filter((s) => s.kind === SOURCE_KIND.table).length;
  const docCount = sources.length - tableCount;
  const minutes = estimateMinutes({ tableCount, docCount, strategy });

  // Gates are derived from the pipeline definition plus the one toggle the user controls.
  const stages = PIPELINE_STAGES.map((stage) => {
    const isGate = stage.gate && (stage.id !== 'questions' || questionGate);
    return { ...stage, active: isGate };
  });
  const gateCount = stages.filter((s) => s.active).length;

  const summary = [
    { key: 'Sources', value: `${tableCount} tables + ${docCount} docs` },
    { key: 'Strategy', value: STRATEGIES.find((s) => s.id === strategy).name },
    { key: 'Review gates', value: pluralize(gateCount, 'gate') },
    { key: 'Est. duration', value: `~${minutes} min to first gate` },
  ];

  return (
    <>
      <TopBar
        crumbs={[
          { label: workspace.name },
          { label: 'Runs', to: buildPath.runs(workspaceId) },
          { label: 'New extraction' },
        ]}
      />

      <PageBody scroll>
        <div className={styles.layout}>
          <div className={styles.main}>
            <PageHeader
              title="New extraction"
              subtitle="Choose what to read and where the run should stop for your approval."
            />

            <Panel className={styles.section}>
              <div className={styles.sectionHead}>
                <span className={styles.step}>1</span>
                <span className={styles.sectionTitle}>Sources</span>
                <div className={styles.spacer} />
                <span className={styles.sectionMeta}>
                  {tableCount} tables, {docCount} documents
                </span>
              </div>
              <div className={styles.chips}>
                {sources.map((source) => (
                  <span key={source.id} className={styles.chip}>
                    <Icon
                      name={source.kind === SOURCE_KIND.table ? 'database' : 'doc'}
                      size={13}
                      className={
                        source.kind === SOURCE_KIND.table
                          ? styles.chipIconTable
                          : styles.chipIconDocument
                      }
                    />
                    {source.label}
                    <button
                      type="button"
                      className={styles.chipRemove}
                      aria-label={`Remove ${source.label}`}
                      onClick={() => setRemoved((prev) => [...prev, source.id])}
                    >
                      <Icon name="close" size={11} strokeWidth={1.8} />
                    </button>
                  </span>
                ))}
                <Button variant="ghost" size="sm" iconLeft="plus">
                  Add sources
                </Button>
              </div>
            </Panel>

            <Panel className={styles.section}>
              <div className={styles.sectionHead}>
                <span className={styles.step}>2</span>
                <span className={styles.sectionTitle}>Extraction strategy</span>
              </div>
              <div
                className={styles.strategyGrid}
                role="radiogroup"
                aria-label="Extraction strategy"
              >
                {STRATEGIES.map((option) => {
                  const active = strategy === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={[styles.strategy, active ? styles.strategyActive : '']
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => setStrategy(option.id)}
                    >
                      <span className={styles.strategyTop}>
                        <span
                          className={[styles.radio, active ? styles.radioActive : '']
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <span className={styles.radioDot} />
                        </span>
                        <span className={styles.strategyName}>{option.name}</span>
                      </span>
                      <p className={styles.strategyBlurb}>{option.blurb}</p>
                    </button>
                  );
                })}
              </div>
            </Panel>

            <Panel className={styles.section}>
              <div className={`${styles.sectionHead} ${styles.sectionHeadTight}`}>
                <span className={styles.step}>3</span>
                <span className={styles.sectionTitle}>Domain guidance</span>
                <span className={styles.optional}>optional</span>
              </div>
              <p className={styles.sectionNote}>
                Naming conventions, entities to avoid, or terms your business insists on. This
                steers concept naming more than anything else here.
              </p>
              <textarea
                className={styles.textarea}
                value={guidance}
                onChange={(event) => setGuidance(event.target.value)}
                aria-label="Domain guidance"
              />
              <div className={styles.seedRow}>
                <span>Seed from existing ontology</span>
                <span className={styles.seedPicker}>
                  ContactCentre v7
                  <Icon name="chevronDown" size={12} className={styles.mutedIcon} />
                </span>
              </div>
            </Panel>

            <Panel className={styles.section}>
              <div className={`${styles.sectionHead} ${styles.sectionHeadTight}`}>
                <span className={styles.step}>4</span>
                <span className={styles.sectionTitle}>Review gates</span>
              </div>
              <p className={styles.sectionNote}>
                The run pauses at each gate you keep on and waits for a decision. Nothing downstream
                is built until you approve.
              </p>
              <div className={styles.gates}>
                <div className={styles.gate}>
                  <div className={styles.gateBody}>
                    <div className={styles.gateName}>
                      Concepts &amp; relationships
                      <Chip tone="neutral">REQUIRED</Chip>
                    </div>
                    <div className={styles.gateDesc}>
                      Approve the classes and the links between them before anything is built on
                      top.
                    </div>
                  </div>
                  <Toggle checked disabled size="lg" />
                </div>
                <div className={styles.gate}>
                  <div className={styles.gateBody}>
                    <div className={styles.gateName}>
                      Competency questions
                      <Chip tone={questionGate ? 'ok' : 'neutral'}>
                        {questionGate ? 'ON' : 'OFF'}
                      </Chip>
                    </div>
                    <div className={styles.gateDesc}>
                      Approve the questions the ontology must be able to answer. Turn off to accept
                      all generated questions.
                    </div>
                  </div>
                  <Toggle checked={questionGate} onChange={setQuestionGate} size="lg" />
                </div>
              </div>
            </Panel>
          </div>

          <Panel className={styles.rail}>
            <SectionLabel>Run summary</SectionLabel>
            <StatPairs pairs={summary} keyWidth={92} />
            <div className={styles.divider} />

            <div>
              <SectionLabel>Stages</SectionLabel>
              <div className={styles.stageList}>
                {stages.map((stage, index) => (
                  <div key={stage.id} className={styles.stageItem}>
                    <div className={styles.stageRail}>
                      <span
                        className={[styles.stageDot, stage.active ? styles.stageDotGate : '']
                          .filter(Boolean)
                          .join(' ')}
                      />
                      {index < stages.length - 1 && <span className={styles.stageLine} />}
                    </div>
                    <div className={styles.stageBody}>
                      <div className={styles.stageName}>{stage.label}</div>
                      <div
                        className={[styles.stageMeta, stage.active ? styles.stageMetaGate : '']
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {stage.active ? 'Pauses for review' : 'Automatic'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              iconLeft="play"
              block
              disabled={sources.length === 0}
              onClick={() => navigate(buildPath.runs(workspaceId))}
            >
              Run extraction
            </Button>
            <p className={styles.railNote}>
              Runs in the background. Leave this page, start another run, come back when a gate
              needs you.
            </p>
          </Panel>
        </div>
      </PageBody>
    </>
  );
}
