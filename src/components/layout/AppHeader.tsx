"use client";

interface AppHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function AppHeader({ title, onMenuClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="메뉴 열기"
        className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"
      >
        <span aria-hidden="true" className="text-xl leading-none">
          ☰
        </span>
      </button>
      <h1 className="text-base font-semibold text-slate-800">{title}</h1>
    </header>
  );
}
