"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import FilterSelect from "@/src/components/ui/FilterSelect";
import {
  jobPostingFormSchema,
  JobPostingFormValues,
} from "@/src/lib/validation/client/jobPostingsForm";

export default function JobPostingCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof JobPostingFormValues, string>>>(
    {}
  );

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      const values: JobPostingFormValues = {
        title: (formData.get("title") as string | null)?.trim() ?? "",
        jobCategory: (formData.get("jobCategory") as string | null) ?? "",
        employmentType: (formData.get("employmentType") as string | null) ?? "",
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
      };

      // 클라이언트 유효성 검사
      const parsed = jobPostingFormSchema.safeParse(values);

      if (!parsed.success) {
        const fieldErrors: Partial<Record<keyof JobPostingFormValues, string>> =
          {};

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

      // 서버에 보낼 payload (userId는 서버에서 getCurrentUser로 처리)
      const payload = {
        title: parsed.data.title,
        position: parsed.data.jobCategory,
        employmentType: parsed.data.employmentType,
        location: parsed.data.location,
        career: parsed.data.career || undefined,
        salary: parsed.data.salary || undefined,
        responsibilities: parsed.data.responsibilities,
        requirements: parsed.data.requirements,
        preferred: parsed.data.preferred || undefined,
        benefits: parsed.data.benefits || undefined,
        dueDate: parsed.data.dueDate || undefined,
        source: parsed.data.source || undefined,
        url: parsed.data.url || undefined,
        memo: parsed.data.memo || undefined,
      };

      await axios.post("/api/job-postings", payload);

      router.replace("/job-postings");
    } catch (error) {
      console.error("공고 등록 중 오류:", error);
      alert("공고 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-6 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
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
                  새 채용 공고 등록
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                  채용 공고 정보를 입력해주세요.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "등록 중..." : "공고 등록"}
            </Button>
          </div>

          {/* 기본 정보 카드 */}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">기본 정보</h2>
              <p className="mt-1 text-[11px] text-slate-500">
                공고의 기본 정보를 입력해주세요.
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
                    defaultValue=""
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
                  defaultValue=""
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
                    defaultValue=""
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
                  <Input name="location" placeholder="예: 서울 강남구" required />
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
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    공고 URL
                  </label>
                  <Input
                    name="url"
                    placeholder="예: https://company.com/careers/123"
                  />
                  {/* url 검증 에러가 있을 때만 보여주기 (선택) */}
                  {errors.url && (
                    <p className="mt-1 text-[11px] text-rose-500">{errors.url}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 상세 정보 카드 */}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">상세 정보</h2>
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
                />
              </div>
            </div>
          </section>

          {/* 모집 조건 카드 */}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">모집 조건</h2>
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
                />
              </div>

              {/* 시작일 / 마감일 */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    시작일 <span className="text-rose-500">*</span>
                  </label>
                  <Input type="date" name="startDate" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    마감일 <span className="text-rose-500">*</span>
                  </label>
                  <Input type="date" name="dueDate" />
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
              onClick={handleCancel}
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
              {isSubmitting ? "등록 중..." : "공고 등록"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
