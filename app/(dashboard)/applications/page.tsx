"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ApplicationStatus =
  | "준비"
  | "지원 완료"
  | "서류 합격"
  | "면접 진행"
  | "합격"
  | "불합격";

type ApplicationRow = {
  id: string;
  companyName: string;
  position: string;
  status: ApplicationStatus;
  currentStep: string;
  appliedAt?: string;
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

const PAGE_SIZE = 6;

function getInitial(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed[0].toUpperCase();
}

function badgeClass(status: ApplicationStatus) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium";
  switch (status) {
    case "준비":
      return `${base} border-slate-200 bg-slate-50 text-slate-700`;
    case "지원 완료":
      return `${base} border-slate-200 bg-white text-slate-700`;
    case "서류 합격":
      return `${base} border-emerald-200 bg-emerald-50 text-emerald-700`;
    case "면접 진행":
      return `${base} border-blue-200 bg-blue-50 text-blue-700`;
    case "합격":
      return `${base} border-purple-200 bg-purple-50 text-purple-700`;
    case "불합격":
      return `${base} border-rose-200 bg-rose-50 text-rose-700`;
    default:
      return `${base} border-slate-200 bg-white text-slate-700`;
  }
}

export default function ApplicationsPage() {
  const [status, setStatus] = useState<(typeof STATUS_TABS)[number]>("전체");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  // 더미 데이터 (나중에 DB/API로 교체)
  const rows: ApplicationRow[] = useMemo(
    () => [
      {
        id: "1",
        companyName: "카카오",
        position: "프론트엔드 개발자",
        status: "면접 진행",
        currentStep: "2차 면접 대기",
        appliedAt: "2025-01-15",
      },
      {
        id: "2",
        companyName: "네이버",
        position: "백엔드 개발자",
        status: "서류 합격",
        currentStep: "1차 면접 준비",
        appliedAt: "2025-01-10",
      },
      {
        id: "3",
        companyName: "토스",
        position: "풀스택 개발자",
        status: "지원 완료",
        currentStep: "서류 검토 중",
        appliedAt: "2025-01-08",
      },
      {
        id: "4",
        companyName: "라인",
        position: "DevOps 엔지니어",
        status: "합격",
        currentStep: "최종 합격",
        appliedAt: "2024-12-20",
      },
      {
        id: "5",
        companyName: "쿠팡",
        position: "데이터 엔지니어",
        status: "불합격",
        currentStep: "서류 탈락",
        appliedAt: "2024-12-15",
      },
      {
        id: "6",
        companyName: "배달의민족",
        position: "모바일 개발자",
        status: "준비",
        currentStep: "지원서 작성 중",
      },
      // 페이지네이션 UI 확인용 더미
      {
        id: "7",
        companyName: "당근",
        position: "프론트엔드 개발자",
        status: "준비",
        currentStep: "공고 탐색 중",
        appliedAt: "2024-12-10",
      },
      {
        id: "8",
        companyName: "우아한형제들",
        position: "프론트엔드 개발자",
        status: "지원 완료",
        currentStep: "서류 검토 중",
        appliedAt: "2024-12-08",
      },
      {
        id: "9",
        companyName: "카페24",
        position: "웹 개발자",
        status: "서류 합격",
        currentStep: "코딩테스트 대기",
        appliedAt: "2024-12-05",
      },
      {
        id: "10",
        companyName: "NHN",
        position: "프론트엔드 개발자",
        status: "면접 진행",
        currentStep: "1차 면접 완료",
        appliedAt: "2024-12-03",
      },
      {
        id: "11",
        companyName: "KT",
        position: "웹 개발자",
        status: "불합격",
        currentStep: "코딩테스트 탈락",
        appliedAt: "2024-12-01",
      },
      {
        id: "12",
        companyName: "삼성",
        position: "소프트웨어 개발자",
        status: "지원 완료",
        currentStep: "서류 제출 완료",
        appliedAt: "2024-11-28",
      },
    ],
    []
  );

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
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">지원 이력</h1>
          <p className="mt-1 text-sm text-slate-500">
            현재 진행 중인 지원 현황을 확인하고 관리하세요
          </p>
        </div>

        <Link
          href="/applications/new"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-950"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/10">
            +
          </span>
          새 지원 추가
        </Link>
      </div>

      {/* 필터 카드 */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">필터</div>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            <span className="inline-block rotate-0">↻</span>
            초기화
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* 상태 탭 */}
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

          {/* 검색 */}
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

      {/* 목록 카드 */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">지원 목록</div>
          <div className="text-xs text-slate-500">
            총 <span className="font-semibold text-slate-700">{total}</span>개
            지원
          </div>
        </div>

        {/* 테이블 헤더 */}
        <div className="grid grid-cols-12 border-t border-slate-100 bg-slate-50 px-5 py-3 text-[11px] font-semibold text-slate-500">
          <div className="col-span-4">회사명</div>
          <div className="col-span-3">포지션</div>
          <div className="col-span-2">상태</div>
          <div className="col-span-2">현재 단계</div>
          <div className="col-span-1 text-right">지원 날짜</div>
        </div>

        {/* 테이블 바디 */}
        <div className="divide-y divide-slate-100">
          {paged.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              조건에 맞는 지원 이력이 없습니다.
            </div>
          ) : (
            paged.map((r) => (
              <Link
                key={r.id}
                href={`/applications/${r.id}`}
                className="grid grid-cols-12 items-center px-5 py-4 hover:bg-slate-50"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-700 text-xs font-bold text-white">
                    {getInitial(r.companyName)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {r.companyName}
                    </div>
                  </div>
                </div>

                <div className="col-span-3 truncate text-sm font-medium text-slate-900">
                  {r.position}
                </div>

                <div className="col-span-2">
                  <span className={badgeClass(r.status)}>{r.status}</span>
                </div>

                <div className="col-span-2 truncate text-sm text-slate-700">
                  {r.currentStep}
                </div>

                <div className="col-span-1 flex items-center justify-end gap-3">
                  <span className="text-sm text-slate-700">
                    {r.appliedAt ?? "-"}
                  </span>
                  <span className="text-slate-300">›</span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* 푸터 / 페이지네이션 */}
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
