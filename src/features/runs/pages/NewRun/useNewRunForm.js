import { useMemo, useState } from 'react';
import { DEFAULT_STRATEGY, STRATEGIES, estimateMinutes } from '@/features/runs/constants';
import { OPTIONAL_GATE, PIPELINE_STAGES } from '@/features/runs/pipeline';
import {
  DEFAULT_DOCUMENT_SELECTION,
  DEFAULT_TABLE_SELECTION,
  DOCUMENTS,
  SOURCE_KIND,
  TABLES,
} from '@/features/sources';
import { pluralize } from '@/utils/format';

const DEFAULT_GUIDANCE =
  'Use singular CamelCase class names. Treat "party" and "account holder" as Customer. Do not create separate classes for soft-deleted rows.';

/**
 * The form behind a new extraction, and everything derived from it.
 *
 * The estimate, the gate list and the summary are all functions of the same
 * four inputs, so they are computed here rather than recomputed inline in three
 * different sections of the page.
 */
export function useNewRunForm() {
  const [strategy, setStrategy] = useState(DEFAULT_STRATEGY);
  const [guidance, setGuidance] = useState(DEFAULT_GUIDANCE);
  const [questionGate, setQuestionGate] = useState(true);
  const [removed, setRemoved] = useState([]);

  const sources = useMemo(() => {
    const tables = TABLES.filter((t) => DEFAULT_TABLE_SELECTION.includes(t.id)).map((t) => ({
      id: t.id,
      label: t.name,
      kind: SOURCE_KIND.table,
    }));
    const docs = DOCUMENTS.filter((d) => DEFAULT_DOCUMENT_SELECTION.includes(d.id)).map((d) => ({
      id: d.id,
      label: d.name,
      kind: SOURCE_KIND.document,
    }));
    return [...tables, ...docs].filter((source) => !removed.includes(source.id));
  }, [removed]);

  const tableCount = sources.filter((s) => s.kind === SOURCE_KIND.table).length;
  const docCount = sources.length - tableCount;
  const minutes = estimateMinutes({ tableCount, docCount, strategy });

  // Gates are derived from the pipeline definition plus the one toggle the user controls.
  const stages = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    active: stage.gate && (stage.id !== OPTIONAL_GATE || questionGate),
  }));
  const gateCount = stages.filter((s) => s.active).length;

  const summary = [
    { key: 'Sources', value: `${tableCount} tables + ${docCount} docs` },
    { key: 'Strategy', value: STRATEGIES.find((s) => s.id === strategy).name },
    { key: 'Review gates', value: pluralize(gateCount, 'gate') },
    { key: 'Est. duration', value: `~${minutes} min to first gate` },
  ];

  return {
    strategy,
    setStrategy,
    guidance,
    setGuidance,
    questionGate,
    setQuestionGate,
    removed,
    setRemoved,
    sources,
    tableCount,
    docCount,
    stages,
    summary,
  };
}
