"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Button from "@/src/components/ui/Button";
import type { JobPostingDocument } from "@/src/types/jobPostings";
import type { ApplicationRow, ApplicationStatus } from "@/src/types/applications";

type JobPostingWithId = JobPostingDocument & {
  id: string;
};

function formatDate(value?: string | Date) {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "-";
  return d.toISOString().slice(0, 10);
}

function dueInText(value?: string | Date) {
  if (!value) return "-";

  const due = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(due.getTime())) return "-";

  const today = new Date();
  const a = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const b = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();

  const diffDays = Math.ceil((b - a) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "마감";
  if (diffDays === 0) return "오늘";
  return `${diffDays}일`;
}


function statusDot(status: ApplicationStatus) {
  if (status === "합격") return "bg-emerald-500";
  if (status === "불합격") return "bg-rose-500";
  if (status === "면접 진행") return "bg-sky-500";
  if (status === "서류 합격") return "bg-indigo-500";
  if (status === "지원 완료") return "bg-emerald-500";
  return "bg-slate-400";
}

export default function JobPostingDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const [jobPosting, setJobPosting] = useState<JobPostingWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [application, setApplication] = useState<ApplicationRow | null>(null);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [applicationError, setApplicationError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("올바르지 않은 채용 공고 주소입니다.");
      setLoading(false);
      setApplicationLoading(false);
      return;
    }

    const fetchJobPosting = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`/api/job-postings/${id}`);
        const data = res.data?.data as JobPostingWithId | undefined;

        if (!data) {
          setError("채용 공고 정보를 찾을 수 없습니다.");
          setJobPosting(null);
          return;
        }

        setJobPosting(data);
      } catch (err) {
        console.error("채용 공고 상세 불러오기 오류:", err);
        setError("채용 공고를 불러오는 중 오류가 발생했습니다.");
        setJobPosting(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchApplication = async () => {
      if (!id || id === "undefined") return;

      try {
        setApplicationLoading(true);
        setApplicationError(null);

        const res = await axios.get(`/api/applications/${id}`);
        const found = res.data?.data as ApplicationRow;

        setApplication(found ?? null);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setApplication(null);
          setApplicationError(null);
          return;
        }

        console.error("지원 이력 불러오기 오류:", err);
        setApplicationError("지원 이력을 불러오는 중 오류가 발생했습니다.");
        setApplication(null);
      } finally {
        setApplicationLoading(false);
      }
    };


    fetchJobPosting();
    fetchApplication();
  }, [id]);

  const handleDelete = async () => {
    if (!id || id === "undefined") {
      alert("올바르지 않은 채용 공고 주소가 아닙니다.");
      return;
    }

    const ok = window.confirm(
      "정말 이 공고를 삭제하시겠습니까?\n삭제 후에는 되돌릴 수 없습니다."
    );
    if (!ok) return;

    try {
      await axios.delete(`/api/job-postings/${id}`);
      router.replace("/job-postings");
    } catch (err) {
      console.error("채용 공고 삭제 오류:", err);
      alert("공고 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const title = jobPosting?.title ?? "채용 공고 상세";
  const dueDateText = formatDate(jobPosting?.dueDate);
  const employmentTypeText = jobPosting?.employmentType ?? "-";
  const locationText = jobPosting?.location ?? "-";
  const sourceText = jobPosting?.source ?? "소스 미기입";
  const positionText = jobPosting?.position ?? "포지션 미기입";
  const memoText =
    jobPosting?.memo ??
    "아직 메모가 없습니다. 나중에 이 공고에 대한 메모를 남겨보세요.";
  const careerText = jobPosting?.career ?? "-";
  const salaryText = jobPosting?.salary ?? "-";
  const createdAtText = formatDate(jobPosting?.createdAt);

  const companyNameText = jobPosting?.companyName ?? "-";
  const companyIndustryText = jobPosting?.companyIndustry ?? "";
  const companyHomepageUrl = jobPosting?.companyHomepageUrl ?? "";

  const hasDetailSections =
    !!jobPosting?.responsibilities ||
    !!jobPosting?.requirements ||
    !!jobPosting?.preferred ||
    !!jobPosting?.benefits;

  const hasRecruitInfo =
    !!jobPosting?.career || !!jobPosting?.salary || !!jobPosting?.dueDate;

  const appliedAtText = application?.appliedAt ?? "-";
  const applicationStatusText = application?.status ?? "-";
  const applicationMemoText =
    application?.memo ?? "아직 메모가 없습니다. 지원 관련 메모를 남겨보세요.";

  const dueInTextValue = dueInText(jobPosting?.dueDate);

  return (
    <div className="px-6 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Link href="/job-postings" className="hover:text-slate-600">
            채용 공고
          </Link>
          <span>›</span>
          <span className="text-slate-500">
            {loading ? "불러오는 중..." : title}
          </span>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-600">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <section className="flex-1 space-y-4">
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">
                    {loading ? "채용 공고 불러오는 중..." : title}
                  </h1>
                  {!loading && (
                    <div className="mt-1 space-y-0.5 text-xs">
                      {companyNameText !== "-" && (
                        <p className="font-medium text-slate-800">
                          {companyNameText}
                        </p>
                      )}
                      {companyIndustryText && (
                        <p className="text-[11px] text-slate-400">
                          {companyIndustryText}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500">
                        {positionText}
                      </p>
                    </div>
                  )}
                </div>

                {jobPosting?.url && (
                  <Link href={jobPosting.url} target="_blank">
                    <Button type="button" size="sm" className="text-[11px]">
                      공고 보기
                    </Button>
                  </Link>
                )}
              </div>

              {loading ? (
                <p className="text-[11px] text-slate-400">
                  기본 정보를 불러오는 중입니다...
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3 text-[11px] text-slate-500">
                      <div>
                        <p className="text-slate-400">마감일</p>
                        <p className="mt-0.5 text-xs text-slate-800">
                          {dueDateText}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">근무 지역</p>
                        <p className="mt-0.5 text-xs text-slate-800">
                          {locationText}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-[11px] text-slate-500">
                      <div>
                        <p className="text-slate-400">근무 형태</p>
                        <p className="mt-0.5 text-xs text-slate-800">
                          {employmentTypeText}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">공고 소스</p>
                        <p className="mt-0.5 text-xs text-slate-800">
                          {sourceText}
                        </p>
                      </div>
                    </div>
                  </div>

                  {companyHomepageUrl && (
                    <div className="space-y-1 text-[11px] text-slate-500">
                      <p className="text-slate-400">회사 홈페이지</p>
                      <a
                        href={companyHomepageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 inline-flex text-xs text-sky-600 underline"
                      >
                        {companyHomepageUrl}
                      </a>
                    </div>
                  )}

                  <div className="space-y-1 text-[11px] text-slate-500">
                    <p className="text-slate-400">메모</p>
                    <p className="mt-0.5 whitespace-pre-line text-xs leading-relaxed text-slate-800">
                      {memoText}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {!loading && hasDetailSections && (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">
                  공고 상세
                </h2>

                <div className="space-y-4 text-[11px] text-slate-500">
                  {jobPosting?.responsibilities && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-slate-700">
                        주요 업무
                      </p>
                      <p className="mt-0.5 whitespace-pre-line text-xs leading-relaxed text-slate-800">
                        {jobPosting.responsibilities}
                      </p>
                    </div>
                  )}

                  {jobPosting?.requirements && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-slate-700">
                        지원 요건
                      </p>
                      <p className="mt-0.5 whitespace-pre-line text-xs leading-relaxed text-slate-800">
                        {jobPosting.requirements}
                      </p>
                    </div>
                  )}

                  {jobPosting?.preferred && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-slate-700">
                        우대 사항
                      </p>
                      <p className="mt-0.5 whitespace-pre-line text-xs leading-relaxed text-slate-800">
                        {jobPosting.preferred}
                      </p>
                    </div>
                  )}

                  {jobPosting?.benefits && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-slate-700">
                        복리후생
                      </p>
                      <p className="mt-0.5 whitespace-pre-line text-xs leading-relaxed text-slate-800">
                        {jobPosting.benefits}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!loading && hasRecruitInfo && (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900">
                  모집 조건
                </h2>

                <div className="grid gap-4 md:grid-cols-2 text-[11px] text-slate-500">
                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-400">경력</p>
                      <p className="mt-0.5 text-xs text-slate-800">
                        {careerText}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">급여 정보</p>
                      <p className="mt-0.5 text-xs text-slate-800">
                        {salaryText}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-400">등록일</p>
                      <p className="mt-0.5 text-xs text-slate-800">
                        {createdAtText}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">마감일</p>
                      <p className="mt-0.5 text-xs text-slate-800">
                        {dueDateText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  지원 이력
                </h2>

                {application ? (
                  <span className="text-[11px] text-slate-400">
                    {appliedAtText !== "-" ? `${appliedAtText} 지원` : "지원일 미기입"}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">-</span>
                )}
              </div>

              {applicationLoading ? (
                <p className="text-[11px] text-slate-400">
                  지원 이력을 불러오는 중입니다...
                </p>
              ) : applicationError ? (
                <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-600">
                  {applicationError}
                </div>
              ) : !application ? (
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-xs font-medium text-slate-800">
                      아직 지원 이력이 없습니다.
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      지원 이력을 추가해서 상태를 관리해보세요.
                    </p>
                  </div>
                  <Link href="/applications/create">
                    <Button type="button" size="sm" className="text-[11px]">
                      지원 추가
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${statusDot(
                        application.status
                      )}`}
                    />
                    <span className="font-medium text-slate-800">
                      {applicationStatusText}
                    </span>
                    <Link
                      href={`/applications/${application.id}`}
                      className="ml-1 text-[11px] font-medium text-slate-500 hover:text-slate-700"
                    >
                      상세 보기
                    </Link>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-slate-400">지원 날짜</p>
                      <p className="text-xs text-slate-800">{appliedAtText}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-slate-400">상태</p>
                      <p className="text-xs text-slate-800">
                        {applicationStatusText}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-400">메모</p>
                    <p className="whitespace-pre-line text-xs leading-relaxed text-slate-800">
                      {applicationMemoText}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  관련 면접 일정
                </h2>
              </div>

              <div className="space-y-3 text-[11px] text-slate-500">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    <span className="text-xs text-slate-800">1차 면접</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-800">2025-01-28 14:00</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">화상 면접</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-xs text-slate-800">과제 제출</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-800">2025-02-03</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">마감일</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    <span className="text-xs text-slate-800">2차 면접</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-800">2025-02-05 10:00</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">현장 면접</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="mt-1 text-left text-[11px] font-medium text-slate-500 hover:text-slate-700"
              >
                + 새 면접 일정 추가
              </button>
            </div>
          </section>

          <aside className="mt-4 w-full space-y-4 md:mt-0 md:w-72">
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">빠른 작업</h2>

              <div className="space-y-2">
                <Link href={`/job-postings/${id}/update`}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mb-2 flex w-full justify-start gap-2 text-[11px]"
                  >
                    <span>📄</span>
                    <span>공고 정보 수정</span>
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex w-full justify-start gap-2 text-[11px]"
                >
                  <span>📅</span>
                  <span>면접 일정 추가</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 flex w-full justify-start gap-2 text-[11px] border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  onClick={handleDelete}
                >
                  <span>🗑</span>
                  <span>공고 삭제</span>
                </Button>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">진행 상황</h2>

              <div className="space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">지원 상태</span>
                  <span className="text-xs font-medium text-slate-800">
                    {application?.status ?? "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">다음 일정</span>
                  <span className="text-xs font-medium text-slate-800">-</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">마감까지</span>
                  <span className="text-xs font-medium text-slate-800">{dueInTextValue}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
