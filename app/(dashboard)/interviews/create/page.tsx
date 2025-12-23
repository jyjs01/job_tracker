"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

type InterviewStatus = "예정" | "합격" | "불합격";

// job-postings 응답 row (필요 필드만)
type JobPostingRow = {
  id: string;
  title?: string | null;
  position?: string | null;
  companyName?: string | null;
};

// applications 응답 row (src/types/applications.ts 형태)
type ApplicationRow = {
  id: string;
  jobPostingId: string;
  status: string;
  appliedAt: string | null;
};

type InterviewFormState = {
  jobPostingId: string;
  applicationId: string;
  type: string;
  scheduledAt: string; 
  location: string;
  status: InterviewStatus;
  memo: string;
};

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

function toServerIso(datetimeLocal: string) {
  if (!datetimeLocal) return null;
  const d = new Date(datetimeLocal);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

type FieldErrors = Record<string, string[]>;
type ApiErrorResponse = {
  error?: string;
  fieldErrors?: FieldErrors;
  formErrors?: string[];
  details?: {
    fieldErrors?: FieldErrors;
    formErrors?: string[];
  };
};

type JobPostingsSuccess = { data: JobPostingRow[] };
type ApplicationsSuccess = { data: ApplicationRow[] };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function isFieldErrors(v: unknown): v is FieldErrors {
  if (!isRecord(v)) return false;
  return Object.values(v).every((arr) => isStringArray(arr));
}

function pickErrorMessage(data: unknown): string {
  if (!isRecord(data)) return "요청 처리 중 오류가 발생했습니다.";

  // { error }
  if (typeof data.error === "string" && data.error.trim()) return data.error;

  // { fieldErrors, formErrors }
  if (isFieldErrors(data.fieldErrors)) {
    const firstKey = Object.keys(data.fieldErrors)[0];
    const firstMsg = firstKey ? data.fieldErrors[firstKey]?.[0] : undefined;
    if (firstMsg) return firstMsg;
  }

  if (isStringArray(data.formErrors) && data.formErrors[0]) return data.formErrors[0];

  // { details: { fieldErrors, formErrors } }
  const details = data.details;
  if (isRecord(details)) {
    if (isFieldErrors(details.fieldErrors)) {
      const firstKey = Object.keys(details.fieldErrors)[0];
      const firstMsg = firstKey ? details.fieldErrors[firstKey]?.[0] : undefined;
      if (firstMsg) return firstMsg;
    }
    if (isStringArray(details.formErrors) && details.formErrors[0]) return details.formErrors[0];
  }

  return "요청 처리 중 오류가 발생했습니다.";
}

export default function InterviewCreatePage() {
  const router = useRouter();

  const [form, setForm] = useState<InterviewFormState>({
    jobPostingId: "",
    applicationId: "",
    type: "1차 면접",
    scheduledAt: "",
    location: "",
    status: "예정",
    memo: "",
  });

  const [jobPostings, setJobPostings] = useState<JobPostingRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);

  const [loadingJobPostings, setLoadingJobPostings] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [pageError, setPageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onChange = <K extends keyof InterviewFormState>(
    key: K,
    value: InterviewFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // job postings 로드
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setPageError(null);
      setLoadingJobPostings(true);

      try {
        const res = await axios.get<JobPostingsSuccess>("/api/job-postings");
        const list = res.data.data;

        if (!mounted) return;

        setJobPostings(list);

        setForm((prev) => ({
          ...prev,
          jobPostingId: prev.jobPostingId || list[0]?.id || "",
        }));
      } catch (err) {
        const ax = err as AxiosError<ApiErrorResponse>;
        if (!mounted) return;

        if (ax.response?.status === 401) {
          setPageError("로그인이 필요합니다.");
        } else {
          setPageError(pickErrorMessage(ax.response?.data));
        }
      } finally {
        if (mounted) setLoadingJobPostings(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  // applications 로드 (라우트가 전체 반환)
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoadingApplications(true);

      try {
        const res = await axios.get<ApplicationsSuccess>("/api/applications");
        const list = res.data.data;

        if (!mounted) return;
        setApplications(list);
      } catch (err) {
        const ax = err as AxiosError<ApiErrorResponse>;
        if (!mounted) return;

        if (ax.response?.status === 401) {
          setPageError("로그인이 필요합니다.");
        } else {
          setPageError(pickErrorMessage(ax.response?.data));
        }
      } finally {
        if (mounted) setLoadingApplications(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredApplications = useMemo(() => {
    if (!form.jobPostingId) return [];
    return applications.filter((a) => a.jobPostingId === form.jobPostingId);
  }, [applications, form.jobPostingId]);

  // 공고 변경/앱 로드 후 applicationId 자동 보정
  useEffect(() => {
    setForm((prev) => {
      if (!prev.jobPostingId) return { ...prev, applicationId: "" };

      const exists = filteredApplications.some((a) => a.id === prev.applicationId);
      if (exists) return prev;

      return { ...prev, applicationId: filteredApplications[0]?.id ?? "" };
    });
  }, [filteredApplications]);

  const selectedJobPosting = useMemo(() => {
    return jobPostings.find((jp) => jp.id === form.jobPostingId) ?? null;
  }, [jobPostings, form.jobPostingId]);

  const selectedApplication = useMemo(() => {
    return filteredApplications.find((a) => a.id === form.applicationId) ?? null;
  }, [filteredApplications, form.applicationId]);

  const canSubmit =
    form.jobPostingId.trim().length > 0 &&
    form.applicationId.trim().length > 0 &&
    form.type.trim().length > 0 &&
    form.scheduledAt.trim().length > 0;

  const disabledAll = loadingJobPostings || loadingApplications || submitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!canSubmit || submitting) return;

    setSubmitting(true);
    try {
      const payload = {
        jobPostingId: form.jobPostingId,
        applicationId: form.applicationId,
        type: form.type,
        scheduledAt: toServerIso(form.scheduledAt),
        location: form.location.trim() ? form.location.trim() : null,
        status: form.status,
        memo: form.memo.trim() ? form.memo.trim() : null,
      };

      await axios.post("/api/interviews", payload);

      router.push("/interviews");
      router.refresh();
    } catch (err) {
      const ax = err as AxiosError<ApiErrorResponse>;
      if (ax.response?.status === 401) {
        setSubmitError("로그인이 필요합니다.");
      } else {
        setSubmitError(pickErrorMessage(ax.response?.data));
      }
    } finally {
      setSubmitting(false);
    }
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
              필수 항목(공고, 지원 이력, 일정)을 입력한 뒤 저장하세요.
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={disabledAll}
                className="disabled:cursor-not-allowed disabled:opacity-50"
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!canSubmit || disabledAll}
                className="disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "저장 중..." : "저장"}
              </Button>
            </div>
          </div>

          {pageError ? (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {pageError}
            </div>
          ) : null}

          {submitError ? (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitError}
            </div>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-4">
            {/* 공고 */}
            <div>
              <label className="text-xs font-semibold text-slate-700">공고 선택</label>

              <select
                value={form.jobPostingId}
                onChange={(e) => {
                  onChange("jobPostingId", e.target.value);
                  onChange("applicationId", "");
                }}
                disabled={disabledAll}
                className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingJobPostings ? (
                  <option value="">공고 불러오는 중...</option>
                ) : jobPostings.length === 0 ? (
                  <option value="">등록된 공고가 없습니다</option>
                ) : (
                  jobPostings.map((jp) => (
                    <option key={jp.id} value={jp.id}>
                      {(jp.companyName ?? "회사").trim()} ·{" "}
                      {(jp.position ?? jp.title ?? "공고").trim()}
                    </option>
                  ))
                )}
              </select>

              {selectedJobPosting ? (
                <p className="mt-2 text-[11px] text-slate-500">
                  선택됨:{" "}
                  <span className="font-semibold">
                    {selectedJobPosting.title || selectedJobPosting.position || "-"}
                  </span>
                </p>
              ) : null}
            </div>

            {/* 지원 이력 */}
            <div>
              <label className="text-xs font-semibold text-slate-700">지원 이력 선택</label>

              <select
                value={form.applicationId}
                onChange={(e) => onChange("applicationId", e.target.value)}
                disabled={disabledAll || !form.jobPostingId}
                className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingApplications ? (
                  <option value="">지원 이력 불러오는 중...</option>
                ) : filteredApplications.length === 0 ? (
                  <option value="">해당 공고에 연결된 지원 이력이 없습니다</option>
                ) : (
                  filteredApplications.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.status}
                      {a.appliedAt ? ` · ${a.appliedAt.slice(0, 10)}` : ""}
                    </option>
                  ))
                )}
              </select>

              {selectedApplication ? (
                <p className="mt-2 text-[11px] text-slate-500">
                  현재 상태: <span className="font-semibold">{selectedApplication.status}</span>
                </p>
              ) : null}
            </div>

            {/* 단계 */}
            <div>
              <label className="text-xs font-semibold text-slate-700">단계</label>

              <div className="mt-2 flex flex-wrap gap-2">
                {typePresets.map((p) => (
                  <Button
                    key={p}
                    type="button"
                    size="sm"
                    variant={form.type === p ? "primary" : "outline"}
                    onClick={() => onChange("type", p)}
                    disabled={disabledAll}
                    className="rounded-full disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            {/* 일정 */}
            <div>
              <label className="text-xs font-semibold text-slate-700">일정</label>
              <Input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => onChange("scheduledAt", e.target.value)}
                disabled={disabledAll}
                className="mt-2 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <p className="mt-2 text-[11px] text-slate-400">
                {form.scheduledAt
                  ? `미리보기: ${toPreviewDateTime(form.scheduledAt)}`
                  : "날짜와 시간을 선택하세요."}
              </p>
            </div>

            {/* 장소 */}
            <div>
              <label className="text-xs font-semibold text-slate-700">장소</label>
              <Input
                value={form.location}
                onChange={(e) => onChange("location", e.target.value)}
                placeholder="예: Zoom 링크 / 오프라인 주소"
                disabled={disabledAll}
                className="mt-2 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* 상태 */}
            <div>
              <label className="text-xs font-semibold text-slate-700">상태</label>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {(["예정", "합격", "불합격"] as InterviewStatus[]).map((s) => (
                  <Button
                    key={s}
                    type="button"
                    size="sm"
                    variant={form.status === s ? "primary" : "outline"}
                    onClick={() => onChange("status", s)}
                    disabled={disabledAll}
                    className="disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            {/* 메모 */}
            <div>
              <label className="text-xs font-semibold text-slate-700">메모</label>
              <textarea
                value={form.memo}
                onChange={(e) => onChange("memo", e.target.value)}
                placeholder="예: 준비 질문, 제출물, 안내사항 등"
                disabled={disabledAll}
                className="mt-2 min-h-[120px] w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
