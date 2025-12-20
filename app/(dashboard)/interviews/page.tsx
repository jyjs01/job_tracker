// app/(dashboard)/interviews/page.tsx
"use client";

import { useMemo, useState } from "react";
import Button from "@/src/components/ui/Button";

type PeriodFilter = "today" | "week" | "month";
type ResultFilter = "all" | "scheduled" | "pass" | "fail";

type ScheduleItem = {
  id: string;
  date: string; // YYYY.MM.DD
  time: string; // HH:mm
  company: string;
  position: string;
  roundOrType: string; // 1차 면접 / 코딩테스트 / 과제 발표 ...
  place: "online" | "offline";
  status: "예정" | "합격" | "불합격";
};

function formatDotDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

// "오늘" 기준으로 더미 일정 생성 (항상 이번 주/달에 걸리도록)
const base = new Date();

const schedules: ScheduleItem[] = [
  {
    id: "1",
    date: formatDotDate(addDays(base, 0)),
    time: "14:00",
    company: "카카오",
    position: "프론트엔드 개발자",
    roundOrType: "1차 면접",
    place: "online",
    status: "예정",
  },
  {
    id: "2",
    date: formatDotDate(addDays(base, 2)),
    time: "10:00",
    company: "네이버",
    position: "백엔드 개발자",
    roundOrType: "코딩테스트",
    place: "offline",
    status: "예정",
  },
  {
    id: "3",
    date: formatDotDate(addDays(base, 5)),
    time: "15:30",
    company: "토스",
    position: "풀스택 개발자",
    roundOrType: "2차 면접",
    place: "online",
    status: "예정",
  },
  {
    id: "4",
    date: formatDotDate(addDays(base, 8)),
    time: "11:00",
    company: "쿠팡",
    position: "데이터 엔지니어",
    roundOrType: "과제 발표",
    place: "offline",
    status: "예정",
  },
  {
    id: "5",
    date: formatDotDate(addDays(base, 12)),
    time: "16:00",
    company: "라인",
    position: "모바일 개발자",
    roundOrType: "최종 면접",
    place: "online",
    status: "예정",
  },
];

function parseKoreanDate(dateStr: string) {
  // "2025.01.15" or "2025-01-15" -> Date
  const normalized = dateStr.replaceAll(".", "-");
  const [y, m, d] = normalized.split("-").map((v) => Number(v));
  return new Date(y, m - 1, d);
}

function startOfDay(d: Date) {
  const nd = new Date(d);
  nd.setHours(0, 0, 0, 0);
  return nd;
}

function endOfDay(d: Date) {
  const nd = new Date(d);
  nd.setHours(23, 59, 59, 999);
  return nd;
}

function startOfWeekMonday(d: Date) {
  const nd = startOfDay(d);
  const day = nd.getDay(); // 0 Sun .. 6 Sat
  const diffToMonday = (day + 6) % 7; // Mon=0
  nd.setDate(nd.getDate() - diffToMonday);
  return nd;
}

function endOfWeekSunday(d: Date) {
  const s = startOfWeekMonday(d);
  const e = endOfDay(new Date(s));
  e.setDate(s.getDate() + 6);
  return e;
}

function startOfMonth(d: Date) {
  return startOfDay(new Date(d.getFullYear(), d.getMonth(), 1));
}

function endOfMonth(d: Date) {
  return endOfDay(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}

function StatusBadge({ status }: { status: ScheduleItem["status"] }) {
  const cls =
    status === "예정"
      ? "bg-slate-100 text-slate-700"
      : status === "합격"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-rose-50 text-rose-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {status}
    </span>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

function PlaceIcon({ place }: { place: ScheduleItem["place"] }) {
  if (place === "online") {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-slate-600">
        <svg width="16" height="16" viewBox="0 0 24 24" className="text-slate-500">
          <path
            fill="currentColor"
            d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-4.5l2 3H15l-2-3H7a3 3 0 0 1-3-3V5zm3-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H7z"
          />
        </svg>
        온라인
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-600">
      <svg width="16" height="16" viewBox="0 0 24 24" className="text-slate-500">
        <path
          fill="currentColor"
          d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1zm13 9H4v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9zM5 6a1 1 0 0 0-1 1v2h16V7a1 1 0 0 0-1-1H5z"
        />
      </svg>
      오프라인
    </span>
  );
}

export default function InterviewsPage() {
  const [period, setPeriod] = useState<PeriodFilter>("today");
  const [result, setResult] = useState<ResultFilter>("scheduled");

  const filtered = useMemo(() => {
    const now = new Date();
    const range =
      period === "today"
        ? { from: startOfDay(now), to: endOfDay(now) }
        : period === "week"
        ? { from: startOfWeekMonday(now), to: endOfWeekSunday(now) }
        : { from: startOfMonth(now), to: endOfMonth(now) };

    return schedules
      .filter((s) => {
        const d = parseKoreanDate(s.date);
        return d >= range.from && d <= range.to;
      })
      .filter((s) => {
        if (result === "all") return true;
        if (result === "scheduled") return s.status === "예정";
        if (result === "pass") return s.status === "합격";
        return s.status === "불합격";
      });
  }, [period, result]);

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6">
          <h1 className="text-lg font-semibold text-slate-900">면접/과제 일정</h1>
          <p className="mt-1 text-xs text-slate-500">
            앞으로의 면접 및 과제 일정을 확인하세요
          </p>
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
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      조건에 맞는 일정이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="bg-white">
                      <td className="px-5 py-5">
                        <div className="text-sm font-semibold text-slate-900">
                          {item.date}
                        </div>
                        <div className="text-xs text-slate-500">{item.time}</div>
                      </td>

                      <td className="px-5 py-5">
                        <div className="text-sm font-semibold text-slate-900">
                          {item.company}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.position}
                        </div>
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
        </section>
      </div>
    </div>
  );
}
