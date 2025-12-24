"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Button from "@/src/components/ui/Button";
import FilterSelect from "@/src/components/ui/FilterSelect";
import type { JobPostingListItem, DeadlineFilter, SourceFilter } from "@/src/types/jobPostings";
import { formatDate, getDeadlineStatus, getPagesToShow } from "@/src/utils/jobPostings";


export default function JobPostingsPage() {
  const [jobPostings, setJobPostings] = useState<JobPostingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>("전체");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("전체");

  const [page, setPage] = useState(1);
  const pageSize = 5;

  // 채용 공고 불러오기
  useEffect(() => {

    const fetchJobPostings = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/job-postings");
        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();
        const data = (json?.data ?? []) as JobPostingListItem[];

        setJobPostings(data);
      } catch (err) {
        console.error("채용 공고 불러오기 오류:", err);
        setError("채용 공고를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, []);

  // 필터 바뀌면 1페이지로
  useEffect(() => {
    setPage(1);
  }, [deadlineFilter, sourceFilter]);

  // 필터 리셋
  const handleResetFilters = useCallback(() => {
    setDeadlineFilter("전체");
    setSourceFilter("전체");
  }, []);

  const filteredJobPostings = useMemo(() => {
    return jobPostings.filter((job) => {
      if (deadlineFilter !== "전체") {
        const status = getDeadlineStatus(job.dueDate);
        if (status !== deadlineFilter) return false;
      }

      if (sourceFilter !== "전체") {
        if (!job.source) return false;
        if (job.source !== sourceFilter) return false;
      }

      return true;
    });
  }, [jobPostings, deadlineFilter, sourceFilter]);

  const total = filteredJobPostings.length;

  const totalPages = useMemo(() => {
    return total === 0 ? 1 : Math.ceil(total / pageSize);
  }, [total, pageSize]);

  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const paginatedJobPostings = useMemo(() => {
    return filteredJobPostings.slice(startIndex, endIndex);
  }, [filteredJobPostings, startIndex, endIndex]);

  const pagesToShow = useMemo(() => {
    return getPagesToShow(currentPage, totalPages, 3);
  }, [currentPage, totalPages]);

  return (
    <div className="px-6 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">채용 공고 관리</h1>
            <p className="mt-1 text-xs text-slate-500">
              지원할 공고를 등록하고 한 곳에서 관리해 보세요.
            </p>
          </div>

          <Link href="/job-postings/create">
            <Button variant="primary" size="md" className="gap-1 rounded-full shadow-sm">
              <span className="text-sm">＋</span>
              <span className="text-xs">공고 등록</span>
            </Button>
          </Link>
        </div>

        {/* 필터 카드 */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-900">필터</h2>
            <Button
              variant="text"
              size="sm"
              className="text-[11px]"
              type="button"
              onClick={handleResetFilters}
            >
              초기화
            </Button>
          </div>

          <div className="grid gap-4 px-6 py-4 md:grid-cols-2">
            <FilterSelect
              label="마감일 상태"
              value={deadlineFilter}
              onChange={(e) => setDeadlineFilter(e.target.value as DeadlineFilter)}
            >
              <option value="전체">전체</option>
              <option value="마감 지남">마감 지남</option>
              <option value="마감 임박">마감 임박</option>
              <option value="여유 있음">여유 있음</option>
            </FilterSelect>

            <FilterSelect
              label="소스"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}
            >
              <option value="전체">전체</option>
              <option value="사람인">사람인</option>
              <option value="잡코리아">잡코리아</option>
              <option value="회사 채용 홈페이지">회사 채용 홈페이지</option>
            </FilterSelect>
          </div>
        </section>

        {/* 목록 카드 */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">채용 공고 목록</h2>
              <p className="mt-1 text-xs text-slate-500">
                등록한 채용 공고를 한눈에 확인해 보세요.
              </p>
            </div>
            <p className="text-[11px] text-slate-400">총 {total}개 공고</p>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-center text-xs text-slate-400">
              채용 공고를 불러오는 중입니다...
            </div>
          ) : error ? (
            <div className="px-6 py-10 text-center text-xs text-rose-500">{error}</div>
          ) : total === 0 ? (
            <div className="px-6 py-10 text-center text-xs text-slate-400">
              조건에 맞는 채용 공고가 없습니다.
              <br />
              필터를 변경하거나 오른쪽 상단의 <span className="font-semibold">공고 등록</span> 버튼으로
              새 공고를 추가해 보세요.
            </div>
          ) : (
            <>
              {/* 헤더(데스크탑) */}
              <div className="hidden items-center px-6 py-3 text-[11px] font-medium text-slate-400 lg:flex">
                <div className="flex-2">공고 / 회사</div>
                <div className="flex-[1.4]">직무 / 고용 형태</div>
                <div className="flex-[1.2]">소스</div>
                <div className="flex-1">근무지</div>
                <div className="flex-1">마감일</div>
                <div className="w-8 text-right" />
              </div>

              {/* 목록 */}
              <div>
                {paginatedJobPostings.map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col border-t border-slate-100 px-4 py-3 text-xs text-slate-700 hover:bg-slate-50 lg:flex-row lg:items-center lg:px-6"
                  >
                    <div className="flex-2">
                      <p className="text-xs font-medium text-slate-900">{job.title}</p>
                      {job.companyName && (
                        <p className="mt-0.5 text-[11px] text-slate-500">{job.companyName}</p>
                      )}
                    </div>

                    <div className="mt-2 flex-[1.4] lg:mt-0">
                      <p className="text-[11px] text-slate-500">{job.position || "-"}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {job.employmentType || "고용 형태 미기입"}
                      </p>
                    </div>

                    <div className="mt-2 flex-[1.2] text-[11px] text-slate-500 lg:mt-0">
                      {job.source || "-"}
                    </div>

                    <div className="mt-2 flex-1 text-[11px] text-slate-500 lg:mt-0">
                      {job.location || "-"}
                    </div>

                    <div className="mt-1 flex-1 text-[11px] text-slate-500 lg:mt-0">
                      {job.dueDate ? formatDate(job.dueDate) : "-"}
                    </div>

                    <div className="mt-2 flex w-full justify-end lg:mt-0 lg:w-auto lg:text-right">
                      <Link href={`/job-postings/${job.id}`}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 whitespace-nowrap rounded-full px-2 text-[11px] text-slate-500 hover:text-slate-700"
                          aria-label="공고 상세 보기"
                        >
                          <span>상세</span>
                          <span className="ml-1 text-xs">›</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-[11px] text-slate-400 lg:px-6">
                <p>
                  {startIndex + 1}-{endIndex} of {total} results
                </p>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 rounded-md px-0 text-xs"
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  >
                    ‹
                  </Button>

                  {pagesToShow.map((p) => (
                    <Button
                      key={p}
                      variant={p === currentPage ? "primary" : "outline"}
                      size="sm"
                      className="h-7 w-7 rounded-md px-0 text-xs"
                      type="button"
                      disabled={p === currentPage}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 rounded-md px-0 text-xs"
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  >
                    ›
                  </Button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
