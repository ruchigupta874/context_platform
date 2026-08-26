import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import WorkspaceProvider from "../../../context/WorkspaceProvider";
import ReviewProvider from "../../../context/ReviewProvider";
import styles from "./AppShell.module.css";

/**
 * Workspace chrome. Every page inside a workspace renders through here, so the
 * sidebar is mounted once and does not remount on navigation.
 */
export default function AppShell() {
  return (
    <WorkspaceProvider>
      <ReviewProvider>
        <div className={styles.shell}>
          <Sidebar />
          <div className={styles.main}>
            <Outlet />
          </div>
        </div>
      </ReviewProvider>
    </WorkspaceProvider>
  );
}

/** Page body wrapper. `scroll` for whole-page scrolling, otherwise internal panes scroll. */
export function PageBody({
  children,
  scroll = false,
  pad = true,
  className = "",
}) {
  const classes = [
    styles.content,
    scroll ? styles.scroll : styles.fixed,
    pad ? styles.pad : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <main className={classes}>{children}</main>;
}
