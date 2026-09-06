import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import Chip from '@/components/ui/Chip';
import SearchInput from '@/components/ui/SearchInput';
import ProgressBar from '@/components/ui/ProgressBar';
import { Banner, CodeBlock, SectionLabel } from '@/components/ui/Surfaces';
import RunOutputEmpty from '@/components/pipeline/RunOutputEmpty';
import {
  AXIOM_TONES,
  CLASS_DETAILS,
  DEFAULT_EXPANDED,
  ONTOLOGY_STATS,
  ONTOLOGY_TREE,
  QUESTION_COVERAGE,
  VALIDATION_FINDINGS,
} from '@/mocks/ontology';
import { findRun } from '@/mocks/runs';
import { useWorkspace } from '@/hooks/useWorkspace';
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

function fallbackDetail(id) {
  return {
    name: id,
    parent: 'owl:Thing',
    instances: '—',
    definition:
      'This class was created during the ontology build. Select Customer, Contract or Invoice to see a fully mapped class.',
    objectProperties: [],
    dataProperties: [],
    axioms: [],
    mapping: `# No mapping generated yet for ${id}.`,
  };
}

export default function Ontology() {
  const { workspaceId } = useWorkspace();
  const { runId } = useParams();
  const run = findRun(runId);
  const [selectedId, setSelectedId] = useState('Customer');
  const [expanded, setExpanded] = useState(() => new Set(DEFAULT_EXPANDED));
  const [query, setQuery] = useState('');

  const hasChildren = useMemo(() => (id) => ONTOLOGY_TREE.some((node) => node.parent === id), []);

  /** A node is visible when every ancestor is expanded — or when a search is active. */
  const visibleNodes = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle) return ONTOLOGY_TREE.filter((node) => node.name.toLowerCase().includes(needle));

    const byId = Object.fromEntries(ONTOLOGY_TREE.map((node) => [node.id, node]));
    return ONTOLOGY_TREE.filter((node) => {
      let parent = node.parent;
      while (parent) {
        if (!expanded.has(parent)) return false;
        parent = byId[parent]?.parent;
      }
      return true;
    });
  }, [expanded, query]);

  const detail = CLASS_DETAILS[selectedId] ?? fallbackDetail(selectedId);

  const toggleExpanded = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const coveragePercent = Math.round(
    (QUESTION_COVERAGE.answerable / QUESTION_COVERAGE.total) * 100,
  );

  // Hooks above run unconditionally; the bail-out has to come after them.
  if (!run?.output) return <RunOutputEmpty artifact="Ontology" run={run} runId={runId} />;

  return (
    <div className={styles.layout}>
      <div className={styles.tree}>
        <div className={styles.treeSearch}>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Find a class"
            width="100%"
            subtle
          />
        </div>
        <div className={styles.treeLabel}>Class hierarchy</div>
        <div className={styles.treeBody}>
          {visibleNodes.map((node) => {
            const active = selectedId === node.id;
            const children = hasChildren(node.id);
            const open = expanded.has(node.id);
            return (
              <div
                key={node.id}
                role="button"
                tabIndex={0}
                className={[styles.node, active ? styles.nodeActive : ''].filter(Boolean).join(' ')}
                style={{ paddingLeft: 8 + node.depth * 15 }}
                onClick={() => setSelectedId(node.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedId(node.id);
                  }
                }}
              >
                <span
                  className={[styles.caret, open ? styles.caretOpen : ''].filter(Boolean).join(' ')}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (children) toggleExpanded(node.id);
                  }}
                >
                  {children && <Icon name="chevronRight" size={11} strokeWidth={1.8} />}
                </span>
                <Icon
                  name="node"
                  size={13}
                  style={{ color: active ? 'var(--accent)' : 'var(--border-input)' }}
                />
                <span
                  className={[
                    styles.nodeName,
                    node.depth <= 1 ? styles.nodeTop : '',
                    node.depth === 0 ? styles.nodeRoot : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {node.name}
                </span>
                <span className={styles.nodeCount}>{node.instances}</span>
              </div>
            );
          })}
        </div>
      </div>

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
            <span style={{ color: 'var(--text-5)' }}>rdfs:subClassOf</span>
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
                      <Chip tone={tone === 'neutral' ? 'neutral' : tone}>{axiom.tag}</Chip>
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
            <CodeBlock style={{ marginTop: 8 }}>{detail.mapping}</CodeBlock>
          </div>
        </div>
      </div>

      <aside className={styles.rail}>
        <div className={styles.railBlock}>
          <SectionLabel>Ontology</SectionLabel>
          <div className={styles.statPairGrid}>
            {ONTOLOGY_STATS.map((stat) => (
              <div key={stat.id}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.railBlock}>
          <div className={styles.coverageRow}>
            <SectionLabel>Question coverage</SectionLabel>
            <span className={styles.coverageValue}>
              {QUESTION_COVERAGE.answerable}/{QUESTION_COVERAGE.total}
            </span>
          </div>
          <ProgressBar
            total={QUESTION_COVERAGE.total}
            label={`${coveragePercent}% answerable`}
            segments={[
              { id: 'answerable', value: QUESTION_COVERAGE.answerable, tone: 'ok' },
              { id: 'partial', value: QUESTION_COVERAGE.partial, tone: 'warn' },
            ]}
          />
          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span className={styles.legendSwatch} style={{ background: 'var(--ok)' }} />
              {QUESTION_COVERAGE.answerable} answerable
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendSwatch} style={{ background: 'var(--warn-strong)' }} />
              {QUESTION_COVERAGE.partial} partial
            </span>
          </div>
        </div>

        <div className={styles.validation}>
          <SectionLabel>Validation</SectionLabel>
          <div className={styles.validationList}>
            {VALIDATION_FINDINGS.map((finding) => (
              <Banner
                key={finding.id}
                tone={finding.tone}
                title={finding.title}
                note={finding.detail}
              />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
