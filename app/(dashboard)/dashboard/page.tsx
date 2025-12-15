import Link from "next/link";
import StatCard from "@/src/components/dashboard/StatCard";
import Button from "@/src/components/ui/Button";
import InterviewCard, { InterviewItem } from "@/src/components/dashboard/InterviewCard";
import ClosingJobCard, { ClosingJobItem } from "@/src/components/dashboard/ClosingJobCard";

const upcomingInterviews: InterviewItem[] = [
  {
    day: "27",
    title: "네이버 - 프론트엔드 개발자",
    step: "1차 기술면접",
    dateTime: "2025-01-27 14:00",
    dday: "D-2",
  },
  {
    day: "29",
    title: "카카오 - 앱 개발자",
    step: "최종면접",
    dateTime: "2025-01-29 10:30",
    dday: "D-4",
  },
  {
    day: "30",
    title: "토스 - 백엔드 개발자",
    step: "1차 기술면접",
    dateTime: "2025-01-30 16:00",
    dday: "D-5",
  },
];

const closingJobs: ClosingJobItem[] = [
  {
    title: "라인 - 소프트웨어 엔지니어",
    companyInfo: "신입 / 정규직",
    locationInfo: "근무지: 서울",
    dueDate: "마감: 2025-01-27",
    dday: "D-2",
  },
  {
    title: "쿠팡 - 풀스택 개발자",
    companyInfo: "신입 · 경력",
    locationInfo: "근무지: 성수",
    dueDate: "마감: 2025-01-28",
    dday: "D-3",
  },
  {
    title: "배달의민족 - 프론트엔드",
    companyInfo: "경력 2년+ · 중급",
    locationInfo: "근무지: 송파",
    dueDate: "마감: 2025-01-28",
    dday: "D-3",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 cursor-default">
      {/* 상단 제목 */}
      <section>
        <h1 className="text-xl font-semibold text-slate-900">대시보드</h1>
        <p className="mt-1 text-sm text-slate-500">
          오늘 할 일과 중요한 일정을 확인해보세요.
        </p>
      </section>

      {/* 통계 카드 영역 */}
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="총 지원 개수" value="24" subText="이번 주 3건 추가" />
        <StatCard label="서류 합격 개수" value="8" subText="합격률 33.3%" />
        <StatCard
          label="이번 주 면접 예정"
          value="3"
          subText="이번 주 기준 가까운 면접"
        />
      </section>

      {/* 아래 2단 레이아웃 */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* 다가오는 면접 일정 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              다가오는 면접 일정
            </h2>
            <Link href="/interviews">
              <Button
                variant="text"
                size="sm"
                className="text-slate-400 hover:text-slate-600"
              >
                전체 보기
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingInterviews.map((item) => (
              <InterviewCard key={item.title + item.dateTime} item={item} />
            ))}
          </div>
        </div>

        {/* 마감 임박 공고 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              마감 임박 공고
            </h2>
            <Link href="/job-postings">
              <Button
                variant="text"
                size="sm"
                className="text-slate-400 hover:text-slate-600"
              >
                전체 보기
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {closingJobs.map((job) => (
              <ClosingJobCard key={job.title + job.dueDate} job={job} />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            fullWidth
            className="mt-4 bg-slate-50 text-slate-500 hover:bg-slate-100"
          >
            새로운 공고 찾아보기
          </Button>
        </div>
      </section>
    </div>
  );
}
