export function MetricsSkeleton() {
  return (
    <div className="flex items-center justify-center gap-3 font-ibm-plex-mono text-[12px]">
      <div className="h-4 w-16 animate-pulse rounded bg-border" />
      <span className="text-text-tertiary">codes roasted</span>
      <span>·</span>
      <span className="text-text-tertiary">
        avg score:{" "}
        <div className="ml-1 mr-1 inline-block h-4 w-12 animate-pulse rounded bg-border" />
        /10
      </span>
    </div>
  );
}
