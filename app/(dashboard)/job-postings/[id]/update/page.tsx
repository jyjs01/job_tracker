"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import FilterSelect from "@/src/components/ui/FilterSelect";
import {
  jobPostingFormSchema,
  JobPostingFormValues,
} from "@/src/lib/validation/client/jobPostingsForm";
import type { JobPostingDocument } from "@/src/types/jobPostings";

type JobPostingWithId = JobPostingDocument & { id: string };

function toDateInputValue(value?: string | Date) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function JobPostingUpdatePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] =
    useState<Partial<Record<keyof JobPostingFormValues, string>>>({});
  const [jobPosting, setJobPosting] = useState<JobPostingWithId | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 공고 상세 불러오기
  useEffect(() => {
    if (!id || id === "undefined") {
      setLoadError("올바르지 않은 채용 공고 주소입니다.");
      setIsLoading(false);
      return;
    }

    const fetchJobPosting = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const res = await axios.get(`/api/job-postings/${id}`);
        const data = res.data?.data as JobPostingWithId | undefined;

        if (!data) {
          setLoadError("채용 공고 정보를 찾을 수 없습니다.");
          setJobPosting(null);
          return;
        }

        setJobPosting(data);
      } catch (error) {
        console.error("채용 공고 불러오기 오류:", error);
        setLoadError("채용 공고를 불러오는 중 오류가 발생했습니다.");
        setJobPosting(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobPosting();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!id || id === "undefined") {
      alert("올바르지 않은 채용 공고 주소가 아닙니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      const values: JobPostingFormValues = {
        companyName:
          (formData.get("companyName") as string | null)?.trim() ?? "",
        companyIndustry:
          (formData.get("companyIndustry") as string | null)?.trim() ?? "",
        companyHomepageUrl:
          (formData.get("companyHomepageUrl") as string | null)?.trim() ?? "",
        title: (formData.get("title") as string | null)?.trim() ?? "",
        jobCategory: (formData.get("jobCategory") as string | null) ?? "",
        employmentType:
          (formData.get("employmentType") as string | null) ?? "",
        career: (formData.get("career") as string | null)?.trim() ?? "",
        location: (formData.get("location") as string | null)?.trim() ?? "",
        responsibilities:
          (formData.get("responsibilities") as string | null)?.trim() ?? "",
        requirements:
          (formData.get("requirements") as string | null)?.trim() ?? "",
        preferred:
          (formData.get("preferred") as string | null)?.trim() || "",
        benefits:
          (formData.get("benefits") as string | null)?.trim() || "",
        dueDate: (formData.get("dueDate") as string | null) || undefined,
        source: (formData.get("source") as string | null)?.trim() || "",
        url: (formData.get("url") as string | null)?.trim() || "",
        salary: (formData.get("salary") as string | null)?.trim() ?? "",
        memo: (formData.get("memo") as string | null)?.trim() || "",
      } as JobPostingFormValues;

      const parsed = jobPostingFormSchema.safeParse(values);

      if (!parsed.success) {
        const fieldErrors: Partial<
          Record<keyof JobPostingFormValues, string>
        > = {};

        parsed.error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as keyof JobPostingFormValues;
          if (!fieldErrors[fieldName]) {
            fieldErrors[fieldName] = issue.message;
          }
        });

        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }

      setErrors({});

      const payload = {
        companyName: parsed.data.companyName,
        companyIndustry: parsed.data.companyIndustry || undefined,
        companyHomepageUrl: parsed.data.companyHomepageUrl || undefined,
        title: parsed.data.title,
        position: parsed.data.jobCategory,
        employmentType: parsed.data.employmentType,
        career: parsed.data.career || undefined,
        salary: parsed.data.salary || undefined,
        location: parsed.data.location,
        responsibilities: parsed.data.responsibilities,
        requirements: parsed.data.requirements,
        preferred: parsed.data.preferred || undefined,
        benefits: parsed.data.benefits || undefined,
        dueDate: parsed.data.dueDate || undefined,
        source: parsed.data.source || undefined,
        url: parsed.data.url || undefined,
        memo: parsed.data.memo || undefined,
      };

      await axios.patch(`/api/job-postings/${id}`, payload);

      router.replace(`/job-postings/${id}`);
    } catch (error) {
      console.error("공고 수정 중 오류:", error);
      alert("공고 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-6 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-xs text-slate-400 shadow-sm">
            채용 공고 정보를 불러오는 중입니다...
          </div>
        ) : loadError || !jobPosting ? (
          <div className="space-y-3">
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-6 py-4 text-xs text-rose-600 shadow-sm">
              {loadError || "채용 공고 정보를 찾을 수 없습니다."}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => router.replace("/job-postings")}
            >
              목록으로 돌아가기
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 상단 헤더 */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Link href="/job-postings">
                  <Button
                    type="button"
                    variant="text"
                    size="sm"
                    className="flex items-center gap-1 text-[11px]"
                  >
                    <span className="text-sm">←</span>
                    <span>채용 공고 목록으로</span>
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    채용 공고 수정
                  </h1>
                  <p className="mt-1 text-xs text-slate-500">
                    기존에 등록한 채용 공고 정보를 수정합니다.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "수정 중..." : "공고 수정"}
              </Button>
            </div>

            {/* 기본 정보 카드 */}
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  기본 정보
                </h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  공고의 기본 정보를 수정해주세요.
                </p>
              </div>

              <div className="space-y-4">
                {/* 공고 제목 */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    공고 제목 <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    name="title"
                    placeholder="예: 프론트엔드 개발자 (React)"
                    defaultValue={jobPosting.title}
                    required
                  />
                  {errors.title && (
                    <p className="mt-1 text-[11px] text-rose-500">
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* 직무 분야 / 경력 */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FilterSelect
                      label="직무 분야 *"
                      name="jobCategory"
                      defaultValue={jobPosting.position || ""}
                      required
                    >
                      <option value="" disabled>
                        선택해주세요
                      </option>
                      <option>프론트엔드</option>
                      <option>백엔드</option>
                      <option>풀스택</option>
                      <option>모바일</option>
                      <option>데이터</option>
                    </FilterSelect>
                    {errors.jobCategory && (
                      <p className="mt-1 text-[11px] text-rose-500">
                        {errors.jobCategory}
                      </p>
                    )}
                  </div>

                  <FilterSelect
                    label="경력 *"
                    name="career"
                    defaultValue={jobPosting.career || ""}
                    required
                  >
                    <option value="" disabled>
                      선택해주세요
                    </option>
                    <option>신입</option>
                    <option>경력 1~3년</option>
                    <option>경력 3~5년</option>
                    <option>경력 5년 이상</option>
                    <option>경력 무관</option>
                  </FilterSelect>
                </div>

                {/* 고용 형태 / 근무 지역 */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FilterSelect
                      label="고용 형태 *"
                      name="employmentType"
                      defaultValue={jobPosting.employmentType || ""}
                      required
                    >
                      <option value="" disabled>
                        선택해주세요
                      </option>
                      <option>정규직</option>
                      <option>계약직</option>
                      <option>인턴</option>
                      <option>파트타임</option>
                    </FilterSelect>
                    {errors.employmentType && (
                      <p className="mt-1 text-[11px] text-rose-500">
                        {errors.employmentType}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      근무 지역 <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      name="location"
                      placeholder="예: 서울 강남구"
                      defaultValue={jobPosting.location || ""}
                      required
                    />
                    {errors.location && (
                      <p className="mt-1 text-[11px] text-rose-500">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* 공고 소스 / 공고 URL */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      공고 소스
                    </label>
                    <Input
                      name="source"
                      placeholder="예: 사람인, 잡코리아, 회사 채용 홈페이지"
                      defaultValue={jobPosting.source || ""}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      공고 URL
                    </label>
                    <Input
                      name="url"
                      placeholder="예: https://company.com/careers/123"
                      defaultValue={jobPosting.url || ""}
                    />
                    {errors.url && (
                      <p className="mt-1 text-[11px] text-rose-500">
                        {errors.url}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    회사명 <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    name="companyName"
                    placeholder="예: 네이버, 카카오, 토스 등"
                    defaultValue={jobPosting.companyName}
                    required
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-[11px] text-rose-500">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      산업 / 업종
                    </label>
                    <Input
                      name="companyIndustry"
                      placeholder="예: IT 서비스, 핀테크, 커머스 등"
                      defaultValue={jobPosting.companyIndustry || ""}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      회사 홈페이지(URL)
                    </label>
                    <Input
                      name="companyHomepageUrl"
                      placeholder="예: https://company.com"
                      defaultValue={jobPosting.companyHomepageUrl || ""}
                    />
                    {errors.companyHomepageUrl && (
                      <p className="mt-1 text-[11px] text-rose-500">
                        {errors.companyHomepageUrl}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 상세 정보 카드 */}
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  상세 정보
                </h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  담당 업무와 지원 요건을 구체적으로 작성해주세요.
                </p>
              </div>

              <div className="space-y-4">
                {/* 주요 업무 */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    주요 업무 <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="responsibilities"
                    className="min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="담당하게 될 주요 업무를 작성해주세요"
                    defaultValue={jobPosting.responsibilities || ""}
                    required
                  />
                  {errors.responsibilities && (
                    <p className="mt-1 text-[11px] text-rose-500">
                      {errors.responsibilities}
                    </p>
                  )}
                </div>

                {/* 지원 요건 */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    지원 요건 <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="requirements"
                    className="min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="필수 자격 요건을 작성해주세요"
                    defaultValue={jobPosting.requirements || ""}
                    required
                  />
                  {errors.requirements && (
                    <p className="mt-1 text-[11px] text-rose-500">
                      {errors.requirements}
                    </p>
                  )}
                </div>

                {/* 우대 사항 */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    우대 사항
                  </label>
                  <textarea
                    name="preferred"
                    className="min-h-20 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="우대 사항을 작성해주세요"
                    defaultValue={jobPosting.preferred || ""}
                  />
                </div>

                {/* 복리후생 */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    복리후생
                  </label>
                  <textarea
                    name="benefits"
                    className="min-h-20 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="복리후생을 작성해주세요"
                    defaultValue={jobPosting.benefits || ""}
                  />
                </div>
              </div>
            </section>

            {/* 모집 조건 카드 */}
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  모집 조건
                </h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  급여, 진행 기간 등을 설정해주세요.
                </p>
              </div>

              <div className="space-y-4">
                {/* 급여 정보 */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    급여 정보
                  </label>
                  <Input
                    name="salary"
                    placeholder="예: 연봉 4,000만원 ~ 6,000만원"
                    defaultValue={jobPosting.salary || ""}
                  />
                </div>

                {/* 시작일 / 마감일 */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      시작일 <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="date"
                      name="startDate"
                      defaultValue={toDateInputValue(jobPosting.createdAt)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      마감일 <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="date"
                      name="dueDate"
                      defaultValue={toDateInputValue(jobPosting.dueDate)}
                    />
                    {errors.dueDate && (
                      <p className="mt-1 text-[11px] text-rose-500">
                        {errors.dueDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 메모 카드 */}
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">메모</h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  이 공고에 대해 개인적으로 남겨두고 싶은 메모가 있다면 적어주세요.
                </p>
              </div>

              <div className="space-y-1">
                <textarea
                  name="memo"
                  className="min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="예: 코딩테스트 있음 / 포트폴리오 필수 / 면접 예상 질문 정리 필요 등"
                  defaultValue={jobPosting.memo || ""}
                />
              </div>
            </section>

            {/* 하단 액션 버튼 */}
            <div className="flex items-center justify-end gap-2 pb-6">
              <Button
                type="button"
                variant="ghost"
                size="md"
                className="text-xs text-slate-500"
                onClick={() => router.back()}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="text-xs"
                disabled={isSubmitting}
              >
                {isSubmitting ? "수정 중..." : "공고 수정"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
