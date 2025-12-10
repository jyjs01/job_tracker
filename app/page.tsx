import Link from "next/link";
import Button from "@/src/components/ui/Button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50">
      {/* 상단 네비게이션바 */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-sm font-bold text-blue-400">
            JT
          </div>
          <span className="text-base font-semibold tracking-wide">
            JobTracker
          </span>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-16 pt-4 md:flex-column md:items-center">
        {/* 상단: 소개 + 시작하기버튼 */}
        <section className="flex-1">
          <p className="inline-flex items-center gap-2 rounded-full bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            취업 준비 현황을 한눈에 정리하는 대시보드
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            흩어진{" "}
            <span className="bg-linear-to-r from-blue-400 to-emerald-300 bg-clip-text text-transparent">
              채용 공고·지원 이력·면접 일정
            </span>
            을
            <br className="hidden md:block" /> 한 곳에서 관리하세요.
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
            매번 북마크와 엑셀을 뒤적이지 말고,
            <br className="md:hidden" /> 관심 공고, 지원 현황, 면접 일정을
            JobTracker에서 한 번에 관리하세요.
            <br />
            개인 포트폴리오 프로젝트로 설계한, 취준생을 위한 가볍고 직관적인
            도구입니다.
          </p>

          {/* 시작하기버튼 */}
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Link href="/login">
              <Button variant="outline" size="lg">
                시작하기
              </Button>
            </Link>
          </div>

          {/* 작은 설명 */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
              지원한 공고 수, 합격·불합 통계, 면접 일정까지 한 번에 확인
            </div>
            <div className="hidden h-3 w-px bg-slate-700 md:block" />
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400/80" />
              Next.js + MongoDB 기반 개인 프로젝트
            </div>
          </div>
        </section>

        {/* 하단: 기능 요약 카드 묶음 */}
        <section className="flex-1">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-900/70 p-4 ring-1 ring-slate-800/70">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/15 text-sm">
                  📌
                </span>
                채용 공고 모아보기
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                관심 있는 공고를 등록하고 마감일, 근무 형태, 위치를 기준으로
                정리합니다. 
                <br />
                더 이상 북마크와 캡처에 묻히지 않아요.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900/70 p-4 ring-1 ring-slate-800/70">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15 text-sm">
                  📝
                </span>
                지원 이력/진행 단계 관리
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                서류 제출 여부, 과제, 코딩테스트, 면접 단계까지
                각 공고별 진행 상황을 
                <br />
                타임라인처럼 관리할 수 있습니다.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900/70 p-4 ring-1 ring-slate-800/70 md:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15 text-sm">
                    📅
                  </span>
                  면접 일정 & 주간 뷰
                </div>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                  예: 이번 주 면접 2건
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                면접 날짜와 시간을 등록해 한 주 일정을 한눈에 확인하고,
                겹치는 일정을 피할 수 있도록 도와줍니다.
              </p>

              {/* 간단한 가짜 미니 캘린더 UI */}
              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-slate-400">
                <span>월</span>
                <span>화</span>
                <span>수</span>
                <span>목</span>
                <span>금</span>
                <span>토</span>
                <span>일</span>
                <span className="rounded-md bg-slate-800/80 py-1 text-xs text-slate-200">
                  10
                </span>
                <span className="rounded-md bg-slate-800/80 py-1 text-xs text-slate-200">
                  11
                </span>
                <span className="rounded-md bg-emerald-500/80 py-1 text-xs text-slate-900">
                  12
                </span>
                <span className="rounded-md bg-slate-800/80 py-1 text-xs text-slate-200">
                  13
                </span>
                <span className="rounded-md bg-amber-400/80 py-1 text-xs text-slate-900">
                  14
                </span>
                <span className="rounded-md bg-slate-800/80 py-1 text-xs text-slate-200">
                  15
                </span>
                <span className="rounded-md bg-slate-800/80 py-1 text-xs text-slate-200">
                  16
                </span>
              </div>
            </div>
          </div>

          {/* 아래 작은 텍스트 */}
          <p className="mt-3 text-xs text-slate-400">
            ※ 실제 데이터 연동 전까지는 Mock 데이터로 UI를 구성한 뒤,
            이후 MongoDB · API 연동을 통해 실사용 도구로 확장할 수 있습니다.
          </p>
        </section>
      </div>

      {/* 페이지 맨 아래 */}
      <footer className="border-t border-slate-800/70 bg-slate-950/50">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} JobTracker</span>
          <span>개인 포트폴리오용 프로젝트 · Next.js + MongoDB</span>
        </div>
      </footer>
    </main>
  );
}
