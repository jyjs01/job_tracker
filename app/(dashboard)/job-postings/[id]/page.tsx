"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Button from "@/src/components/ui/Button";
import type { JobPostingDocument } from "@/src/types/jobPostings";

type JobPostingWithId = JobPostingDocument & {
  id: string;
};

function formatDate(value?: string | Date) {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "-";
  return d.toISOString().slice(0, 10);
}

export default function JobPostingDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const [jobPosting, setJobPosting] = useState<JobPostingWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 채용 공고 불러오기
  useEffect(() => {
    if (!id || id === "undefined") {
      setError("올바르지 않은 채용 공고 주소입니다.");
      setLoading(false);
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

    fetchJobPosting();
  }, [id]);

  // 채용 공고 삭제하기
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

        {/* 에러 메시지 */}
        {error && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-600">
            {error}
          </div>
        )}

        {/* 메인 레이아웃: 왼쪽 section / 오른쪽 aside */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          {/* ================== SECTION ================== */}
          <section className="flex-1 space-y-4">
            {/* 기본 정보 박스 */}
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

                {/* 공고 보기 버튼 (URL 있을 때만 노출) */}
                {jobPosting?.url && (
                  <Link href={jobPosting.url} target="_blank">
                    <Button
                      type="button"
                      size="sm"
                      className="text-[11px]"
                    >
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
                  {/* 메타 정보 */}
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

                  {/* 메모 */}
                  <div className="space-y-1 text-[11px] text-slate-500">
                    <p className="text-slate-400">메모</p>
                    <p className="mt-0.5 whitespace-pre-line text-xs leading-relaxed text-slate-800">
                      {memoText}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 공고 상세 박스 (주요 업무/요건/우대/복지) */}
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

            {/* 모집 조건 */}
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

            {/* 지원 이력 박스 (목 데이터) */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  지원 이력
                </h2>
                <span className="text-[11px] text-slate-400">
                  2025-01-15 지원
                </span>
              </div>

              <div className="space-y-3 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-slate-800">
                    지원 완료
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-slate-400">지원 방법</p>
                    <p className="text-xs text-slate-800">온라인 지원</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-400">상태</p>
                    <p className="text-xs text-slate-800">서류 통과</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-400">메모</p>
                  <p className="text-xs leading-relaxed text-slate-800">
                    포트폴리오와 함께 지원. HR 담당자가 빠른 피드백 약속.
                  </p>
                </div>
              </div>
            </div>

            {/* 관련 면접 일정 박스 (목 데이터) */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  관련 면접 일정
                </h2>
              </div>

              <div className="space-y-3 text-[11px] text-slate-500">
                {/* 1차 면접 */}
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    <span className="text-xs text-slate-800">1차 면접</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-800">
                      2025-01-28 14:00
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      화상 면접
                    </p>
                  </div>
                </div>

                {/* 과제 제출 */}
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-xs text-slate-800">과제 제출</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-800">2025-02-03</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      마감일
                    </p>
                  </div>
                </div>

                {/* 2차 면접 */}
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    <span className="text-xs text-slate-800">2차 면접</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-800">
                      2025-02-05 10:00
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      현장 면접
                    </p>
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

          {/* ================== ASIDE ================== */}
          <aside className="mt-4 w-full space-y-4 md:mt-0 md:w-72">
            {/* 빠른 작업 */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                빠른 작업
              </h2>

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

            {/* 진행 상황 */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                진행 상황
              </h2>

              <div className="space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">지원 상태</span>
                  <span className="text-xs font-medium text-slate-800">
                    서류 통과
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">다음 일정</span>
                  <span className="text-xs font-medium text-slate-800">
                    1차 면접
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">마감까지</span>
                  <span className="text-xs font-medium text-slate-800">
                    19일
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
