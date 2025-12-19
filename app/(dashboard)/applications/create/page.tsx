"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

import Button from "@/src/components/ui/Button";
import FilterSelect from "@/src/components/ui/FilterSelect";

type ApplicationStatus =
  | "준비"
  | "지원 완료"
  | "서류 합격"
  | "면접 진행"
  | "합격"
  | "불합격";

type JobPostingRow = {
  id?: string;
  _id?: string;
  company_name?: string;
  companyName?: string;
  position?: string;
  title?: string;
};

type JobPostingOption = {
  id: string;
  companyName: string;
  position: string;
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

  const [jobPostings, setJobPostings] = useState<JobPostingOption[]>([]);
  const [postingsLoading, setPostingsLoading] = useState(true);
  const [postingsError, setPostingsError] = useState<string | null>(null);

  const [jobPostingId, setJobPostingId] = useState<string>("");
  const [status, setStatus] = useState<ApplicationStatus>("준비");
  const [appliedAt, setAppliedAt] = useState<string>("");
  const [memo, setMemo] = useState<string>("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchJobPostings = async () => {
    try {
      setPostingsLoading(true);
      setPostingsError(null);

      const res = await axios.get("/api/job-postings");
      const data = (res.data?.data ?? []) as JobPostingRow[];

      const mapped: JobPostingOption[] = data
        .map((jp) => {
          const id = String(jp.id ?? jp._id ?? "");
          if (!id) return null;

          const companyName =
            jp.company_name ?? jp.companyName ?? jp.title ?? "회사명 미기입";
          const position = jp.position ?? "-";

          return { id, companyName, position };
        })
        .filter(Boolean) as JobPostingOption[];

      setJobPostings(mapped);

      if (!jobPostingId && mapped.length > 0) {
        setJobPostingId(mapped[0].id);
      }
    } catch (err) {
      console.error("채용 공고 불러오기 오류:", err);
      setPostingsError("채용 공고를 불러오는 중 오류가 발생했습니다.");
      setJobPostings([]);
      setJobPostingId("");
    } finally {
      setPostingsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobPostings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedPosting = useMemo(
    () => jobPostings.find((j) => j.id === jobPostingId),
    [jobPostings, jobPostingId]
  );

  const canSubmit =
    !postingsLoading &&
    !postingsError &&
    !!jobPostingId &&
    jobPostings.length > 0 &&
    !submitLoading;

    const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    try {
      setSubmitLoading(true);
      setSubmitError(null);

      await axios.post("/api/applications", {
        jobPostingId,
        status,
        appliedAt: appliedAt || null,
        memo: memo || null,
      });

      router.push("/applications");
      router.refresh();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { error?: string } | undefined)?.error ??
          err.message ??
          "지원 이력을 저장하는 중 오류가 발생했습니다.";
        setSubmitError(message);
      } else if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("지원 이력을 저장하는 중 오류가 발생했습니다.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };


  return (
    <main className="px-6 py-6">
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
            disabled={submitLoading}
          >
            취소
          </Button>

          <Button
            variant="primary"
            size="md"
            type="submit"
            form="create-application-form"
            disabled={!canSubmit}
          >
            {submitLoading ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <form
            id="create-application-form"
            onSubmit={onSubmit}
            className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="text-sm font-semibold text-slate-900">
              기본 정보
            </div>

            {submitError && (
              <div className="mt-4 rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
                {submitError}
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <FilterSelect
                  label="공고 선택"
                  value={jobPostingId}
                  onChange={(e) => setJobPostingId(e.target.value)}
                  disabled={postingsLoading || !!postingsError || submitLoading}
                >
                  {postingsLoading ? (
                    <option value="">불러오는 중...</option>
                  ) : postingsError ? (
                    <option value="">불러오기 실패</option>
                  ) : jobPostings.length === 0 ? (
                    <option value="">등록된 공고가 없습니다</option>
                  ) : (
                    jobPostings.map((jp) => (
                      <option key={jp.id} value={jp.id}>
                        {jp.companyName} / {jp.position}
                      </option>
                    ))
                  )}
                </FilterSelect>

                {postingsError && (
                  <div className="flex items-center justify-between rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
                    <span>{postingsError}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="h-7 rounded-md px-2 text-[11px]"
                      onClick={fetchJobPostings}
                      disabled={submitLoading}
                    >
                      재시도
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[11px] font-medium text-slate-500">상태</p>

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
                        disabled={submitLoading}
                      >
                        {s}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-medium text-slate-500">
                  지원 날짜
                </p>
                <input
                  type="date"
                  value={appliedAt}
                  onChange={(e) => setAppliedAt(e.target.value)}
                  disabled={submitLoading}
                  className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

              <div>
                <p className="text-[11px] font-medium text-slate-500">메모</p>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="지원 링크, 준비 내용, 후기 등을 적어두세요."
                  rows={6}
                  disabled={submitLoading}
                  className="mt-2 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 lg:hidden">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
                disabled={submitLoading}
              >
                취소
              </Button>
              <Button variant="primary" type="submit" disabled={!canSubmit}>
                {submitLoading ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </section>

        <aside className="lg:col-span-4">
          <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col">
            <div className="text-sm font-semibold text-slate-900">미리보기</div>

            <div className="mt-4 flex flex-col gap-3 flex-1 text-sm">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs font-medium text-slate-500">
                  회사 / 포지션
                </div>
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
                  <div className="mt-1 font-semibold text-slate-900">
                    {status}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-500">
                    지원 날짜
                  </div>
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
