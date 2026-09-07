import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Brand from '@/components/layout/Brand';
import GraphOrbit from '@/features/landing/components/GraphOrbit';
import { LANDING_COPY } from '@/features/landing/constants';
import { buildPath } from '@/routes/paths';
import styles from './Landing.module.css';

/**
 * The front door. One claim, one way in, and the pipeline drawn as the graph it
 * produces — everything else about the product is behind "Get started".
 */
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Brand />
      </header>

      <main className={styles.hero}>
        <div className={styles.copy}>
          <h1 className={styles.headline}>
            {LANDING_COPY.headline}{' '}
            <em className={styles.headlineAccent}>{LANDING_COPY.headlineAccent}</em>
          </h1>
          <div className={styles.actions}>
            <Button
              variant="primary"
              size="xl"
              iconRight="arrowRight"
              onClick={() => navigate(buildPath.workspaces())}
            >
              {LANDING_COPY.cta}
            </Button>
          </div>
        </div>

        <div className={styles.diagram}>
          <GraphOrbit />
        </div>
      </main>
    </div>
  );
}
