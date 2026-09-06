import PropTypes from 'prop-types';
import Checkbox from '@/components/ui/Checkbox';
import SearchInput from '@/components/ui/SearchInput';
import Toggle from '@/components/ui/Toggle';
import { SectionLabel } from '@/components/ui/Surfaces';
import { DEPTH_OPTIONS, ENTITY_COLORS } from '@/features/graph/constants';
import { ENTITY_COUNTS } from '@/features/graph/mocks';
import styles from './KnowledgeGraph.module.css';

/** Left rail: what the canvas is allowed to show. */
export default function GraphControls({
  query,
  onQueryChange,
  depth,
  onDepthChange,
  hiddenTypes,
  onToggleType,
  onShowAllTypes,
  showLabels,
  onShowLabelsChange,
  showInferred,
  onShowInferredChange,
}) {
  return (
    <div className={styles.controls}>
      <div className={styles.controlBlock}>
        <div>
          <SectionLabel>Start from</SectionLabel>
          <div className={styles.labelledField}>
            <SearchInput
              value={query}
              onChange={onQueryChange}
              placeholder="Search an entity"
              width="100%"
            />
          </div>
        </div>
        <div>
          <div className={styles.depthRow}>
            <SectionLabel>Traversal depth</SectionLabel>
            <span className={styles.depthValue}>{depth}</span>
          </div>
          <div className={styles.depthButtons}>
            {DEPTH_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={depth === option}
                className={[styles.depthButton, depth === option ? styles.depthActive : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onDepthChange(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.types}>
        <div className={styles.typesHead}>
          <SectionLabel>Entity types</SectionLabel>
          <button type="button" className={styles.selectAll} onClick={onShowAllTypes}>
            All
          </button>
        </div>
        {Object.keys(ENTITY_COLORS).map((type) => {
          const on = !hiddenTypes.has(type);
          return (
            <div
              key={type}
              role="button"
              tabIndex={0}
              className={styles.typeRow}
              onClick={() => onToggleType(type)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onToggleType(type);
                }
              }}
            >
              <Checkbox size="sm" checked={on} onChange={() => onToggleType(type)} label={type} />
              <span
                className={styles.typeSwatch}
                style={{ background: ENTITY_COLORS[type], opacity: on ? 1 : 0.35 }}
              />
              <span
                className={[styles.typeName, on ? '' : styles.typeOff].filter(Boolean).join(' ')}
              >
                {type}
              </span>
              <span className={styles.typeCount}>{ENTITY_COUNTS[type]}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.toggles}>
        <Toggle checked={showLabels} onChange={onShowLabelsChange} label="Node labels" />
        <Toggle checked={showInferred} onChange={onShowInferredChange} label="Inferred edges" />
      </div>
    </div>
  );
}

GraphControls.propTypes = {
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  depth: PropTypes.number.isRequired,
  onDepthChange: PropTypes.func.isRequired,
  hiddenTypes: PropTypes.instanceOf(Set).isRequired,
  onToggleType: PropTypes.func.isRequired,
  onShowAllTypes: PropTypes.func.isRequired,
  showLabels: PropTypes.bool.isRequired,
  onShowLabelsChange: PropTypes.func.isRequired,
  showInferred: PropTypes.bool.isRequired,
  onShowInferredChange: PropTypes.func.isRequired,
};
