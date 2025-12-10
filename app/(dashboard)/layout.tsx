// app/(dashboard)/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
// import { getCurrentUser } from "@/lib/auth";  // 나중에 구현할 로그인 체크 함수

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {

//   const user = await getCurrentUser();   // 로그인 안 돼 있으면 null 리턴한다고 가정

//   if (!user) {
//     redirect("/login");
//   }

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
        
      {/* 왼쪽 사이드바 */}
      <aside className="flex w-60 flex-col justify-between bg-slate-900 text-slate-100">
        <div className="px-5 py-5">
          <div className="mb-6 text-lg font-bold">JobTracker</div>

          <div className="mb-2 text-xs text-slate-400">채용 관리</div>
          <ul className="space-y-1 text-sm">
            <li className="rounded-md bg-slate-800 px-2.5 py-1.5">
              채용 공고
            </li>
            <li className="rounded-md px-2.5 py-1.5 text-slate-300">
              지원 이력
            </li>
            <li className="rounded-md px-2.5 py-1.5 text-slate-300">
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
        {/* 각 페이지에서 h1 같은 헤더를 렌더링하게 두고 */}
        {/* 여기에는 공통 여백만 주는 식으로 처리 */}
        {children}
      </main>
    </div>
  );
}
