import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../../ui/Icon';
import { NAV_GROUPS } from '../../../config/navigation';
import { useWorkspace } from '../../../hooks/useWorkspace';
import styles from './Sidebar.module.css';

const BADGE_CLASS = {
  info: styles.badgeInfo,
  warn: styles.badgeWarn,
  danger: styles.badgeDanger,
};

const DOT_CLASS = {
  info: styles.dotInfo,
  warn: styles.dotWarn,
  danger: styles.dotDanger,
};

const CURRENT_USER = { initials: 'AS', handle: 'a.sikarwar' };

const STORAGE_KEY = 'ctx.sidebar.collapsed';

/** Remembered per browser, so the choice survives a reload. */
function readCollapsed() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export default function Sidebar() {
  const { workspace, workspaceId, counters } = useWorkspace();
  const [collapsed, setCollapsed] = useState(readCollapsed);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      // A blocked store is not worth failing a render over.
    }
  }, [collapsed]);

  const mark = (
    <span className={styles.mark}>
      <Icon name="graph" size={15} strokeWidth={1.5} />
    </span>
  );

  return (
    <aside className={[styles.sidebar, collapsed ? styles.collapsed : ''].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        {collapsed ? (
          /* At 56px there is only room for one control, and the one you want is
             the way out — so the mark doubles as the expand button. */
          <button
            type="button"
            className={styles.expand}
            onClick={() => setCollapsed(false)}
            aria-expanded={false}
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            {mark}
          </button>
        ) : (
          <>
            <button type="button" className={styles.switcher}>
              {mark}
              <span className={styles.switcherBody}>
                <span className={styles.switcherName}>{workspace.name}</span>
                <span className={styles.switcherMeta}>
                  {workspace.version} · {workspace.status.toLowerCase()}
                </span>
              </span>
              <Icon name="chevronDown" size={13} className={styles.switcherCaret} />
            </button>
            <button
              type="button"
              className={styles.collapse}
              onClick={() => setCollapsed(true)}
              aria-expanded
              aria-label="Collapse sidebar"
            >
              <Icon name="arrowLeft" size={14} />
            </button>
          </>
        )}
      </div>

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
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    [styles.item, isActive ? styles.active : ''].filter(Boolean).join(' ')
                  }
                >
                  <span className={styles.itemIcon}>
                    <Icon name={item.icon} size={15} />
                    {/* Collapsed has no room for the count, but losing the signal
                        entirely would hide the only thing asking for attention. */}
                    {count ? (
                      <span className={[styles.dot, DOT_CLASS[item.badgeTone]].join(' ')} />
                    ) : null}
                  </span>
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

      <div className={styles.user} title={collapsed ? CURRENT_USER.handle : undefined}>
        <span className={styles.avatar}>{CURRENT_USER.initials}</span>
        <span className={styles.userName}>{CURRENT_USER.handle}</span>
        <Icon name="settings" size={14} className={styles.userSettings} />
      </div>
    </aside>
  );
}
