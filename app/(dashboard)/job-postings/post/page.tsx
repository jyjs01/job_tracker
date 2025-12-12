"use client";

import Link from "next/link";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import FilterSelect from "@/src/components/ui/FilterSelect";
import { redirect } from "next/navigation";

export default function JobPostingCreatePage() {

  const handleCancel = () => {
    redirect("/job-postings");
  }

  return (
    <div className="px-6 py-6 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* 상단 헤더 */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Link href="/job-postings">
                <Button
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

          <Button variant="primary" size="md">
              공고 등록
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
              <Input placeholder="예: 프론트엔드 개발자 (React)" />
            </div>

            {/* 직무 분야 / 경력 */}
            <div className="grid gap-4 md:grid-cols-2">
              <FilterSelect label="직무 분야 *" defaultValue="" required>
                <option value="" disabled>
                  선택해주세요
                </option>
                <option>프론트엔드</option>
                <option>백엔드</option>
                <option>풀스택</option>
                <option>모바일</option>
                <option>데이터</option>
              </FilterSelect>

              <FilterSelect label="경력 *" defaultValue="" required>
                <option value="" disabled>
                  선택해주세요
                </option>
                <option>신입</option>
                <option>경력 1~3년</option>
                <option>경력 3~5년</option>
                <option>경력 5년 이상</option>
              </FilterSelect>
            </div>

            {/* 고용 형태 / 근무 지역 */}
            <div className="grid gap-4 md:grid-cols-2">
              <FilterSelect label="고용 형태 *" defaultValue="" required>
                <option value="" disabled>
                  선택해주세요
                </option>
                <option>정규직</option>
                <option>계약직</option>
                <option>인턴</option>
                <option>파트타임</option>
              </FilterSelect>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  근무 지역 <span className="text-rose-500">*</span>
                </label>
                <Input placeholder="예: 서울 강남구" />
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
                className="min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="담당하게 될 주요 업무를 작성해주세요"
              />
            </div>

            {/* 지원 요건 */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                지원 요건 <span className="text-rose-500">*</span>
              </label>
              <textarea
                className="min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="필수 자격 요건을 작성해주세요"
              />
            </div>

            {/* 우대 사항 */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                우대 사항
              </label>
              <textarea
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
              모집 인원, 급여, 진행 기간 등을 설정해주세요.
            </p>
          </div>

          <div className="space-y-4">
            {/* 모집 인원 / 급여 정보 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  모집 인원 <span className="text-rose-500">*</span>
                </label>
                <Input type="number" min={1} placeholder="1" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  급여 정보
                </label>
                <Input placeholder="예: 연봉 4,000만원 ~ 6,000만원" />
              </div>
            </div>

            {/* 시작일 / 마감일 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  시작일 <span className="text-rose-500">*</span>
                </label>
                <Input type="date" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  마감일 <span className="text-rose-500">*</span>
                </label>
                <Input type="date" />
              </div>
            </div>

            {/* 진행 상태 */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-700">
                진행 상태 <span className="text-rose-500">*</span>
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-700">
                <label className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    name="publishStatus"
                    className="h-3.5 w-3.5 border-slate-300 text-slate-900 focus:ring-blue-500"
                    defaultChecked
                  />
                  <span>즉시 공개</span>
                </label>
                <label className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    name="publishStatus"
                    className="h-3.5 w-3.5 border-slate-300 text-slate-900 focus:ring-blue-500"
                  />
                  <span>임시 저장</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* 하단 액션 버튼 */}
        <div className="flex items-center justify-end gap-2 pb-6">
          <Button variant="ghost" size="md" className="text-xs text-slate-500" onClick={handleCancel}>
              취소
          </Button>
          <Button variant="primary" size="md" className="text-xs">
            공고 등록
          </Button>
        </div>
      </div>
    </div>
  );
}
