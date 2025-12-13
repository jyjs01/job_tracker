// app/(dashboard)/job-postings/[id]/page.tsx
import Link from "next/link";
import Button from "@/src/components/ui/Button";

type JobPostingDetailPageProps = {
  params: {
    id: string;
  };
};

export default function JobPostingDetailPage({
  params,
}: JobPostingDetailPageProps) {
//   const { id } = params;

  // TODO: id 기반 실제 데이터 연동

  return (
    <div className="px-6 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Link href="/job-postings" className="hover:text-slate-600">
            채용 공고
          </Link>
          <span>›</span>
          <span className="text-slate-500">
            Frontend Developer - TechCorp
          </span>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <section className="flex-1 space-y-4">
            {/* 기본 정보 박스 */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">
                    Frontend Developer
                  </h1>
                  <p className="mt-1 text-xs text-slate-500">
                    TechCorp Inc.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-[11px]"
                >
                  공고 보기
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* 메타 정보 */}
                <div className="space-y-3 text-[11px] text-slate-500">
                  <div>
                    <p className="text-slate-400">마감일</p>
                    <p className="mt-0.5 text-xs text-slate-800">
                      2025-02-15
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">근무 형태</p>
                    <p className="mt-0.5 text-xs text-slate-800">정규직</p>
                  </div>
                  <div>
                    <p className="text-slate-400">위치</p>
                    <p className="mt-0.5 text-xs text-slate-800">
                      서울 강남구
                    </p>
                  </div>
                </div>

                {/* 메모 */}
                <div className="space-y-1 text-[11px] text-slate-500">
                  <p className="text-slate-400">메모</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-800">
                    React, TypeScript 경험 필수. 좋은 회사 문화로 유명함.
                    연봉 협상 가능할 것으로 예상.
                  </p>
                </div>
              </div>
            </div>

            {/* 지원 이력 박스 */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  지원 이력
                </h2>
                <span className="text-[11px] text-slate-400">
                  2025-01-15 지원
                </span>
              </div>

              <div className="space-y-3 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-slate-800">
                    지원 완료
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-slate-400">지원 방법</p>
                    <p className="text-xs text-slate-800">온라인 지원</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-400">상태</p>
                    <p className="text-xs text-slate-800">서류 통과</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-400">메모</p>
                  <p className="text-xs leading-relaxed text-slate-800">
                    포트폴리오와 함께 지원. HR 담당자가 빠른 피드백 약속.
                  </p>
                </div>
              </div>
            </div>

            {/* 관련 면접 일정 박스 */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  관련 면접 일정
                </h2>
              </div>

              <div className="space-y-3 text-[11px] text-slate-500">
                {/* 1차 면접 */}
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    <span className="text-xs text-slate-800">1차 면접</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-800">
                      2025-01-28 14:00
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      화상 면접
                    </p>
                  </div>
                </div>

                {/* 과제 제출 */}
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-xs text-slate-800">
                      과제 제출
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-800">2025-02-03</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      마감일
                    </p>
                  </div>
                </div>

                {/* 2차 면접 */}
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    <span className="text-xs text-slate-800">2차 면접</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-800">
                      2025-02-05 10:00
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      현장 면접
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="mt-1 text-left text-[11px] font-medium text-slate-500 hover:text-slate-700"
              >
                + 새 면접 일정 추가
              </button>
            </div>
          </section>

          
          <aside className="mt-4 w-full space-y-4 md:mt-0 md:w-72">
            {/* 빠른 작업 */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                빠른 작업
              </h2>

              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex w-full justify-start gap-2 text-[11px]"
                >
                  <span>📄</span>
                  <span>공고 정보 수정</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex w-full justify-start gap-2 text-[11px]"
                >
                  <span>📅</span>
                  <span>면접 일정 추가</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex w-full justify-start gap-2 text-[11px]"
                >
                  <span>📝</span>
                  <span>메모 추가</span>
                </Button>
              </div>
            </div>

            {/* 진행 상황 */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                진행 상황
              </h2>

              <div className="space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">지원 상태</span>
                  <span className="text-xs font-medium text-slate-800">
                    서류 통과
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">다음 일정</span>
                  <span className="text-xs font-medium text-slate-800">
                    1차 면접
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">마감까지</span>
                  <span className="text-xs font-medium text-slate-800">
                    19일
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
