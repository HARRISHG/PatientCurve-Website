import type { ReactNode, SVGProps } from "react";

const paths = {
  arrow: "M5 12h14M13 6l6 6-6 6",
  arrowDown: "M12 5v14M6 13l6 6 6-6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  chat: "M21 12a8 8 0 0 1-11.8 7L4 20.5l1.6-4.6A8 8 0 1 1 21 12z",
  inbox: "M3 13h5l1.5 3h5L16 13h5M5 5h14l2 8v6H3v-6l2-8z",
  send: "M21 3L10 14M21 3l-6.5 18-3.5-7-7-3.5L21 3z",
  reply: "M9 14L4 9l5-5M4 9h10a6 6 0 0 1 6 6v5",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  users: "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM22 19v-1a4 4 0 0 0-3-3.9M16 4.1a3.5 3.5 0 0 1 0 6.8",
  user: "M20 20v-1a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v1M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  bell: "M18 16V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2zM10 21h4",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  flow: "M6 3v6a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3v6M6 3l-2.5 2.5M6 3l2.5 2.5M18 21l-2.5-2.5M18 21l2.5-2.5",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  pause: "M8 5v14M16 5v14",
  play: "M7 4.5v15l12-7.5-12-7.5z",
  reset: "M3 12a9 9 0 1 0 3-6.7M3 4v5h5",
  next: "M9 6l6 6-6 6",
  alert: "M12 8v5M12 16.5v.5M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  pending: "M12 3a9 9 0 1 0 9 9M12 7v5h4",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  settings: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  children,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  id: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="h2 mt-3">{title}</h2>
      {children && <div className="lead mt-5">{children}</div>}
    </div>
  );
}

/** Pause/play control for any animation that runs longer than five seconds. */
export function MotionToggle({
  paused,
  onToggle,
  label,
  className = "",
}: {
  paused: boolean;
  onToggle: () => void;
  /** What is being paused, read by screen readers, e.g. "illustration". */
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`${paused ? "Play" : "Pause"} ${label}`}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-semibold text-muted hover:text-deep ${className}`}
    >
      <Icon name={paused ? "play" : "pause"} size={14} />
      {paused ? "Play" : "Pause"}
    </button>
  );
}

export function DemoTag({ children = "Demo data" }: { children?: ReactNode }) {
  return <span className="demo-tag">{children}</span>;
}
