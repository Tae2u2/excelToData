import { cn } from "@/lib/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="로딩 중"
      className={cn(
        "h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600",
        className
      )}
    />
  );
}
