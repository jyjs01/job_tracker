import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/auth"; 
import SideBarNav from "@/src/components/layout/SideBarNav";

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
    <div className="flex h-screen bg-slate-100 font-sans cursor-default">
        
      {/* 왼쪽 사이드바 */}
      <aside className="flex w-60 flex-col justify-between bg-slate-900 text-slate-100">
        <div className="px-5 py-5">
          <Link href="/dashboard">
            <div className="mb-6 text-lg font-bold">JobTracker</div>
          </Link>

          <SideBarNav />
        </div>

        <div className="border-t border-slate-800 px-5 py-4 text-xs">
          <div className="font-semibold">{"관리자"}</div>
          <div className="mt-1 text-slate-400">
            {"admin@jobtracker.com"}
          </div>
        </div>
      </aside>

      {/* 오른쪽 메인 영역 */}
      <main className="flex flex-1 flex-col overflow-y-auto px-8 py-6">
        {children}
      </main>
    </div>
  );
}
