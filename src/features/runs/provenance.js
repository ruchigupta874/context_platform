import { TONE } from '@/config/constants/common';
import { RUN_STATUS } from './constants';
import { PIPELINE_STAGES } from './pipeline';

/**
 * What each gate asks for, keyed by the stage the run is held at.
 *
 * The title names the thing being reviewed rather than the stage, because the
 * stage label is already on the node directly above it — repeating it there
 * would say the same word twice and answer nothing.
 */
const GATE_COPY = {
  concepts: {
    title: 'Concept review is ready',
    action: 'Review Concepts',
    route: 'reviewConcepts',
  },
  relationships: {
    title: 'Relationship review is ready',
    action: 'Review relationships',
    route: 'reviewConcepts',
  },
  questions: {
    title: 'Competency question review is ready',
    action: 'Review questions',
    route: 'reviewQuestions',
  },
};

/**
 * The line that closes the provenance thread: where the run stopped, and the
 * one thing you can do about it.
 *
 * Derived rather than stored — a run's next step is a function of the stage it
 * is at and its status, and nothing else. `route` is a `buildPath` key, or null
 * when the run is not asking for anything: a run still moving wants watching,
 * not clicking.
 */
export function describeThread(run) {
  const stage = PIPELINE_STAGES.find((item) => item.id === run.stage);
  const label = stage?.label ?? run.stage;

  if (run.status === RUN_STATUS.needsReview) {
    const copy = GATE_COPY[run.stage];
    return {
      tone: TONE.accent,
      icon: 'pause',
      title: copy?.title ?? `${label} is ready for review`,
      note: 'The run is paused until a domain expert records a decision.',
      action: copy?.action ?? null,
      route: copy?.route ?? null,
    };
  }

  if (run.status === RUN_STATUS.running) {
    return {
      tone: TONE.info,
      icon: 'refresh',
      title: `${label} is running`,
      note: run.stageNote ?? 'The next gate opens as soon as this stage finishes.',
      action: null,
      route: null,
    };
  }

  if (run.status === RUN_STATUS.failed) {
    return {
      tone: TONE.danger,
      icon: 'alert',
      title: `The run stopped at ${label}`,
      note: 'Nothing downstream was built. The log below has the last thing it read.',
      action: null,
      route: null,
    };
  }

  return {
    tone: TONE.ok,
    icon: 'check',
    title: 'Every stage is approved and the graph is built',
    note: run.output
      ? `${run.output.version} · ${run.output.nodes} nodes · ${run.output.edges} edges`
      : 'Nothing is left waiting on you.',
    action: run.output ? 'Open knowledge graph' : null,
    route: run.output ? 'runGraph' : null,
  };
}
