type Variant = "full" | "icon";

/**
 * WorkIQHub brand identity.
 * Symbol: a geometric "W" drawn as an interconnected path with nodes at each
 * vertex — talent connected through an intelligent network. Built on a 32px
 * grid so it stays legible down to ~20px (favicon / app icon).
 */
export function WorkIQHubLogo({
  variant = "full",
  className = "",
  wordmarkClassName = "",
  title = "WorkIQHub",
}: {
  variant?: Variant;
  className?: string;
  wordmarkClassName?: string;
  title?: string;
}) {
  const mark = (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label={variant === "icon" ? title : undefined}
      aria-hidden={variant === "icon" ? undefined : true}
      className="brand-mark size-7 shrink-0"
      fill="none"
    >
      <rect
        x="1.25"
        y="1.25"
        width="29.5"
        height="29.5"
        rx="8.5"
        className="brand-mark-plate"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="1.2"
      />
      <path
        d="M7 9.5 L12.4 22.5 L16 14.6 L19.6 22.5 L25 9.5"
        className="brand-mark-path"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="9.5" r="2.1" fill="currentColor" />
      <circle cx="25" cy="9.5" r="2.1" fill="currentColor" />
      <circle cx="16" cy="14.6" r="2.4" fill="currentColor" />
    </svg>
  );

  if (variant === "icon") {
    return <span className={`brand-lockup inline-flex text-primary ${className}`}>{mark}</span>;
  }

  return (
    <span className={`brand-lockup inline-flex items-center gap-2.5 ${className}`}>
      <span className="inline-flex text-primary">{mark}</span>
      <span
        className={`brand-wordmark font-display text-lg tracking-[0.06em] text-foreground ${wordmarkClassName}`}
      >
        WorkIQHub
      </span>
    </span>
  );
}

export default WorkIQHubLogo;
