"use client";

import { useState, type ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { NavMenu, type NavItem } from "@/components/layout/NavMenu";

const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: "/admin/settlements", label: "정산 목록" },
  { href: "/admin/settlements/upload", label: "엑셀 업로드" },
  { href: "/", label: "역할 변경" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader title="공동구매 페이백 관리자" onMenuClick={() => setNavOpen(true)} />
      <NavMenu isOpen={navOpen} onClose={() => setNavOpen(false)} items={ADMIN_NAV_ITEMS} />
      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
