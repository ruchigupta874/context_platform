import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import { PageBody } from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import Toggle from '@/components/ui/Toggle';
import { Panel } from '@/components/ui/Surfaces';
import { STRATEGIES } from '@/features/runs/constants';
import { GATE_STAGES, OPTIONAL_GATE } from '@/features/runs/pipeline';
import { SOURCE_KIND } from '@/features/sources';
import { useWorkspace } from '@/features/workspaces';
import { buildPath } from '@/routes/paths';
import RunSummaryRail from './RunSummaryRail';
import { useNewRunForm } from './useNewRunForm';
import styles from './NewRun.module.css';

/** Configure an extraction: what to read, how hard to look, where to stop. */
export default function NewRun() {
  const navigate = useNavigate();
  const { workspace, workspaceId } = useWorkspace();
  const form = useNewRunForm();
  const {
    strategy,
    setStrategy,
    guidance,
    setGuidance,
    questionGate,
    setQuestionGate,
    setRemoved,
    sources,
    tableCount,
    docCount,
    stages,
    summary,
  } = form;

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
              {/* Derived from the pipeline, so adding or moving a gate never
                  leaves this list saying something the run will not do. */}
              <div className={styles.gates}>
                {GATE_STAGES.map((gate) => {
                  const optional = gate.id === OPTIONAL_GATE;
                  const on = optional ? questionGate : true;

                  return (
                    <div key={gate.id} className={styles.gate}>
                      <div className={styles.gateBody}>
                        <div className={styles.gateName}>
                          {gate.label}
                          <Chip tone={optional && on ? 'ok' : 'neutral'}>
                            {optional ? (on ? 'ON' : 'OFF') : 'REQUIRED'}
                          </Chip>
                        </div>
                        <div className={styles.gateDesc}>{gate.gateNote}</div>
                      </div>
                      <Toggle
                        checked={on}
                        disabled={!optional}
                        onChange={optional ? setQuestionGate : undefined}
                        size="lg"
                      />
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>
          <RunSummaryRail
            summary={summary}
            stages={stages}
            canRun={sources.length > 0}
            onRun={() => navigate(buildPath.runs(workspaceId))}
          />
        </div>
      </PageBody>
    </>
  );
}
