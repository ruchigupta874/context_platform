import { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import { EmptyState, Panel } from '@/components/ui/Surfaces';
import styles from './ErrorBoundary.module.css';

/**
 * Catches render errors so one broken screen does not take the whole app with
 * it. Wrapped around the app root and around each route element, so a failure
 * inside a page still leaves the sidebar and navigation usable.
 *
 * Still a class: `getDerivedStateFromError` has no hook equivalent.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Nothing collects these yet. When error reporting exists, this is its hook.
    console.error('Unhandled render error', error, info);
  }

  render() {
    const { error } = this.state;
    const { children, title = 'This screen failed to load' } = this.props;

    if (!error) return children;

    return (
      <div className={styles.wrap}>
        <Panel center pad>
          <EmptyState
            icon="alert"
            title={title}
            hint={error.message || 'An unexpected error stopped this view from rendering.'}
            action={
              <Button variant="secondary" onClick={() => this.setState({ error: null })}>
                Try again
              </Button>
            }
          />
        </Panel>
      </div>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};
