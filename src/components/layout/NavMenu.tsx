"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export interface NavItem {
  href: string;
  label: string;
}

interface NavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
}

export function NavMenu({ isOpen, onClose, items }: NavMenuProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ease-in-out",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        aria-label="주요 메뉴"
        className={cn(
          "fixed z-50 bg-white shadow-xl transition-transform duration-300 ease-in-out",
          // mobile: bottom sheet — slides up from the bottom edge
          "inset-x-0 bottom-0 max-h-[80vh] rounded-t-2xl",
          isOpen ? "[transform:translateY(0)]" : "[transform:translateY(100%)]",
          // desktop: left drawer — slides in from the left edge
          "md:inset-y-0 md:left-0 md:right-auto md:bottom-auto md:h-full md:w-72 md:max-h-none md:rounded-none",
          isOpen ? "md:[transform:translateX(0)]" : "md:[transform:translateX(-100%)]"
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <span className="text-sm font-semibold text-slate-700">메뉴</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="메뉴 닫기"
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>
        <ul className="flex flex-col p-2">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium",
                    active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
