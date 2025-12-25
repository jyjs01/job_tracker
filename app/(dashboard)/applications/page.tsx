"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { JobPostingListItem } from "@/src/types/jobPostings";
import type { ApplicationRow, ApplicationStatus } from "@/src/types/applications";
import { getInitial, badgeClass } from "@/src/utils/applications";

type ApplicationListRow = Pick<ApplicationRow, "id" | "status" | "appliedAt"> & {
  companyName: string;
  position: string;
};

const STATUS_TABS: Array<"전체" | ApplicationStatus> = [
  "전체",
  "준비",
  "지원 완료",
  "서류 합격",
  "면접 진행",
  "합격",
  "불합격",
];

export default function ApplicationsPage() {
  const [status, setStatus] = useState<(typeof STATUS_TABS)[number]>("전체");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const [rows, setRows] = useState<ApplicationListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 지원 이력 불러오기
  const fetchRows = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const [appsRes, postingsRes] = await Promise.all([
        axios.get("/api/applications"),
        axios.get("/api/job-postings"),
      ]);

      const applications = (appsRes.data?.data ?? []) as ApplicationRow[];
      const jobPostings = (postingsRes.data?.data ?? []) as JobPostingListItem[];

      const postingMap = new Map<string, JobPostingListItem>();
      for (const jp of jobPostings) {
        postingMap.set(jp.id, jp);
      }

      const merged: ApplicationListRow[] = applications.map((app) => {
        const posting = postingMap.get(app.jobPostingId);

        const companyName = posting?.companyName ?? "회사명 미기입";
        const position = posting?.position ?? "-";

        return {
          id: app.id,
          companyName,
          position,
          status: app.status,
          appliedAt: app.appliedAt,
        };
      });

      setRows(merged);
      setPage(1);
    } catch (err) {
      console.error("지원 이력 불러오기 오류:", err);
      setErrorMsg("지원 이력을 불러오는 중 오류가 발생했습니다.");
      setRows([]);
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const filtered = useMemo(() => {
    const byStatus =
      status === "전체" ? rows : rows.filter((r) => r.status === status);

    const kw = keyword.trim().toLowerCase();
    const byKeyword = !kw
      ? byStatus
      : byStatus.filter((r) => r.companyName.toLowerCase().includes(kw));

    return byKeyword;
  }, [rows, status, keyword]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const rangeText = useMemo(() => {
    if (total === 0) return "0-0 of 0 results";
    const start = (safePage - 1) * PAGE_SIZE + 1;
    const end = Math.min(safePage * PAGE_SIZE, total);
    return `${start}-${end} of ${total} results`;
  }, [total, safePage]);

  const reset = () => {
    setStatus("전체");
    setKeyword("");
    setPage(1);
  };

  return (
    <main className="px-6 py-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">지원 이력</h1>
          <p className="mt-1 text-sm text-slate-500">
            현재 진행 중인 지원 현황을 확인하고 관리하세요
          </p>
        </div>

        <Link
          href="/applications/create"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-950"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/10">
            +
          </span>
          새 지원 추가
        </Link>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">필터</div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              <span className="inline-block rotate-0">↻</span>
              초기화
            </button>

            <button
              type="button"
              onClick={fetchRows}
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-700"
              disabled={loading}
            >
              ⟳ 새로고침
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="text-xs font-medium text-slate-500">상태</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {STATUS_TABS.map((t) => {
                const active = t === status;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setStatus(t);
                      setPage(1);
                    }}
                    className={[
                      "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                      active
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="text-xs font-medium text-slate-500">회사명 검색</div>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span className="text-slate-400">🔎</span>
              <input
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1);
                }}
                placeholder="회사명을 입력하세요"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">지원 목록</div>
          <div className="text-xs text-slate-500">
            총 <span className="font-semibold text-slate-700">{total}</span>개
            지원
          </div>
        </div>

        <div className="hidden md:grid grid-cols-12 border-t border-slate-100 bg-slate-50 px-5 py-3 text-[11px] font-semibold text-slate-500">
          <div className="col-span-5">회사명</div>
          <div className="col-span-4">포지션</div>
          <div className="col-span-2">상태</div>
          <div className="col-span-1 text-right">지원 날짜</div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              불러오는 중...
            </div>
          ) : errorMsg ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-rose-600">{errorMsg}</p>
              <button
                type="button"
                onClick={fetchRows}
                className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                다시 시도
              </button>
            </div>
          ) : paged.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              조건에 맞는 지원 이력이 없습니다.
            </div>
          ) : (
            paged.map((r) => (
              <Link
                key={r.id}
                href={`/applications/${r.id}`}
                className="block px-5 py-4 hover:bg-slate-50 md:grid md:grid-cols-12 md:items-center"
              >
                <div className="flex items-center justify-between gap-3 md:col-span-5 md:justify-start">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-xs font-bold text-white">
                      {getInitial(r.companyName)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {r.companyName}
                      </div>
                    </div>
                  </div>

                  <div className="md:hidden">
                    <span className={`${badgeClass(r.status)} whitespace-nowrap`}>
                      {r.status}
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-3 md:col-span-7 md:mt-0 md:grid md:grid-cols-7 md:items-center">
                  <div className="text-sm font-medium text-slate-900 md:col-span-4 md:truncate">
                    {r.position}
                  </div>

                  <div className="hidden md:block md:col-span-2">
                    <span className={`${badgeClass(r.status)} whitespace-nowrap`}>
                      {r.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 md:col-span-1 md:justify-end">
                    <span className="text-sm text-slate-700 whitespace-nowrap">
                      {r.appliedAt ?? "-"}
                    </span>
                    <span className="text-slate-300 hidden md:inline">›</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          <div className="text-xs text-slate-500">{rangeText}</div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 disabled:opacity-40"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
              const p = i + 1;
              const active = p === safePage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={[
                    "inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold",
                    active
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
