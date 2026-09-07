import {
  LANDING_COPY,
  ORBIT_CYCLE_MS,
  ORBIT_EDGES,
  ORBIT_STAGES,
  ORBIT_VIEWBOX,
} from '@/features/landing/constants';
import useOrbitCycle from './useOrbitCycle';
import styles from './GraphOrbit.module.css';

const STAGE_BY_ID = Object.fromEntries(ORBIT_STAGES.map((stage) => [stage.id, stage]));

/** How far a label sits from the centre of its node, on whichever side it takes. */
const LABEL_OFFSET = { above: -24, below: 30 };

const edgePath = ({ from, to }) =>
  `M${STAGE_BY_ID[from].x} ${STAGE_BY_ID[from].y} L${STAGE_BY_ID[to].x} ${STAGE_BY_ID[to].y}`;

/**
 * The hero diagram: the extraction pipeline as a small graph that walks itself.
 *
 * One stage is active at a time; the edge from it to the stage it feeds is the
 * one that flows. Nodes are drawn after edges and filled opaque, so a line
 * running centre-to-centre disappears under the circle it arrives at.
 */
export default function GraphOrbit() {
  const activeIndex = useOrbitCycle(ORBIT_STAGES.length, ORBIT_CYCLE_MS);
  const active = ORBIT_STAGES[activeIndex];
  const next = ORBIT_STAGES[(activeIndex + 1) % ORBIT_STAGES.length];

  const stageClass = (stage) => {
    if (stage.id === active.id) return styles.nodeActive;
    if (stage.id === next.id) return styles.nodeNext;
    return '';
  };

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.canvas}
        viewBox={`0 0 ${ORBIT_VIEWBOX.width} ${ORBIT_VIEWBOX.height}`}
        role="img"
        aria-label={LANDING_COPY.diagramLabel}
      >
        {ORBIT_EDGES.map((edge) => {
          const live = edge.from === active.id && edge.to === next.id;
          return (
            <path
              key={`${edge.from}-${edge.to}`}
              d={edgePath(edge)}
              className={[styles.edge, live ? styles.edgeLive : ''].filter(Boolean).join(' ')}
            />
          );
        })}

        {ORBIT_STAGES.map((stage) => (
          <g key={stage.id} className={[styles.node, stageClass(stage)].filter(Boolean).join(' ')}>
            <circle className={styles.halo} cx={stage.x} cy={stage.y} r={22} />
            <circle className={styles.dot} cx={stage.x} cy={stage.y} r={9} />
            <text
              className={styles.label}
              x={stage.x}
              y={stage.y + (stage.labelBelow ? LABEL_OFFSET.below : LABEL_OFFSET.above)}
              textAnchor="middle"
            >
              {stage.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Remounting on the stage id replays the entry animation on every step. */}
      <figcaption key={active.id} className={styles.caption}>
        {active.note}
      </figcaption>
    </figure>
  );
}
