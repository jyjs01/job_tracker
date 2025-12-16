"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/src/components/ui/Button";
import FilterSelect from "@/src/components/ui/FilterSelect";

type ApplicationStatus =
  | "준비"
  | "지원 완료"
  | "서류 합격"
  | "면접 진행"
  | "합격"
  | "불합격";

type JobPostingOption = {
  id: string; // job_posting_id
  companyName: string;
  position: string;
  title?: string;
};

const STATUS_OPTIONS: ApplicationStatus[] = [
  "준비",
  "지원 완료",
  "서류 합격",
  "면접 진행",
  "합격",
  "불합격",
];

export default function ApplicationCreatePage() {
  const router = useRouter();

  // TODO: 로그인 유저 id로 대체 (user_id)
  const userId = "me";

  // 더미 job_postings (나중에 DB/API 연동)
  const jobPostings: JobPostingOption[] = useMemo(
    () => [
      { id: "jp_1", companyName: "카카오", position: "프론트엔드 개발자" },
      { id: "jp_2", companyName: "네이버", position: "백엔드 개발자" },
      { id: "jp_3", companyName: "토스", position: "풀스택 개발자" },
      { id: "jp_4", companyName: "라인", position: "DevOps 엔지니어" },
      { id: "jp_5", companyName: "쿠팡", position: "데이터 엔지니어" },
    ],
    []
  );

  const [jobPostingId, setJobPostingId] = useState<string>(
    jobPostings[0]?.id ?? ""
  );
  const [status, setStatus] = useState<ApplicationStatus>("준비");
  const [appliedAt, setAppliedAt] = useState<string>(""); // YYYY-MM-DD
  const [memo, setMemo] = useState<string>("");

  const selectedPosting = useMemo(
    () => jobPostings.find((j) => j.id === jobPostingId),
    [jobPostings, jobPostingId]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      user_id: userId,
      job_posting_id: jobPostingId,
      status,
      applied_at: appliedAt || null,
      memo: memo || null,
    };

    console.log("[CREATE APPLICATION]", payload);
    alert("UI 제출 동작(콘솔 확인) — API 연결은 다음 단계에서 붙이면 돼!");
  };

  return (
    <main className="px-6 py-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/applications" className="hover:text-slate-700">
              지원 이력
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700">지원 추가</span>
          </div>

          <h1 className="mt-2 text-xl font-semibold text-slate-900">
            지원 추가
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            지원 이력을 등록하고 상태를 관리하세요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            type="button"
            onClick={() => router.back()}
          >
            취소
          </Button>

          <Button
            variant="primary"
            size="md"
            type="submit"
            form="create-application-form"
          >
            저장
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        {/* 메인 폼 */}
        <section className="lg:col-span-8">
          <form
            id="create-application-form"
            onSubmit={onSubmit}
            className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="text-sm font-semibold text-slate-900">
              기본 정보
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4">
              {/* job_posting_id */}
              <FilterSelect
                label="공고 선택"
                value={jobPostingId}
                onChange={(e) => setJobPostingId(e.target.value)}
              >
                {jobPostings.map((jp) => (
                  <option key={jp.id} value={jp.id}>
                    {jp.companyName} · {jp.position}
                  </option>
                ))}
              </FilterSelect>

              {/* status */}
              <div>
                <p className="text-[11px] font-medium text-slate-500">
                  상태
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => {
                    const active = s === status;
                    return (
                      <Button
                        key={s}
                        type="button"
                        size="sm"
                        variant={active ? "primary" : "outline"}
                        className="rounded-full"
                        onClick={() => setStatus(s)}
                      >
                        {s}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* applied_at */}
              <div>
                <p className="text-[11px] font-medium text-slate-500">
                  지원 날짜
                </p>
                <input
                  type="date"
                  value={appliedAt}
                  onChange={(e) => setAppliedAt(e.target.value)}
                  className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* memo */}
              <div>
                <p className="text-[11px] font-medium text-slate-500">
                  메모
                </p>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="지원 링크, 준비 내용, 후기 등을 적어두세요."
                  rows={6}
                  className="mt-2 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 하단 액션(모바일) */}
            <div className="mt-6 flex items-center justify-end gap-2 lg:hidden">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                취소
              </Button>
              <Button variant="primary" type="submit">
                저장
              </Button>
            </div>
          </form>
        </section>

        {/* 우측 요약 */}
        <aside className="lg:col-span-4">
            <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col">
                <div className="text-sm font-semibold text-slate-900">미리보기</div>

                <div className="mt-4 flex flex-col gap-3 flex-1 text-sm">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="text-xs font-medium text-slate-500">회사 / 포지션</div>
                    <div className="mt-1 font-semibold text-slate-900">
                    {selectedPosting ? selectedPosting.companyName : "-"}
                    </div>
                    <div className="mt-1 text-slate-700">
                    {selectedPosting ? selectedPosting.position : "-"}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="text-xs font-medium text-slate-500">상태</div>
                    <div className="mt-1 font-semibold text-slate-900">{status}</div>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="text-xs font-medium text-slate-500">지원 날짜</div>
                    <div className="mt-1 font-semibold text-slate-900">
                        {appliedAt || "-"}
                    </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex flex-col flex-1">
                    <div className="text-xs font-medium text-slate-500">메모</div>
                    <div className="mt-1 whitespace-pre-wrap text-slate-700 flex-1">
                    {memo || "-"}
                    </div>
                </div>
                </div>
            </div>
        </aside>

      </div>
    </main>
  );
}
