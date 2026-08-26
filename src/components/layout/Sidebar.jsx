import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';
import { NAV_GROUPS } from '../../config/navigation';
import { useWorkspace } from '../../hooks/useWorkspace';
import styles from './Sidebar.module.css';

const BADGE_CLASS = {
  info: styles.badgeInfo,
  warn: styles.badgeWarn,
  danger: styles.badgeDanger,
};

const CURRENT_USER = { initials: 'AS', handle: 'a.sikarwar' };

export default function Sidebar() {
  const { workspace, workspaceId, counters } = useWorkspace();

  return (
    <aside className={styles.sidebar}>
      <button type="button" className={styles.switcher}>
        <span className={styles.mark}>
          <Icon name="graph" size={15} strokeWidth={1.5} />
        </span>
        <span className={styles.switcherBody}>
          <span className={styles.switcherName}>{workspace.name}</span>
          <span className={styles.switcherMeta}>
            {workspace.version} · {workspace.status.toLowerCase()}
          </span>
        </span>
        <Icon name="chevronDown" size={13} style={{ color: 'var(--text-5)' }} />
      </button>

      <nav className={styles.nav}>
        {NAV_GROUPS.map((group) => (
          <div key={group.id} className={styles.group}>
            <div className={styles.groupLabel}>{group.label}</div>
            {group.items.map((item) => {
              const count = item.badge ? counters[item.badge] : null;
              return (
                <NavLink
                  key={item.id}
                  to={item.to(workspaceId)}
                  className={({ isActive }) =>
                    [styles.item, isActive ? styles.active : ''].filter(Boolean).join(' ')
                  }
                >
                  <Icon name={item.icon} size={15} />
                  <span className={styles.itemLabel}>{item.label}</span>
                  {count ? (
                    <span className={[styles.badge, BADGE_CLASS[item.badgeTone]].join(' ')}>{count}</span>
                  ) : null}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={styles.user}>
        <span className={styles.avatar}>{CURRENT_USER.initials}</span>
        <span className={styles.userName}>{CURRENT_USER.handle}</span>
        <Icon name="settings" size={14} style={{ color: 'var(--text-5)' }} />
      </div>
    </aside>
  );
}
