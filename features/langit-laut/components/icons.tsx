// Satu sumber untuk ikon kecil Langit & Laut (SVG inline, ikut `currentColor`). Path tetes dan kamera juga
// dipakai sebagai string HTML untuk penanda peta.
type P = { className?: string };

export const DROP_PATH = "M12 2.5c3.6 4.3 6 7.6 6 10.8a6 6 0 0 1-12 0c0-3.2 2.4-6.5 6-10.8Z";
export const CAM_PATH_A =
  "M3 8.5A2.5 2.5 0 0 1 5.5 6h6A2.5 2.5 0 0 1 14 8.5v7A2.5 2.5 0 0 1 11.5 18h-6A2.5 2.5 0 0 1 3 15.5Z";
export const CAM_PATH_B = "M14 10.5 21 7v10l-7-3.5Z";

const line = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export const IconChevronRight = ({ className }: P) => (
  <svg className={className} {...line} strokeWidth={2}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);
export const IconClose = ({ className }: P) => (
  <svg className={className} {...line} strokeWidth={2}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const IconWarn = ({ className }: P) => (
  <svg className={className} {...line} strokeWidth={2}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);
export const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
);
export const IconPause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
  </svg>
);
