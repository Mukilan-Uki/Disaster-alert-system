// src/components/ui/EmptyState.jsx
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-midnight-400/15 px-6 py-16 text-center dark:border-white/15">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50 text-cyan-500 dark:bg-cyan-400/10">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-midnight-400 dark:text-mist">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm font-body text-sm text-midnight-400/60 dark:text-mist/60">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
