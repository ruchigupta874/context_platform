import { useCallback, useMemo, useState } from 'react';

/**
 * Checkbox selection over a list of ids.
 *
 * Used by the Sources tables, the Documents table and the review gate. Keeping
 * it here means "select all" always means "select all *visible*", which is the
 * behaviour people expect once a filter is applied.
 */
export function useSelection(initialIds = []) {
  const [selected, setSelected] = useState(() => new Set(initialIds));

  const toggle = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleMany = useCallback((ids, shouldSelect) => {
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (shouldSelect ? next.add(id) : next.delete(id)));
      return next;
    });
  }, []);

  const replace = useCallback((ids) => setSelected(new Set(ids)), []);
  const clear = useCallback(() => setSelected(new Set()), []);
  const isSelected = useCallback((id) => selected.has(id), [selected]);

  const helpers = useMemo(
    () => ({
      /** True only when every visible id is selected — drives the header checkbox. */
      allSelected: (visibleIds) =>
        visibleIds.length > 0 && visibleIds.every((id) => selected.has(id)),
      someSelected: (visibleIds) => visibleIds.some((id) => selected.has(id)),
    }),
    [selected],
  );

  return {
    selected,
    selectedIds: useMemo(() => [...selected], [selected]),
    count: selected.size,
    isSelected,
    toggle,
    toggleMany,
    replace,
    clear,
    ...helpers,
  };
}
