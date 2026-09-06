import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import { EDGE_LEGEND, ENTITY_COLORS, GRAPH_VIEWBOX } from '@/features/graph/constants';
import { ROOT_ENTITY } from '@/features/graph/mocks';
import styles from './KnowledgeGraph.module.css';

/** The SVG neighbourhood plus its toolbar and legend. */
export default function GraphCanvas({
  nodesById,
  visibleNodes,
  visibleEdges,
  neighbourIds,
  selected,
  onSelect,
  showLabels,
  totalNodes,
}) {
  return (
    <div className={styles.canvasColumn}>
      <div className={styles.canvasBar}>
        <span className={styles.canvasTitle}>
          Neighbourhood of{' '}
          <span className={styles.canvasTitleStrong}>{nodesById[ROOT_ENTITY].label}</span>
        </span>
        <span className={styles.canvasCount}>
          {visibleNodes.length} of {totalNodes} shown
        </span>
        <div className={styles.spacer} />
        <button type="button" className={styles.zoomButton} aria-label="Zoom out">
          <Icon name="minus" size={13} />
        </button>
        <button type="button" className={styles.zoomButton} aria-label="Zoom in">
          <Icon name="plus" size={13} />
        </button>
        <button type="button" className={styles.zoomButton} aria-label="Fit to view">
          <Icon name="expand" size={13} />
        </button>
      </div>

      <div className={styles.canvas}>
        <svg viewBox={GRAPH_VIEWBOX} preserveAspectRatio="xMidYMid meet" className={styles.svg}>
          <g strokeLinecap="round">
            {visibleEdges.map((edge) => {
              const from = nodesById[edge.from];
              const to = nodesById[edge.to];
              const hot = edge.from === selected.id || edge.to === selected.id;
              return (
                <line
                  key={edge.id}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={
                    hot
                      ? 'var(--accent)'
                      : edge.primary
                        ? 'var(--graph-edge-primary)'
                        : 'var(--graph-edge)'
                  }
                  strokeWidth={hot ? 1.8 : edge.primary ? 1.4 : 1}
                  strokeDasharray={edge.inferred ? '4 4' : undefined}
                />
              );
            })}
          </g>

          {showLabels && (
            <g>
              {visibleEdges
                .filter((edge) => edge.primary)
                .map((edge) => {
                  const from = nodesById[edge.from];
                  const to = nodesById[edge.to];
                  return (
                    <text
                      key={`label-${edge.id}`}
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 - 4}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize="9"
                      fill="var(--text-5)"
                    >
                      {edge.predicate}
                    </text>
                  );
                })}
            </g>
          )}

          <g>
            {visibleNodes.map((node) => {
              const isSelected = node.id === selected.id;
              const isNeighbour = neighbourIds.has(node.id);
              const dim = !isSelected && !isNeighbour && selected.id !== ROOT_ENTITY;
              return (
                <g
                  key={node.id}
                  className={styles.node}
                  onClick={() => onSelect(node.id)}
                  role="button"
                  aria-label={`${node.type} ${node.label}`}
                >
                  {isSelected && (
                    <circle cx={node.x} cy={node.y} r={node.r + 6} fill="rgba(75,69,198,.14)" />
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    fill={ENTITY_COLORS[node.type]}
                    stroke={
                      isSelected ? 'var(--graph-node-stroke-selected)' : 'var(--graph-node-stroke)'
                    }
                    strokeWidth={isSelected ? 2 : 1.6}
                  />
                  {showLabels && (
                    <text
                      x={node.x}
                      y={node.y + node.r + 12}
                      textAnchor="middle"
                      fontFamily="var(--font-sans)"
                      fontSize="9.5"
                      fontWeight={node.root || isSelected ? 600 : 400}
                      fill={isSelected ? 'var(--graph-label-selected)' : 'var(--graph-label)'}
                      opacity={dim ? 0.35 : 1}
                    >
                      {node.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        <div className={styles.legend}>
          <span className={styles.legendLabel}>Edge type</span>
          {EDGE_LEGEND.map((entry) => (
            <span key={entry.id} className={styles.legendItem}>
              <span className={entry.dashed ? styles.legendDashed : styles.legendLine} />
              {entry.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const nodeShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  r: PropTypes.number.isRequired,
});

GraphCanvas.propTypes = {
  nodesById: PropTypes.objectOf(nodeShape).isRequired,
  visibleNodes: PropTypes.arrayOf(nodeShape).isRequired,
  visibleEdges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      from: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      predicate: PropTypes.string,
      primary: PropTypes.bool,
      inferred: PropTypes.bool,
    }),
  ).isRequired,
  neighbourIds: PropTypes.instanceOf(Set).isRequired,
  selected: nodeShape.isRequired,
  onSelect: PropTypes.func.isRequired,
  showLabels: PropTypes.bool.isRequired,
  totalNodes: PropTypes.number,
};
