// src/components/ui/Skeleton.jsx
export default function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-midnight-400/8 dark:bg-white/10 ${className}`}
    />
  );
}

export function WeatherCardSkeleton() {
  return (
    <div className="rounded-card border border-midnight-400/8 p-5 dark:border-white/10">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-10 w-20" />
      <Skeleton className="mt-3 h-3 w-32" />
    </div>
  );
}

export function AlertRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-midnight-400/8 p-4 dark:border-white/10">
      <Skeleton className="h-9 w-9 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <WeatherCardSkeleton key={i} />
      ))}
    </div>
  );
}
