"use client";

import { useMemo, useState } from "react";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

type InterviewStatus = "예정" | "합격" | "불합격";

type JobPosting = {
  id: string; // 실제 DB에선 int
  company_name: string;
  position: string;
  title: string;
};

type Application = {
  id: string; // 실제 DB에선 int
  job_posting_id: string;
  status: string;
  current_step: string;
};

type InterviewFormState = {
  job_posting_id: string; // interviews.job_posting_id (NN)
  application_id: string; // interviews.application_id (NN)
  type: string; // interviews.type
  scheduled_at: string; // interviews.scheduled_at (timestamp) -> datetime-local
  location: string; // interviews.location
  status: InterviewStatus; // interviews.status
  memo: string; // interviews.memo
};

const mockJobPostings: JobPosting[] = [
  {
    id: "101",
    company_name: "카카오",
    position: "프론트엔드 개발자",
    title: "FE Engineer",
  },
  {
    id: "102",
    company_name: "네이버",
    position: "백엔드 개발자",
    title: "Backend Engineer",
  },
  {
    id: "103",
    company_name: "토스",
    position: "풀스택 개발자",
    title: "Fullstack Engineer",
  },
];

const mockApplications: Application[] = [
  { id: "201", job_posting_id: "101", status: "진행중", current_step: "서류" },
  { id: "202", job_posting_id: "101", status: "진행중", current_step: "1차 면접" },
  { id: "203", job_posting_id: "102", status: "진행중", current_step: "코딩테스트" },
  { id: "204", job_posting_id: "103", status: "진행중", current_step: "2차 면접" },
];

const typePresets = [
  "1차 면접",
  "2차 면접",
  "최종 면접",
  "코딩테스트",
  "라이브 코딩",
  "과제 제출",
  "과제 발표",
];

function toPreviewDateTime(datetimeLocal: string) {
  if (!datetimeLocal) return "";
  const [date, time] = datetimeLocal.split("T");
  return `${date.replaceAll("-", ".")} ${time}`;
}

export default function InterviewCreatePage() {
  const [form, setForm] = useState<InterviewFormState>({
    job_posting_id: mockJobPostings[0]?.id ?? "",
    application_id: "",
    type: "1차 면접",
    scheduled_at: "",
    location: "",
    status: "예정",
    memo: "",
  });

  const onChange = <K extends keyof InterviewFormState>(
    key: K,
    value: InterviewFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectedJobPosting = useMemo(() => {
    return mockJobPostings.find((jp) => jp.id === form.job_posting_id) ?? null;
  }, [form.job_posting_id]);

  const applicationsForSelectedPosting = useMemo(() => {
    if (!form.job_posting_id) return [];
    return mockApplications.filter((a) => a.job_posting_id === form.job_posting_id);
  }, [form.job_posting_id]);

  const effectiveApplicationId = useMemo(() => {
    const exists = applicationsForSelectedPosting.some((a) => a.id === form.application_id);
    if (exists) return form.application_id;
    return applicationsForSelectedPosting[0]?.id ?? "";
  }, [applicationsForSelectedPosting, form.application_id]);

  const selectedApplication = useMemo(() => {
    return applicationsForSelectedPosting.find((a) => a.id === effectiveApplicationId) ?? null;
  }, [applicationsForSelectedPosting, effectiveApplicationId]);

  const canSubmit =
    form.job_posting_id.trim().length > 0 &&
    effectiveApplicationId.trim().length > 0 &&
    form.type.trim().length > 0 &&
    form.scheduled_at.trim().length > 0;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      job_posting_id: form.job_posting_id,
      application_id: effectiveApplicationId,
      type: form.type,
      scheduled_at: form.scheduled_at,
      location: form.location,
      status: form.status,
      memo: form.memo,
    };

    console.log("CREATE interview payload:", payload);
    alert("저장 클릭 (API 연동은 추후)");
  };

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6">
          <h1 className="text-lg font-semibold text-slate-900">면접/과제 일정 생성</h1>
          <p className="mt-1 text-xs text-slate-500">
            공고/지원 이력에 연결해 일정(면접·과제)을 추가하세요
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {/* 상단 액션 */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">
              필수 항목을 입력한 뒤 저장하세요.
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost">
                취소
              </Button>
              <Button type="submit" variant="primary" disabled={!canSubmit}>
                저장
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4">
            {/* job_posting_id */}
            <div>
              <label className="text-xs font-semibold text-slate-700">
                공고 선택
              </label>
              <select
                value={form.job_posting_id}
                onChange={(e) => {
                  onChange("job_posting_id", e.target.value);
                  onChange("application_id", "");
                }}
                className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {mockJobPostings.map((jp) => (
                  <option key={jp.id} value={jp.id}>
                    {jp.company_name} · {jp.position}
                  </option>
                ))}
              </select>
              {selectedJobPosting ? (
                <p className="mt-2 text-[11px] text-slate-500">
                  선택됨: <span className="font-semibold">{selectedJobPosting.title}</span>
                </p>
              ) : null}
            </div>

            {/* application_id */}
            <div>
              <label className="text-xs font-semibold text-slate-700">
                지원 이력 선택
              </label>
              <select
                value={effectiveApplicationId}
                onChange={(e) => onChange("application_id", e.target.value)}
                className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {applicationsForSelectedPosting.length === 0 ? (
                  <option value="">해당 공고에 연결된 지원 이력이 없습니다</option>
                ) : (
                  applicationsForSelectedPosting.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.current_step} · {a.status}
                    </option>
                  ))
                )}
              </select>

              {selectedApplication ? (
                <p className="mt-2 text-[11px] text-slate-500">
                  현재 단계:{" "}
                  <span className="font-semibold">{selectedApplication.current_step}</span>
                </p>
              ) : (
                <p className="mt-2 text-[11px] text-slate-400">
                  공고에 연결된 지원 이력을 먼저 선택하세요.
                </p>
              )}
            </div>

            {/* type */}
            <div>
              <label className="text-xs font-semibold text-slate-700">
                단계
              </label>

              <div className="mt-2 flex flex-wrap gap-2">
                {typePresets.map((p) => (
                  <Button
                    key={p}
                    type="button"
                    size="sm"
                    variant={form.type === p ? "primary" : "outline"}
                    onClick={() => onChange("type", p)}
                    className="rounded-full"
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            {/* scheduled_at */}
            <div>
              <label className="text-xs font-semibold text-slate-700">
                일정
              </label>
              <Input
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) => onChange("scheduled_at", e.target.value)}
                className="mt-2"
              />
              <p className="mt-2 text-[11px] text-slate-400">
                {form.scheduled_at
                  ? `미리보기: ${toPreviewDateTime(form.scheduled_at)}`
                  : "날짜와 시간을 선택하세요."}
              </p>
            </div>

            {/* location */}
            <div>
              <label className="text-xs font-semibold text-slate-700">
                장소
              </label>
              <Input
                value={form.location}
                onChange={(e) => onChange("location", e.target.value)}
                placeholder="예: Zoom 링크 / 오프라인 주소"
                className="mt-2"
              />
            </div>

            {/* status */}
            <div>
              <label className="text-xs font-semibold text-slate-700">
                상태
              </label>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={form.status === "예정" ? "primary" : "outline"}
                  onClick={() => onChange("status", "예정")}
                >
                  예정
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={form.status === "합격" ? "primary" : "outline"}
                  onClick={() => onChange("status", "합격")}
                >
                  합격
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={form.status === "불합격" ? "primary" : "outline"}
                  onClick={() => onChange("status", "불합격")}
                >
                  불합격
                </Button>
              </div>
            </div>

            {/* memo */}
            <div>
              <label className="text-xs font-semibold text-slate-700">
                메모
              </label>
              <textarea
                value={form.memo}
                onChange={(e) => onChange("memo", e.target.value)}
                placeholder="예: 준비 질문, 제출물, 안내사항 등"
                className="mt-2 min-h-[120px] w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 미리보기 */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-700">미리보기</p>

            <div className="mt-3 flex flex-col gap-1 text-sm text-slate-700">
              <span>
                <span className="text-slate-500">공고:</span>{" "}
                <span className="font-semibold">
                  {selectedJobPosting
                    ? `${selectedJobPosting.company_name} · ${selectedJobPosting.position}`
                    : "-"}
                </span>
              </span>

              <span>
                <span className="text-slate-500">지원 이력:</span>{" "}
                <span className="font-semibold">
                  {selectedApplication
                    ? `${selectedApplication.current_step} · ${selectedApplication.status}`
                    : "-"}
                </span>
              </span>

              <span>
                <span className="text-slate-500">타입:</span>{" "}
                <span className="font-semibold">{form.type || "-"}</span>
              </span>

              <span>
                <span className="text-slate-500">일정:</span>{" "}
                <span className="font-semibold">
                  {form.scheduled_at ? toPreviewDateTime(form.scheduled_at) : "-"}
                </span>
              </span>

              <span>
                <span className="text-slate-500">장소:</span>{" "}
                <span className="font-semibold">{form.location || "-"}</span>
              </span>

              <span>
                <span className="text-slate-500">상태:</span>{" "}
                <span className="font-semibold">{form.status}</span>
              </span>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button type="button" variant="outline">
                임시저장
              </Button>
              <Button type="submit" variant="primary" disabled={!canSubmit}>
                저장
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
