import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { NAV_GROUPS } from '@/config/navigation';
import { useWorkspace, WORKSPACES } from '@/features/workspaces';
import { buildPath } from '@/routes/paths';
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
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(readCollapsed);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      // A blocked store is not worth failing a render over.
    }
  }, [collapsed]);

  return (
    <aside
      className={[styles.sidebar, collapsed ? styles.collapsed : ''].filter(Boolean).join(' ')}
    >
      <div className={styles.head}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button
              type="button"
              className={styles.switcher}
              title={collapsed ? workspace.name : undefined}
            >
              <span className={styles.mark}>
                <Icon name="graph" size={15} strokeWidth={1.5} />
              </span>
              <span className={styles.switcherBody}>
                <span className={styles.switcherName}>{workspace.name}</span>
                <span className={styles.switcherMeta}>
                  {workspace.version} · {workspace.status.toLowerCase()}
                </span>
              </span>
              <Icon name="chevronDown" size={13} className={styles.switcherCaret} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent width={216}>
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            {WORKSPACES.map((item) => (
              <DropdownMenuItem
                key={item.id}
                icon="database"
                selected={item.id === workspaceId}
                onSelect={() => navigate(buildPath.overview(item.id))}
              >
                {item.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem icon="grid" onSelect={() => navigate(buildPath.workspaces())}>
              All workspaces
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/*
       * The toggle rides the divider rather than sitting inside the panel: it
       * belongs to the boundary it moves, and at 56px collapsed there is no
       * room for it in the header anyway.
       */}
      <button
        type="button"
        className={styles.edgeToggle}
        onClick={() => setCollapsed((current) => !current)}
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <Icon name={collapsed ? 'arrowRight' : 'arrowLeft'} size={12} />
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
                    <span className={[styles.badge, BADGE_CLASS[item.badgeTone]].join(' ')}>
                      {count}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <button
        type="button"
        className={styles.changeWorkspace}
        onClick={() => navigate(buildPath.workspaces())}
        title={collapsed ? 'Change workspace' : undefined}
      >
        <Icon name="arrowLeft" size={14} />
        <span className={styles.changeLabel}>Change workspace</span>
      </button>

      <div className={styles.user} title={collapsed ? CURRENT_USER.handle : undefined}>
        <span className={styles.avatar}>{CURRENT_USER.initials}</span>
        <span className={styles.userName}>{CURRENT_USER.handle}</span>
        <Icon name="settings" size={14} className={styles.userSettings} />
      </div>
    </aside>
  );
}
