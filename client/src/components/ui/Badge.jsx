// src/components/ui/Badge.jsx
const TONES = {
  safe: "bg-safe-50 text-safe-500 dark:bg-safe-400/10 dark:text-safe-400",
  warning: "bg-signal-50 text-signal-600 dark:bg-signal-400/10 dark:text-signal-400",
  danger: "bg-danger-50 text-danger-500 dark:bg-danger-400/10 dark:text-danger-400",
  info: "bg-cyan-50 text-cyan-500 dark:bg-cyan-400/10 dark:text-cyan-400",
  neutral: "bg-midnight-400/5 text-midnight-400 dark:bg-white/10 dark:text-mist",
};

export default function Badge({ tone = "neutral", children, className = "", icon: Icon }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium uppercase tracking-wide ${TONES[tone]} ${className}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}
