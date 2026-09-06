import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import { PageBody } from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import Checkbox from '@/components/ui/Checkbox';
import Toggle from '@/components/ui/Toggle';
import SegmentedControl from '@/components/ui/SegmentedControl';
import { EmptyState, Panel } from '@/components/ui/Surfaces';
import { DECISION } from '@/config/constants/common';
import { COVERAGE_TONES } from '@/config/constants/questions';
import { useReviewDecisions } from '@/hooks/useReviewDecisions';
import { useSelection } from '@/hooks/useSelection';
import { useWorkspace } from '@/hooks/useWorkspace';
import { buildPath } from '@/routes/paths';
import { confidenceTone, pluralize } from '@/utils/format';
import { QUEUE_GROUPS, QUEUE_ITEMS, QUEUE_KINDS } from './queue';
import styles from './ReviewQueue.module.css';

const KIND_ICON = { concept: 'node', relation: 'link', question: 'help' };

export default function ReviewQueue() {
  const navigate = useNavigate();
  const { workspace, workspaceId } = useWorkspace();
  const decisions = useReviewDecisions();
  const checks = useSelection([]);

  const [kind, setKind] = useState('all');
  const [decidableOnly, setDecidableOnly] = useState(false);

  const undecided = useMemo(
    () => QUEUE_ITEMS.filter((item) => !decisions.decisionFor(item.id)),
    [decisions],
  );

  const matches = (item) =>
    (kind === 'all' || item.kind === kind) && (!decidableOnly || item.decidable);

  const groups = QUEUE_GROUPS.map((group) => ({
    ...group,
    visible: group.items.filter((item) => !decisions.decisionFor(item.id) && matches(item)),
  })).filter((group) => group.visible.length > 0);

  const kindCounts = useMemo(
    () =>
      QUEUE_KINDS.reduce((acc, option) => {
        acc[option.id] =
          option.id === 'all'
            ? undecided.length
            : undecided.filter((item) => item.kind === option.id).length;
        return acc;
      }, {}),
    [undecided],
  );

  // Only what is both selected and still on screen can be acted on.
  const selectableIds = groups.flatMap((group) =>
    group.visible.filter((item) => item.decidable).map((item) => item.id),
  );
  const selectedIds = checks.selectedIds.filter((id) => selectableIds.includes(id));

  const decide = (decision) => {
    decisions.decideMany(selectedIds, decision);
    checks.clear();
  };

  const openGate = (group) => navigate(buildPath[group.route](workspaceId, group.runId));

  const runCount = new Set(undecided.map((item) => item.runId)).size;

  return (
    <>
      <TopBar
        crumbs={[{ label: workspace.name }, { label: 'Review queue' }]}
        note={`${pluralize(undecided.length, 'item')} across ${pluralize(runCount, 'run')}`}
      />

      <PageBody>
        <PageHeader
          title="Review queue"
          subtitle="Every decision waiting on you, across every run. Clear the confident ones here; the rest open in the gate that can show you why they are uncertain."
        />

        <div className={styles.controls}>
          <SegmentedControl
            options={QUEUE_KINDS.map((option) => ({ ...option, count: kindCounts[option.id] }))}
            value={kind}
            onChange={setKind}
            ariaLabel="Filter by item type"
          />
          <div className={styles.spacer} />
          <Toggle checked={decidableOnly} onChange={setDecidableOnly} label="Decidable here only" />
        </div>

        <div className={styles.scroll}>
          {groups.length === 0 ? (
            <Panel className={styles.emptyPanel}>
              <EmptyState
                icon="check"
                title="Nothing waiting on you"
                hint="Every proposal in this workspace has been approved or rejected."
                action={
                  <Button
                    variant="secondary"
                    iconRight="arrowRight"
                    onClick={() => navigate(buildPath.runs(workspaceId))}
                  >
                    Back to runs
                  </Button>
                }
              />
            </Panel>
          ) : (
            groups.map((group) => {
              const groupDecidable = group.visible.filter((item) => item.decidable);
              const allChecked =
                groupDecidable.length > 0 &&
                groupDecidable.every((item) => checks.isSelected(item.id));

              return (
                <Panel key={group.id} className={styles.group}>
                  <header className={styles.groupHead}>
                    <Checkbox
                      checked={allChecked}
                      onChange={(next) =>
                        checks.toggleMany(
                          groupDecidable.map((item) => item.id),
                          next,
                        )
                      }
                      label={`Select the confident items in ${group.label}`}
                    />
                    <span className={styles.groupRun}>{group.runId}</span>
                    <span className={styles.groupLabel}>{group.label}</span>
                    <span className={styles.groupCount}>
                      {pluralize(group.visible.length, 'item')}
                    </span>
                    <div className={styles.spacer} />
                    <Button
                      size="sm"
                      variant="secondary"
                      iconRight="arrowRight"
                      onClick={() => openGate(group)}
                    >
                      Open gate
                    </Button>
                  </header>

                  <ul className={styles.rows}>
                    {group.visible.map((item) => (
                      <li
                        key={item.id}
                        className={[styles.row, item.decidable ? '' : styles.rowLocked]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <Checkbox
                          size="sm"
                          checked={checks.isSelected(item.id)}
                          disabled={!item.decidable}
                          onChange={() => checks.toggle(item.id)}
                          label={`Select ${item.name}`}
                        />
                        <span className={styles.rowIcon}>
                          <Icon name={KIND_ICON[item.kind]} size={14} />
                        </span>
                        <span className={styles.rowScore}>
                          <Chip
                            tone={
                              item.score === null
                                ? COVERAGE_TONES[item.coverage]
                                : confidenceTone(item.score)
                            }
                            mono={item.score !== null}
                          >
                            {item.scoreLabel}
                          </Chip>
                        </span>
                        <span className={styles.rowName}>{item.name}</span>
                        <span className={styles.rowSub}>{item.sub}</span>
                        {item.decidable ? (
                          <span className={styles.rowNote} />
                        ) : (
                          <button
                            type="button"
                            className={styles.rowGateLink}
                            onClick={() => openGate(group)}
                          >
                            needs the gate
                            <Icon name="arrowRight" size={12} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </Panel>
              );
            })
          )}
        </div>

        {selectedIds.length > 0 && (
          <div className={styles.bar}>
            <span className={styles.barCount}>
              <strong>{selectedIds.length}</strong> selected
            </span>
            <span className={styles.barNote}>
              Only items the model is confident about can be decided from here.
            </span>
            <div className={styles.spacer} />
            <Button variant="secondary" onClick={() => checks.clear()}>
              Clear
            </Button>
            <Button variant="reject" iconLeft="close" onClick={() => decide(DECISION.rejected)}>
              Reject selected
            </Button>
            <Button variant="approve" iconLeft="check" onClick={() => decide(DECISION.approved)}>
              Approve selected
            </Button>
          </div>
        )}
      </PageBody>
    </>
  );
}
