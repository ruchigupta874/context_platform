import PropTypes from 'prop-types';
import Icon from '@/components/ui/Icon';
import SearchInput from '@/components/ui/SearchInput';
import styles from './Ontology.module.css';

/**
 * The class hierarchy, as a real ARIA tree.
 *
 * Arrow keys expand and collapse; the caret is a mouse-only affordance hidden
 * from assistive tech so the row stays a single control rather than nesting an
 * interactive element inside a treeitem.
 */
export default function ClassTree({
  nodes,
  selectedId,
  onSelect,
  expanded,
  onToggleExpanded,
  hasChildren,
  query,
  onQueryChange,
}) {
  return (
    <div className={styles.tree}>
      <div className={styles.treeSearch}>
        <SearchInput
          value={query}
          onChange={onQueryChange}
          placeholder="Find a class"
          width="100%"
          subtle
        />
      </div>
      <div className={styles.treeLabel}>Class hierarchy</div>
      <div className={styles.treeBody} role="tree" aria-label="Class hierarchy">
        {nodes.map((node) => {
          const active = selectedId === node.id;
          const children = hasChildren(node.id);
          const open = expanded.has(node.id);
          return (
            <div
              key={node.id}
              role="treeitem"
              tabIndex={0}
              aria-selected={active}
              aria-expanded={children ? open : undefined}
              className={[styles.node, active ? styles.nodeActive : ''].filter(Boolean).join(' ')}
              style={{ paddingLeft: 8 + node.depth * 15 }}
              onClick={() => onSelect(node.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(node.id);
                  return;
                }
                if (!children) return;
                if (event.key === 'ArrowRight' && !open) {
                  event.preventDefault();
                  onToggleExpanded(node.id);
                }
                if (event.key === 'ArrowLeft' && open) {
                  event.preventDefault();
                  onToggleExpanded(node.id);
                }
              }}
            >
              <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                className={[styles.caret, open ? styles.caretOpen : ''].filter(Boolean).join(' ')}
                onClick={(event) => {
                  event.stopPropagation();
                  if (children) onToggleExpanded(node.id);
                }}
              >
                {children && <Icon name="chevronRight" size={11} strokeWidth={1.8} />}
              </button>
              <Icon
                name="node"
                size={13}
                className={active ? styles.nodeIconActive : styles.nodeIcon}
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
  );
}

ClassTree.propTypes = {
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      depth: PropTypes.number.isRequired,
      instances: PropTypes.node,
    }),
  ).isRequired,
  selectedId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  expanded: PropTypes.instanceOf(Set).isRequired,
  onToggleExpanded: PropTypes.func.isRequired,
  hasChildren: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
};
