import Icon from '@/components/ui/Icon';
import styles from './Brand.module.css';

/**
 * The product mark and wordmark, as they appear on the entry surfaces — the
 * landing header and the registry top bar. Takes no props: the two places it
 * renders show it identically, and spacing around it is the parent's job.
 */
export default function Brand() {
  return (
    <span className={styles.brand}>
      <span className={styles.mark}>
        <Icon name="graph" size={16} strokeWidth={1.5} />
      </span>
      <span className={styles.wordmark}>Context Platform</span>
    </span>
  );
}
