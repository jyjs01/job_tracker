import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/auth"; 

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
        
      {/* 왼쪽 사이드바 */}
      <aside className="flex w-60 flex-col justify-between bg-slate-900 text-slate-100">
        <div className="px-5 py-5">
          <div className="mb-6 text-lg font-bold">JobTracker</div>

          <div className="mb-2 text-xs text-slate-400">채용 관리</div>
          <ul className="space-y-1 text-sm">
            <li className="rounded-md bg-slate-800 px-2.5 py-1.5 cursor-pointer hover:bg-slate-800">
              채용 공고
            </li>
            <li className="rounded-md px-2.5 py-1.5 text-slate-300 cursor-pointer hover:bg-slate-800">
              지원 이력
            </li>
            <li className="rounded-md px-2.5 py-1.5 text-slate-300 cursor-pointer hover:bg-slate-800">
              면접 일정
            </li>
          </ul>
        </div>

        <div className="border-t border-slate-800 px-5 py-4 text-xs">
          <div className="font-semibold">{"관리자"}</div>
          <div className="mt-1 text-slate-400">
            {"admin@jobtracker.com"}
          </div>
        </div>
      </aside>

      {/* 오른쪽 메인 영역 */}
      <main className="flex flex-1 flex-col px-8 py-6">
        {children}
      </main>
    </div>
  );
}
