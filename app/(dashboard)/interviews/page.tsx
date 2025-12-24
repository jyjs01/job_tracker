"use client";

import { useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/src/components/ui/Button";
import { StatusBadge, Chip, PlaceIcon } from "./schedule/page.components";
import type { JobPostingListItem } from "@/src/types/jobPostings";
import type { InterviewRow } from "@/src/types/interviews";
import type { ScheduleItem } from "@/src/types/schedule";
import type { ApiErrorResponse } from "@/src/types/error";
import { pickErrorMessage } from "@/src/utils/error";
import { 
  formatDotDate, 
  formatTimeHHmm, 
  startOfDay,
  endOfDay,
  startOfWeekMonday,
  endOfWeekSunday, 
  startOfMonth, 
  endOfMonth, 
  inferPlace } 
from "@/src/utils/interviews";

type PeriodFilter = "today" | "week" | "month";
type ResultFilter = "all" | "scheduled" | "pass" | "fail";

export default function InterviewsPage() {
  const router = useRouter();

  const [period, setPeriod] = useState<PeriodFilter>("today");
  const [result, setResult] = useState<ResultFilter>("scheduled");

  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 채용 공고, 면접/과제 일정 불러오기
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoadError(null);
      setLoading(true);

      try {
        const [interviewsRes, jobPostingsRes] = await Promise.all([
          axios.get<{ data: InterviewRow[] }>("/api/interviews"),
          axios.get<{ data: JobPostingListItem[] }>("/api/job-postings"),
        ]);

        const interviews = interviewsRes.data.data;
        const jobPostings = jobPostingsRes.data.data;

        const jobPostingMap = new Map<string, JobPostingListItem>();
        jobPostings.forEach((jp) => jobPostingMap.set(jp.id, jp));

        const mapped: ScheduleItem[] = interviews
          .filter((it) => !!it.scheduledAt)
          .map((it) => {
            const jp = jobPostingMap.get(it.jobPostingId);
            const d = new Date(it.scheduledAt as string);

            const company = (jp?.companyName ?? "회사").trim();
            const position = (jp?.position ?? jp?.title ?? "-").trim();

            return {
              id: it.id,
              scheduledAt: it.scheduledAt as string,
              date: formatDotDate(d),
              time: formatTimeHHmm(d),
              company,
              position,
              roundOrType: it.type,
              place: inferPlace(it.location),
              status: it.status,
            };
          });

        mapped.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

        if (!mounted) return;
        setItems(mapped);
      } catch (err) {
        const ax = err as AxiosError<ApiErrorResponse>;
        if (!mounted) return;

        if (ax.response?.status === 401) setLoadError("로그인이 필요합니다.");
        else setLoadError(pickErrorMessage(ax.response?.data));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    const range =
      period === "today"
        ? { from: startOfDay(now), to: endOfDay(now) }
        : period === "week"
        ? { from: startOfWeekMonday(now), to: endOfWeekSunday(now) }
        : { from: startOfMonth(now), to: endOfMonth(now) };

    return items
      .filter((s) => {
        const d = new Date(s.scheduledAt);
        return d >= range.from && d <= range.to;
      })
      .filter((s) => {
        if (result === "all") return true;
        if (result === "scheduled") return s.status === "예정";
        if (result === "pass") return s.status === "합격";
        return s.status === "불합격";
      });
  }, [items, period, result]);

  const goDetail = (id: string) => {
    router.push(`/interviews/${id}`);
  };

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">면접/과제 일정</h1>
            <p className="mt-1 text-xs text-slate-500">앞으로의 면접 및 과제 일정을 확인하세요</p>
          </div>

          <Link href="/interviews/create">
            <Button>일정 추가</Button>
          </Link>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600">기간</span>
              <div className="flex items-center gap-2 rounded-full bg-slate-50 p-1">
                <Button
                  size="sm"
                  variant={period === "today" ? "primary" : "ghost"}
                  className="rounded-full"
                  onClick={() => setPeriod("today")}
                >
                  오늘
                </Button>
                <Button
                  size="sm"
                  variant={period === "week" ? "primary" : "ghost"}
                  className="rounded-full"
                  onClick={() => setPeriod("week")}
                >
                  이번 주
                </Button>
                <Button
                  size="sm"
                  variant={period === "month" ? "primary" : "ghost"}
                  className="rounded-full"
                  onClick={() => setPeriod("month")}
                >
                  이번 달
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600">결과</span>
              <div className="flex items-center gap-2 rounded-full bg-slate-50 p-1">
                <Button
                  size="sm"
                  variant={result === "scheduled" ? "primary" : "ghost"}
                  className="rounded-full"
                  onClick={() => setResult("scheduled")}
                >
                  예정
                </Button>
                <Button
                  size="sm"
                  variant={result === "pass" ? "primary" : "ghost"}
                  className="rounded-full"
                  onClick={() => setResult("pass")}
                >
                  합격
                </Button>
                <Button
                  size="sm"
                  variant={result === "fail" ? "primary" : "ghost"}
                  className="rounded-full"
                  onClick={() => setResult("fail")}
                >
                  불합격
                </Button>
                <Button
                  size="sm"
                  variant={result === "all" ? "primary" : "ghost"}
                  className="rounded-full"
                  onClick={() => setResult("all")}
                >
                  전체
                </Button>
              </div>
            </div>
          </div>

          {loadError ? (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {loadError}
            </div>
          ) : null}

          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold text-slate-500">
                  <th className="w-40 px-5 py-4">날짜/시간</th>
                  <th className="px-5 py-4">회사명 + 포지션</th>
                  <th className="w-40 px-5 py-4">라운드/타입</th>
                  <th className="w-[140px] px-5 py-4">장소</th>
                  <th className="w-[120px] px-5 py-4">상태</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">
                      일정을 불러오는 중입니다...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">
                      조건에 맞는 일정이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="bg-white cursor-pointer hover:bg-slate-50 focus-within:bg-slate-50"
                      role="link"
                      tabIndex={0}
                      onClick={() => goDetail(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          goDetail(item.id);
                        }
                      }}
                    >
                      <td className="px-5 py-5">
                        <div className="text-sm font-semibold text-slate-900">{item.date}</div>
                        <div className="text-xs text-slate-500">{item.time}</div>
                      </td>

                      <td className="px-5 py-5">
                        <div className="text-sm font-semibold text-slate-900">{item.company}</div>
                        <div className="text-xs text-slate-500">{item.position}</div>
                      </td>

                      <td className="px-5 py-5">
                        <Chip>{item.roundOrType}</Chip>
                      </td>

                      <td className="px-5 py-5">
                        <PlaceIcon place={item.place} />
                      </td>

                      <td className="px-5 py-5">
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 키보드 포커스 표시 */}
          <style jsx>{`
            tr[role="link"]:focus {
              outline: none;
            }
            tr[role="link"]:focus-visible {
              box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.9);
            }
          `}</style>
        </section>
      </div>
    </div>
  );
}
