"use client";

import { useState, type ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { NavMenu, type NavItem } from "@/components/layout/NavMenu";

const STAFF_NAV_ITEMS: NavItem[] = [
  { href: "/staff/settlements", label: "정산 목록" },
  { href: "/", label: "역할 변경" },
];

export default function StaffLayout({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader title="공동구매 페이백 조회" onMenuClick={() => setNavOpen(true)} />
      <NavMenu isOpen={navOpen} onClose={() => setNavOpen(false)} items={STAFF_NAV_ITEMS} />
      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
