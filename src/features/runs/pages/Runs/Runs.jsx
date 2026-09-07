import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import { PageBody } from '@/components/layout/AppShell';
import PageHeader from '@/components/layout/PageHeader';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import SegmentedControl from '@/components/ui/SegmentedControl';
import PipelineTrack from '@/features/runs/components/PipelineTrack';
import { DataTable, DataTableBody, DataTableHead, DataTableRow } from '@/components/ui/DataTable';
import { RUN_COLUMNS, RUN_FILTERS, RUN_STATUS, RUN_STATUS_META } from '@/features/runs/constants';
import { TONE } from '@/config/constants/common';
import { PIPELINE_STAGES, describeStages } from '@/features/runs/pipeline';
import { RUNS } from '@/features/runs/mocks';
import { useWorkspace } from '@/features/workspaces';
import { buildPath } from '@/routes/paths';
import styles from './Runs.module.css';

/** Row rail, status badge and timestamp all take the run state's colour. */
const EDGE_CLASS = {
  warn: styles.edgeWarn,
  info: styles.edgeInfo,
  danger: styles.edgeDanger,
};

const BADGE_CLASS = {
  warn: styles.badgeWarn,
  info: styles.badgeInfo,
  ok: styles.badgeOk,
  danger: styles.badgeDanger,
};

const META_CLASS = {
  warn: styles.metaWarn,
  info: styles.metaInfo,
  ok: styles.metaOk,
  danger: styles.metaDanger,
};

export default function Runs() {
  const navigate = useNavigate();
  const { workspace, workspaceId } = useWorkspace();
  const [filter, setFilter] = useState('all');

  const counts = useMemo(
    () =>
      RUN_FILTERS.reduce((acc, option) => {
        acc[option.id] =
          option.id === 'all' ? RUNS.length : RUNS.filter((run) => run.status === option.id).length;
        return acc;
      }, {}),
    [],
  );

  const visible = useMemo(
    () => (filter === 'all' ? RUNS : RUNS.filter((run) => run.status === filter)),
    [filter],
  );

  /**
   * Where a row leads is whatever its status action promises: a gate opens its
   * review, a finished run opens the graph it built, anything else opens the run.
   */
  const openRun = (run) => {
    if (run.status === RUN_STATUS.needsReview) {
      const stage = PIPELINE_STAGES.find((item) => item.id === run.stage);
      if (stage?.route) {
        navigate(buildPath[stage.route](workspaceId, run.id));
        return;
      }
    }
    if (run.output) {
      navigate(buildPath.runGraph(workspaceId, run.id));
      return;
    }
    navigate(buildPath.runDetail(workspaceId, run.id));
  };

  return (
    <>
      <TopBar
        crumbs={[{ label: workspace.name }, { label: 'Runs' }]}
        actions={
          <Button
            variant="primary"
            iconLeft="plus"
            onClick={() => navigate(buildPath.newRun(workspaceId))}
          >
            New extraction
          </Button>
        }
      />

      <PageBody>
        <PageHeader
          title="Runs"
          subtitle="Extractions run in the background and hold at their review gates. Several can be in flight at once."
        />

        <div className={styles.controls}>
          <SegmentedControl
            options={RUN_FILTERS.map((option) => ({ ...option, count: counts[option.id] }))}
            value={filter}
            onChange={setFilter}
            ariaLabel="Filter runs by status"
          />
          <div className={styles.spacer} />
          <span className={styles.count}>
            Showing {visible.length} of {RUNS.length}
          </span>
        </div>

        <DataTable>
          <DataTableHead columns={RUN_COLUMNS} compact />
          <DataTableBody>
            {visible.map((run) => {
              const meta = RUN_STATUS_META[run.status];
              const stages = describeStages(run.stage, run.status);

              return (
                <DataTableRow
                  key={run.id}
                  columns={RUN_COLUMNS}
                  height="72px"
                  className={[styles.runRow, meta.edge ? EDGE_CLASS[meta.tone] : '']
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className={styles.runCell}>
                    <span
                      className={[styles.runBadge, BADGE_CLASS[meta.tone]]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <Icon
                        name={meta.icon}
                        size={13}
                        className={meta.spinner ? styles.spin : undefined}
                      />
                    </span>
                    <div>
                      <div className={styles.runId}>{run.id}</div>
                      <div
                        className={[styles.runMeta, META_CLASS[meta.tone]]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <Icon name="clock" size={11} />
                        {run.startedAt}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className={styles.sources}>{run.sources}</div>
                    <div className={styles.strategy}>
                      <Chip tone={TONE.neutral}>{run.strategy}</Chip>
                    </div>
                  </div>
                  <div className={styles.pipelineCell}>
                    <PipelineTrack
                      stages={stages}
                      note={run.stageNote}
                      noteTone={meta.tone}
                      noteIcon={meta.icon}
                    />
                  </div>
                  <div>
                    <Chip
                      tone={meta.tone}
                      size="lg"
                      dot={!meta.spinner}
                      icon={
                        meta.spinner ? (
                          <Icon
                            name="refresh"
                            size={11}
                            strokeWidth={1.8}
                            className={styles.spin}
                          />
                        ) : null
                      }
                    >
                      {meta.label}
                    </Chip>
                  </div>
                  <div className={styles.actionCell}>
                    <Button
                      variant={meta.primary ? 'primary' : 'secondary'}
                      size="sm"
                      iconRight={meta.primary ? 'arrowRight' : undefined}
                      onClick={() => openRun(run)}
                    >
                      {meta.action}
                    </Button>
                  </div>
                </DataTableRow>
              );
            })}
          </DataTableBody>
        </DataTable>
      </PageBody>
    </>
  );
}
