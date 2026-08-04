import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(page: number, totalPages: number): (number | "ellipsis")[] {
  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(p);
  });
  return result;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="페이지 이동"
      className="flex items-center justify-center gap-1 py-2"
    >
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers(page, totalPages).map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-label={`${p} 페이지`}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium",
              p === page
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-50",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
