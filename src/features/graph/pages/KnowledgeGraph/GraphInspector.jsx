import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import { SectionLabel } from '@/components/ui/Surfaces';
import { ENTITY_COLORS } from '@/features/graph/constants';
import { useWorkspace } from '@/features/workspaces';
import { entityIri } from '@/utils/format';
import styles from './KnowledgeGraph.module.css';

/** Right rail: everything known about the selected entity, and where it came from. */
export default function GraphInspector({ selected, inspector, onSelect, runId }) {
  const { workspaceId } = useWorkspace();

  return (
    <aside className={styles.inspector}>
      <div className={styles.inspectorHead}>
        <div className={styles.inspectorType}>
          <span
            className={styles.inspectorSwatch}
            style={{ background: ENTITY_COLORS[selected.type] }}
          />
          <span className={styles.inspectorTypeLabel}>{selected.type}</span>
        </div>
        <div className={styles.inspectorLabel}>{selected.label}</div>
        <div className={styles.inspectorIri}>
          {entityIri(workspaceId, selected.type, selected.label)}
        </div>
      </div>

      <div className={styles.inspectorBody}>
        <div>
          <SectionLabel>Properties</SectionLabel>
          <div className={styles.props}>
            {inspector.properties.map((property) => (
              <div key={property.id} className={styles.prop}>
                <span className={styles.propKey}>{property.key}</span>
                <span className={styles.propValue}>{property.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel note={String(inspector.relationships.length)}>Relationships</SectionLabel>
          <div className={styles.rels}>
            {inspector.relationships.map((relationship) => (
              <button
                key={relationship.id}
                type="button"
                className={styles.rel}
                onClick={() => onSelect(relationship.otherId)}
              >
                <Icon
                  name={relationship.outgoing ? 'arrowRight' : 'arrowLeft'}
                  size={12}
                  className={styles.mutedIcon}
                />
                <span className={styles.relPredicate}>{relationship.predicate}</span>
                <span className={styles.relOther}>{relationship.other}</span>
                <span
                  className={styles.relSwatch}
                  style={{ background: ENTITY_COLORS[relationship.otherType] }}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>Provenance</SectionLabel>
          <div className={styles.provenance}>
            <div className={styles.provRow}>
              <span className={styles.provKey}>source row</span>
              <span className={styles.provValue}>{inspector.sourceRow}</span>
            </div>
            <div className={styles.provRow}>
              <span className={styles.provKey}>mapping</span>
              <span className={styles.provValue}>{inspector.mapping}</span>
            </div>
            <div className={styles.provRow}>
              <span className={styles.provKey}>built by</span>
              <span className={styles.provValue}>{runId}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

GraphInspector.propTypes = {
  selected: PropTypes.shape({
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  inspector: PropTypes.shape({
    properties: PropTypes.array.isRequired,
    relationships: PropTypes.array.isRequired,
    sourceRow: PropTypes.string,
    mapping: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  runId: PropTypes.string,
};
