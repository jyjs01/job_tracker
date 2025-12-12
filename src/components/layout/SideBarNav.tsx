"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/job-postings", label: "채용 공고" },
  { href: "/applications", label: "지원 이력" },
  { href: "/interviews", label: "면접 일정" },
];

export default function SideBarNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="mb-2 text-xs text-slate-400">채용 관리</div>
      <ul className="space-y-1 text-sm">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          const base =
            "block rounded-md px-2.5 py-1.5 cursor-pointer transition-colors";
          const activeClass = "bg-slate-800 text-slate-50";
          const inactiveClass = "text-slate-300 hover:bg-slate-800";

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${base} ${isActive ? activeClass : inactiveClass}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
