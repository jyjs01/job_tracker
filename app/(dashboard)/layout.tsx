import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/auth";
import SideBarNav from "@/src/components/layout/SideBarNav";
import MobileSidebar from "@/src/components/layout/MobileSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans cursor-default">
      {/* 데스크탑 전용 사이드바 */}
      <aside className="hidden w-60 flex-col justify-between bg-slate-900 text-slate-100 md:flex">
        <div className="px-5 py-5">
          <Link href="/dashboard">
            <div className="mb-6 text-lg font-bold">JobTracker</div>
          </Link>

          <SideBarNav />
        </div>

        <div className="border-t border-slate-800 px-5 py-4 text-xs">
          <div className="font-semibold">{user.name ?? "관리자"}</div>
          <div className="mt-1 text-slate-400">{user.email}</div>
        </div>
      </aside>

      {/* 오른쪽 메인 영역 */}
      <main className="flex flex-1 flex-col">
        {/* 모바일 전용 상단바 */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-slate-100/90 px-4 py-3 backdrop-blur md:hidden">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-slate-900"
          >
            JobTracker
          </Link>
          <MobileSidebar
            userName={user.name ?? "관리자"}
            userEmail={user.email}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
