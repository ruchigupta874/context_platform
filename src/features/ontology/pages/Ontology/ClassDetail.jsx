import PropTypes from 'prop-types';
import Chip from '@/components/ui/Chip';
import { CodeBlock, SectionLabel } from '@/components/ui/Surfaces';
import { AXIOM_TONES } from '@/features/ontology/mocks';
import { conceptIri } from '@/utils/format';
import styles from './Ontology.module.css';

const OBJECT_COLUMNS = '1.2fr 1fr 82px 1fr';
const DATA_COLUMNS = '1.1fr 100px 1.3fr 82px';
const DOT_CLASS = {
  ok: styles.dotOk,
  info: styles.dotInfo,
  danger: styles.dotDanger,
  neutral: styles.dotOk,
};

/** One class: its identity, its properties, the axioms on it, and its mapping. */
export default function ClassDetail({ detail, workspaceId }) {
  return (
    <div className={styles.detail}>
      <div className={styles.detailHead}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{detail.name}</span>
          <Chip tone="accent">OWL CLASS</Chip>
          <Chip tone="ok" mono>
            {detail.instances} instances
          </Chip>
        </div>
        <div className={styles.uri}>{conceptIri(workspaceId, detail.name)}</div>
        <div className={styles.parentRow}>
          <span className={styles.predicate}>rdfs:subClassOf</span>
          <span className={styles.parentValue}>{detail.parent}</span>
        </div>
        <p className={styles.definition}>{detail.definition}</p>
      </div>

      <div className={styles.detailBody}>
        {detail.objectProperties.length > 0 && (
          <div>
            <SectionLabel>Object properties</SectionLabel>
            <div className={styles.propTable}>
              <div className={styles.propHead} style={{ gridTemplateColumns: OBJECT_COLUMNS }}>
                <div>Property</div>
                <div>Range</div>
                <div>Card.</div>
                <div>Inverse</div>
              </div>
              {detail.objectProperties.map((property) => (
                <div
                  key={property.id}
                  className={styles.propRow}
                  style={{ gridTemplateColumns: OBJECT_COLUMNS }}
                >
                  <div className={styles.propName}>{property.name}</div>
                  <div>{property.range}</div>
                  <div className={styles.propMuted}>{property.cardinality}</div>
                  <div className={styles.propMuted}>{property.inverse}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {detail.dataProperties.length > 0 && (
          <div>
            <SectionLabel>Datatype properties</SectionLabel>
            <div className={styles.propTable}>
              <div className={styles.propHead} style={{ gridTemplateColumns: DATA_COLUMNS }}>
                <div>Property</div>
                <div>Type</div>
                <div>Mapped from</div>
                <div>Required</div>
              </div>
              {detail.dataProperties.map((property) => (
                <div
                  key={property.id}
                  className={styles.propRow}
                  style={{ gridTemplateColumns: DATA_COLUMNS }}
                >
                  <div className={styles.propName}>{property.name}</div>
                  <div className={styles.propMuted}>{property.type}</div>
                  <div>{property.from}</div>
                  <div className={property.required ? '' : styles.propOff}>
                    {property.required ? 'yes' : 'no'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {detail.axioms.length > 0 && (
          <div>
            <SectionLabel>Axioms</SectionLabel>
            <div className={styles.axioms}>
              {detail.axioms.map((axiom) => {
                const tone = AXIOM_TONES[axiom.tag] ?? 'neutral';
                return (
                  <div key={axiom.id} className={styles.axiom}>
                    <span className={[styles.axiomDot, DOT_CLASS[tone]].join(' ')} />
                    <span className={styles.axiomText}>{axiom.text}</span>
                    <Chip tone={tone}>{axiom.tag}</Chip>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <SectionLabel note="how instances are materialised from the catalog">
            R2RML mapping
          </SectionLabel>
          <CodeBlock className={styles.labelledCode}>{detail.mapping}</CodeBlock>
        </div>
      </div>
    </div>
  );
}

ClassDetail.propTypes = {
  detail: PropTypes.shape({
    name: PropTypes.string.isRequired,
    parent: PropTypes.string,
    instances: PropTypes.node,
    definition: PropTypes.node,
    objectProperties: PropTypes.array.isRequired,
    dataProperties: PropTypes.array.isRequired,
    axioms: PropTypes.array.isRequired,
    mapping: PropTypes.string,
  }).isRequired,
  workspaceId: PropTypes.string.isRequired,
};
