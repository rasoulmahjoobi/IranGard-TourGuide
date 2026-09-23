import { cn } from "@/src/lib/utils";

interface PageLoaderProps {
  className?: string;
  compact?: boolean;
  label?: string;
}

export function PageLoader({
  className,
  compact = false,
  label = "در حال بارگذاری",
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        compact ? "min-h-48 py-10" : "min-h-[60vh] w-full py-16",
        className,
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-muted border-t-primary",
          compact ? "h-10 w-10" : "h-14 w-14",
        )}
      />
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}
