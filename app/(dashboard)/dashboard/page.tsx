"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import StatCard from "@/src/components/dashboard/StatCard";
import Button from "@/src/components/ui/Button";
import { FileText, BadgeCheck, CalendarClock } from "lucide-react";
import InterviewCard, { InterviewItem } from "@/src/components/dashboard/InterviewCard";
import ClosingJobCard, { ClosingJobItem, JobRole } from "@/src/components/dashboard/ClosingJobCard";
import { 
  isObject, 
  asArray, 
  getUnknown,
  pad2,
  formatYmd,
  parseDueDate,
  toDday,
  weekRange,
  calcPassRate,
  isDocPassed,
  pickFirstString,
  pickFirstDate,
  isJobRole,
  getDefaultVM
} from "@/src/utils/dashboard";
import type { DashboardVM } from "@/src/types/dashboard";

export default function DashboardPage() {
  const router = useRouter();

  const [vm, setVm] = useState<DashboardVM>(() => getDefaultVM());
  const [loading, setLoading] = useState(true);

  const defaultVm = useMemo(() => getDefaultVM(), []);

  // 정보 조회
  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);

      try {
        const [applicationsRes, jobPostingsRes, interviewsRes] =
          await Promise.all([
            axios.get("/api/applications"),
            axios.get("/api/job-postings"),
            axios.get("/api/interviews"),
          ]);

        const appsPayload = isObject(applicationsRes.data)
          ? applicationsRes.data
          : null;
        const jobsPayload = isObject(jobPostingsRes.data)
          ? jobPostingsRes.data
          : null;
        const interviewsPayload = isObject(interviewsRes.data)
          ? interviewsRes.data
          : null;

        const applications = asArray(appsPayload?.data)
          .filter(isObject)
          .map((x) => x);

        const jobPostings = asArray(jobsPayload?.data)
          .filter(isObject)
          .map((x) => x);

        const interviews = asArray(interviewsPayload?.data)
          .filter(isObject)
          .map((x) => x);

        const totalApplications = applications.length;
        const passedDocs = applications.filter((a) =>
          isDocPassed(getUnknown(a, "status"))
        ).length;

        const { start: weekStart, end: weekEnd } = weekRange(new Date());

        const weeklyApplied = applications.filter((a) => {
          const d = pickFirstDate(a, [
            "appliedAt",
            "applied_at",
            "createdAt",
            "created_at",
          ]);
          if (!d) return false;
          return d >= weekStart && d <= weekEnd;
        }).length;

        const thisWeekInterviews = interviews.filter((row) => {
          const d = pickFirstDate(row, [
            "dateTime",
            "scheduledAt",
            "scheduled_at",
            "interviewAt",
            "interview_at",
            "startAt",
            "start_at",
          ]);
          if (!d) return false;
          return d >= weekStart && d <= weekEnd;
        }).length;

        const now = new Date();

        const upcomingInterviews: InterviewItem[] = interviews
          .map((row) => {
            const when = pickFirstDate(row, [
              "dateTime",
              "scheduledAt",
              "scheduled_at",
              "interviewAt",
              "interview_at",
              "startAt",
              "start_at",
            ]);
            if (!when) return null;

            const company = pickFirstString(row, ["companyName", "company"]);
            const position = pickFirstString(row, ["position"]);
            const baseTitle =
              pickFirstString(row, ["title", "jobTitle", "jobPostingTitle"]) ||
              "면접";
            const title =
              company && position ? `${company} - ${position}` : baseTitle;

            const step =
              pickFirstString(row, ["step", "round", "type", "stage"]) || "면접";

            return {
              item: {
                day: pad2(when.getDate()),
                title,
                step,
                dateTime: `${formatYmd(when)} ${pad2(when.getHours())}:${pad2(
                  when.getMinutes()
                )}`,
                dday: toDday(when),
              } satisfies InterviewItem,
              when,
            };
          })
          .filter((x): x is { item: InterviewItem; when: Date } => x !== null)
          .filter((x) => x.when.getTime() >= now.getTime())
          .sort((a, b) => a.when.getTime() - b.when.getTime())
          .slice(0, 3)
          .map((x) => x.item);

        const closingJobs: ClosingJobItem[] = jobPostings
          .map((jp) => {
            const due = parseDueDate(getUnknown(jp, "dueDate"));
            if (!due) return null;

            const company = pickFirstString(jp, ["companyName"]) || "회사";
            const titleRaw = pickFirstString(jp, ["title"]) || "채용 공고";
            const employmentType = pickFirstString(jp, ["employmentType"]) || "—";

            const location = pickFirstString(jp, ["location"]);
            const locationInfo = location ? `근무지: ${location}` : "근무지: —";

            const roleRaw = pickFirstString(jp, ["position"]);
            const role: JobRole = isJobRole(roleRaw) ? roleRaw : "프론트엔드";

            return {
              item: {
                title: `${company} - ${titleRaw}`,
                role,
                companyInfo: employmentType,
                locationInfo,
                dueDate: `마감: ${formatYmd(due)}`,
                dday: toDday(due),
              } satisfies ClosingJobItem,
              due,
            };
          })
          .filter((x): x is { item: ClosingJobItem; due: Date } => x !== null)
          .filter((x) => x.due.getTime() >= now.getTime())
          .sort((a, b) => a.due.getTime() - b.due.getTime())
          .slice(0, 3)
          .map((x) => x.item);

        if (alive) {
          setVm({
            stats: {
              totalApplications,
              passedDocs,
              passRate: calcPassRate(passedDocs, totalApplications),
              weeklyApplied,
              thisWeekInterviews,
            },
            upcomingInterviews,
            closingJobs,
          });
        }
      } catch (e: unknown) {
        const status =
          axios.isAxiosError(e) && e.response ? e.response.status : null;

        if (status === 401) {
          router.replace("/login");
          return;
        }

        if (alive) setVm(defaultVm);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [router, defaultVm]);

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
        <StatCard
          label="총 지원 개수"
          value={loading ? "—" : String(vm.stats.totalApplications)}
          subText={loading ? "불러오는 중..." : `이번 주 ${vm.stats.weeklyApplied}건 추가`}
          rightIcon={<FileText className="h-4 w-4 opacity-90" />}
        />
        <StatCard
          label="서류 합격 개수"
          value={loading ? "—" : String(vm.stats.passedDocs)}
          subText={loading ? "불러오는 중..." : `합격률 ${vm.stats.passRate}`}
          rightIcon={<BadgeCheck className="h-4 w-4 opacity-90" />}
        />
        <StatCard
          label="이번 주 면접 예정"
          value={loading ? "—" : String(vm.stats.thisWeekInterviews)}
          subText="이번 주 기준 가까운 면접"
          rightIcon={<CalendarClock className="h-4 w-4 opacity-90" />}
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
            {loading ? (
              <p className="text-sm text-slate-500">불러오는 중...</p>
            ) : vm.upcomingInterviews.length === 0 ? (
              <p className="text-sm text-slate-500">예정된 면접이 없습니다.</p>
            ) : (
              vm.upcomingInterviews.map((item) => (
                <InterviewCard key={item.title + item.dateTime} item={item} />
              ))
            )}
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
            {loading ? (
              <p className="text-sm text-slate-500">불러오는 중...</p>
            ) : vm.closingJobs.length === 0 ? (
              <p className="text-sm text-slate-500">
                마감 임박 공고가 없습니다.
              </p>
            ) : (
              vm.closingJobs.map((job) => (
                <ClosingJobCard key={job.title + job.dueDate} job={job} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
