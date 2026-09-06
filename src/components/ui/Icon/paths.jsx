/**
 * Stroke-based icon set on a 16px grid.
 *
 * Paths live in one map rather than one file each: they are small, they share a
 * single visual style, and keeping them together is what stops the style drifting.
 * Everything inherits `currentColor`, so an icon is coloured by its parent.
 */
export const PATHS = {
  grid: (
    <>
      <rect x="2.4" y="2.4" width="4.7" height="4.7" rx="1.2" />
      <rect x="8.9" y="2.4" width="4.7" height="4.7" rx="1.2" />
      <rect x="2.4" y="8.9" width="4.7" height="4.7" rx="1.2" />
      <rect x="8.9" y="8.9" width="4.7" height="4.7" rx="1.2" />
    </>
  ),
  database: (
    <>
      <ellipse cx="8" cy="4" rx="5.5" ry="2" />
      <path d="M2.5 4v8c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2V4" />
      <path d="M2.5 8c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2" />
    </>
  ),
  doc: (
    <>
      <path d="M9.2 1.6H4.6A1.6 1.6 0 0 0 3 3.2v9.6a1.6 1.6 0 0 0 1.6 1.6h6.8a1.6 1.6 0 0 0 1.6-1.6V5.4z" />
      <path d="M9.2 1.6v3.8H13" />
      <path d="M5.6 8.6h4.8M5.6 11.2h3.2" />
    </>
  ),
  play: <path d="M4.6 3.1v9.8L13 8z" />,
  inbox: (
    <>
      <path d="M1.6 9.4 3.7 3.3A1.6 1.6 0 0 1 5.2 2.2h5.6a1.6 1.6 0 0 1 1.5 1.1l2.1 6.1" />
      <path d="M1.6 9.4h3.3l1 2.1h4.2l1-2.1h3.3v3.1a1.6 1.6 0 0 1-1.6 1.6H3.2a1.6 1.6 0 0 1-1.6-1.6z" />
    </>
  ),
  hierarchy: (
    <>
      <rect x="5.6" y="1.6" width="4.8" height="3.4" rx="1" />
      <rect x="1.2" y="11" width="4.4" height="3.4" rx="1" />
      <rect x="10.4" y="11" width="4.4" height="3.4" rx="1" />
      <path d="M8 5v3.2M3.4 11V8.2h9.2V11" />
    </>
  ),
  help: (
    <>
      <circle cx="8" cy="8" r="6.2" />
      <path d="M6.3 6.3a1.8 1.8 0 1 1 2.4 1.7c-.5.2-.7.6-.7 1.1v.3" />
      <path d="M8 11.9h.01" />
    </>
  ),
  graph: (
    <>
      <circle cx="3.5" cy="12" r="1.7" />
      <circle cx="12.5" cy="12" r="1.7" />
      <circle cx="8" cy="3.6" r="1.7" />
      <path d="M6.7 4.9 4.7 10.5M9.3 4.9l2 5.6M5.3 12h5.4" />
    </>
  ),
  shield: (
    <>
      <path d="M8 1.7 13.2 3.6v4c0 3.1-2.1 5.5-5.2 6.6-3.1-1.1-5.2-3.5-5.2-6.6v-4z" />
      <path d="m6 7.9 1.5 1.5 2.7-2.9" />
    </>
  ),
  settings: (
    <>
      <circle cx="8" cy="8" r="2.3" />
      <path d="M8 1.4v1.6M8 13v1.6M14.6 8H13M3 8H1.4M12.7 3.3l-1.2 1.2M4.5 11.5l-1.2 1.2M12.7 12.7l-1.2-1.2M4.5 4.5 3.3 3.3" />
    </>
  ),
  search: (
    <>
      <circle cx="7.2" cy="7.2" r="4.7" />
      <path d="m10.7 10.7 3 3" />
    </>
  ),
  plus: <path d="M8 3.2v9.6M3.2 8h9.6" />,
  minus: <path d="M3.2 8h9.6" />,
  check: <path d="m3.2 8.4 3.2 3.2 6.4-7" />,
  close: <path d="M4.2 4.2 11.8 11.8M11.8 4.2 4.2 11.8" />,
  chevronDown: <path d="m3.8 6.2 4.2 4.2 4.2-4.2" />,
  chevronRight: <path d="m6.2 3.8 4.2 4.2-4.2 4.2" />,
  arrowRight: <path d="M2.8 8h10.4M9.2 4l4 4-4 4" />,
  arrowLeft: <path d="M13.2 8H2.8M6.8 4l-4 4 4 4" />,
  upload: (
    <>
      <path d="M8 10.6V2.3" />
      <path d="m4.8 5.5 3.2-3.2 3.2 3.2" />
      <path d="M2.5 10.6v2A1.6 1.6 0 0 0 4.1 14h7.8a1.6 1.6 0 0 0 1.6-1.4v-2" />
    </>
  ),
  download: (
    <>
      <path d="M8 2.2v8.3" />
      <path d="m4.8 7.3 3.2 3.2 3.2-3.2" />
      <path d="M2.6 11.6v1A1.6 1.6 0 0 0 4.2 14h7.6a1.6 1.6 0 0 0 1.6-1.4v-1" />
    </>
  ),
  refresh: (
    <>
      <path d="M13.6 8a5.6 5.6 0 1 1-1.7-4" />
      <path d="M13.7 2.1v3.3h-3.3" />
    </>
  ),
  alert: (
    <>
      <path d="M8 2.4 14.6 13.2H1.4z" />
      <path d="M8 6.4v3M8 11.4h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="8" cy="8" r="6.2" />
      <path d="M8 7.4v3.6M8 5.2h.01" />
    </>
  ),
  node: (
    <>
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 5.5V1.9M8 10.5v3.6M5.5 8H1.9M10.5 8h3.6" />
    </>
  ),
  link: (
    <>
      <path d="M6.6 9.4a2.8 2.8 0 0 0 4 0l2.2-2.2a2.83 2.83 0 0 0-4-4l-.6.6" />
      <path d="M9.4 6.6a2.8 2.8 0 0 0-4 0L3.2 8.8a2.83 2.83 0 0 0 4 4l.6-.6" />
    </>
  ),
  scan: (
    <>
      <path d="M2 5.4V3.4A1.4 1.4 0 0 1 3.4 2h2M10.6 2h2A1.4 1.4 0 0 1 14 3.4v2M14 10.6v2a1.4 1.4 0 0 1-1.4 1.4h-2M5.4 14h-2A1.4 1.4 0 0 1 2 12.6v-2M2 8h12" />
    </>
  ),
  pause: <path d="M6 3.4v9.2M10 3.4v9.2" />,
  edit: <path d="M11.2 2.3a1.7 1.7 0 0 1 2.5 2.5L5.4 13.1 2.1 14l.9-3.3z" />,
  clock: (
    <>
      <circle cx="8" cy="8" r="6.2" />
      <path d="M8 4.4V8l2.6 1.6" />
    </>
  ),
  expand: <path d="M9.6 2.4h4v4M6.4 13.6h-4v-4M13.6 2.4 9.2 6.8M2.4 13.6l4.4-4.4" />,
};

export const ICON_NAMES = Object.keys(PATHS);
