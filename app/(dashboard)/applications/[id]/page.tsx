"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

import type { ApplicationRow, ApplicationStatus } from "@/src/types/applications";
import Button from "@/src/components/ui/Button";
import FilterSelect from "@/src/components/ui/FilterSelect";
import Input from "@/src/components/ui/Input";

type JobPostingApiRow = {
  id?: string;
  _id?: string;
  company_name?: string;
  companyName?: string;
  position?: string;
  title?: string;
  url?: string;
};

type InterviewStatus = "예정" | "합격" | "불합격";

type InterviewRow = {
  id: string;
  userId: string;
  jobPostingId: string;
  applicationId: string;

  type: string;
  scheduledAt: string | null;
  location: string | null;

  status: InterviewStatus;
  memo: string | null;

  createdAt: string;
  updatedAt: string;
};

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

const STATUS_OPTIONS: ApplicationStatus[] = [
  "준비",
  "지원 완료",
  "서류 합격",
  "면접 진행",
  "합격",
  "불합격",
];

function toDateInputValue(v: string | null) {
  if (!v) return "";
  return v.includes("T") ? v.slice(0, 10) : v;
}

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
  if (!isRecord(data)) return "오류가 발생했습니다.";

  if (typeof data.error === "string" && data.error.trim()) return data.error;

  if (isFieldErrors(data.fieldErrors)) {
    const firstKey = Object.keys(data.fieldErrors)[0];
    const firstMsg = firstKey ? data.fieldErrors[firstKey]?.[0] : undefined;
    if (firstMsg) return firstMsg;
  }

  if (isStringArray(data.formErrors) && data.formErrors[0]) return data.formErrors[0];

  const details = data.details;
  if (isRecord(details)) {
    if (isFieldErrors(details.fieldErrors)) {
      const firstKey = Object.keys(details.fieldErrors)[0];
      const firstMsg = firstKey ? details.fieldErrors[firstKey]?.[0] : undefined;
      if (firstMsg) return firstMsg;
    }
    if (isStringArray(details.formErrors) && details.formErrors[0]) return details.formErrors[0];
  }

  return "오류가 발생했습니다.";
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatDateTimeText(iso: string | null) {
  if (!iso) return "일정 미정";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "일정 미정";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(
    d.getHours()
  )}:${pad2(d.getMinutes())}`;
}

function inferScheduleBadge(type: string) {
  // UI 라벨은 기존처럼 type 그대로(1차 면접/과제 제출/코딩테스트 등)
  return type;
}

function badgeStyle() {
  return "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700";
}

function statusBadgeStyle(status: InterviewStatus) {
  const base = "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold";
  if (status === "예정") return `${base} bg-slate-100 text-slate-700`;
  if (status === "합격") return `${base} bg-emerald-50 text-emerald-700`;
  return `${base} bg-rose-50 text-rose-700`;
}

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const applicationId = params?.id;

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [jobUrl, setJobUrl] = useState("");

  const [status, setStatus] = useState<ApplicationStatus>("준비");
  const [appliedAt, setAppliedAt] = useState("");
  const [memo, setMemo] = useState("");

  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<InterviewRow[]>([]);

  const fetchDetail = async () => {
    if (!applicationId) return;

    try {
      setLoading(true);
      setErrorMsg(null);

      const [appRes, postingsRes] = await Promise.all([
        axios.get<{ data: ApplicationRow }>(`/api/applications/${applicationId}`),
        axios.get<{ data: JobPostingApiRow[] }>("/api/job-postings"),
      ]);

      const app = appRes.data.data;
      const jobPostings = postingsRes.data.data ?? [];

      const posting = jobPostings.find((jp) => {
        const id = String(jp.id ?? jp._id ?? "");
        return id === app.jobPostingId;
      });

      const cName = posting?.company_name ?? posting?.companyName ?? "회사명 미기입";
      const pos = posting?.position ?? posting?.title ?? "-";
      const url = posting?.url ?? "";

      setCompanyName(cName);
      setPosition(pos);
      setJobUrl(url);

      setStatus(app.status);
      setAppliedAt(toDateInputValue(app.appliedAt));
      setMemo(app.memo ?? "");
    } catch (err: unknown) {
      console.error("지원 상세 불러오기 오류:", err);
      setErrorMsg("지원 상세 정보를 불러오는 중 오류가 발생했습니다.");

      setCompanyName("");
      setPosition("");
      setJobUrl("");
      setStatus("준비");
      setAppliedAt("");
      setMemo("");
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    if (!applicationId) return;

    try {
      setScheduleLoading(true);
      setScheduleError(null);

      const res = await axios.get<{ data: InterviewRow[] }>("/api/interviews");
      const all = res.data.data ?? [];

      const filtered = all
        .filter((it) => it.applicationId === applicationId)
        .sort((a, b) => {
          const ta = a.scheduledAt ? new Date(a.scheduledAt).getTime() : Number.POSITIVE_INFINITY;
          const tb = b.scheduledAt ? new Date(b.scheduledAt).getTime() : Number.POSITIVE_INFINITY;
          return ta - tb;
        });

      setSchedules(filtered);
    } catch (err: unknown) {
      const ax = err as AxiosError<ApiErrorResponse>;
      console.error("면접/과제 일정 불러오기 오류:", err);

      if (ax.response?.status === 401) {
        setScheduleError("로그인이 필요합니다.");
      } else {
        setScheduleError(pickErrorMessage(ax.response?.data));
      }

      setSchedules([]);
    } finally {
      setScheduleLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  const onClickEdit = () => setIsEditing(true);

  const onClickSave = async () => {
    if (!applicationId) return;

    try {
      const payload: Partial<{
        status: ApplicationStatus;
        appliedAt: string | null;
        memo: string | null;
      }> = {
        status,
        appliedAt: appliedAt ? appliedAt : null,
        memo: memo ? memo : null,
      };

      const res = await axios.patch<{ data: ApplicationRow }>(
        `/api/applications/${applicationId}`,
        payload
      );
      const updated = res.data.data;

      setStatus(updated.status);
      setAppliedAt(toDateInputValue(updated.appliedAt));
      setMemo(updated.memo ?? "");

      setIsEditing(false);
      alert("저장 완료!");
    } catch (err: unknown) {
      console.error("지원 상세 저장 오류:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const onClickDelete = async () => {
    if (!applicationId) return;
    const ok = confirm("정말 삭제할까요?");
    if (!ok) return;

    try {
      await axios.delete(`/api/applications/${applicationId}`);
      router.push("/applications");
    } catch (err: unknown) {
      console.error("지원 삭제 오류:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const readOnlyBox =
    "h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 flex items-center";

  const scheduleCountText = useMemo(() => {
    return `${schedules.length}개`;
  }, [schedules.length]);

  if (loading) {
    return (
      <main className="px-6 py-6">
        <div className="text-sm text-slate-500">불러오는 중...</div>
      </main>
    );
  }

  if (errorMsg) {
    return (
      <main className="px-6 py-6">
        <div className="flex items-center gap-3">
          <Link
            href="/applications"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            aria-label="back"
          >
            ←
          </Link>
          <div className="text-sm font-semibold text-slate-900">지원 상세</div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-rose-600">{errorMsg}</p>
          <div className="mt-4 flex items-center gap-2">
            <Button variant="outline" onClick={fetchDetail}>
              다시 시도
            </Button>
            <Button variant="primary" onClick={() => router.push("/applications")}>
              목록으로
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/applications"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            aria-label="back"
          >
            ←
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">지원 상세</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            type="button"
            onClick={onClickEdit}
            disabled={isEditing}
          >
            수정
          </Button>
          <Button
            variant="primary"
            size="md"
            type="button"
            onClick={onClickSave}
            disabled={!isEditing}
          >
            저장
          </Button>
          <Button variant="outline" size="md" type="button" onClick={onClickDelete}>
            삭제
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 지원 정보 */}
        <section className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">지원 정보</div>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="text-[11px] font-medium text-slate-500">회사명</p>
              <div className={`mt-2 ${readOnlyBox}`}>
                <span className="truncate">{companyName || "-"}</span>
              </div>
            </div>

            <div className="lg:col-span-4">
              <FilterSelect
                label="지원 상태"
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                disabled={!isEditing}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </FilterSelect>
            </div>

            <div className="lg:col-span-12">
              <p className="text-[11px] font-medium text-slate-500">포지션</p>
              <div className={`mt-2 ${readOnlyBox}`}>
                <span className="truncate">{position || "-"}</span>
              </div>
            </div>

            <div className="lg:col-span-12">
              <p className="text-[11px] font-medium text-slate-500">공고 링크</p>
              <div className="mt-2 flex items-center gap-2">
                <div className={readOnlyBox}>
                  <span className="truncate">{jobUrl || "-"}</span>
                </div>
                <a
                  href={jobUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  aria-label="open-link"
                >
                  ↗
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <p className="text-[11px] font-medium text-slate-500">지원 날짜</p>
              <Input
                type="date"
                value={appliedAt}
                onChange={(e) => setAppliedAt(e.target.value)}
                className="mt-2 disabled:bg-slate-50 disabled:text-slate-500"
                disabled={!isEditing}
              />
            </div>

            <div className="lg:col-span-12">
              <p className="text-[11px] font-medium text-slate-500">메모</p>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={8}
                className={
                  "mt-2 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none " +
                  "placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 " +
                  "disabled:bg-slate-50 disabled:text-slate-500"
                }
                disabled={!isEditing}
              />
            </div>
          </div>
        </section>

        {/* ✅ 면접/과제 일정: API 로드 결과 표시 */}
        <section className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">면접 및 과제 일정</div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{scheduleCountText}</span>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={fetchSchedules}
                disabled={scheduleLoading}
                className="disabled:cursor-not-allowed disabled:opacity-60"
              >
                새로고침
              </Button>
            </div>
          </div>

          {scheduleError ? (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {scheduleError}
            </div>
          ) : null}

          <div className="mt-5 space-y-3">
            {scheduleLoading ? (
              <div className="text-sm text-slate-500">일정을 불러오는 중...</div>
            ) : schedules.length === 0 ? (
              <div className="text-sm text-slate-500">등록된 일정이 없습니다.</div>
            ) : (
              schedules.map((it) => (
                <div
                  key={it.id}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={badgeStyle()}>{inferScheduleBadge(it.type)}</span>
                        <span className="text-xs font-medium text-slate-500">
                          {formatDateTimeText(it.scheduledAt)}
                        </span>
                        <span className={statusBadgeStyle(it.status)}>{it.status}</span>
                      </div>

                      {it.location ? (
                        <div className="mt-2 text-xs text-slate-500">장소: {it.location}</div>
                      ) : null}

                      {it.memo ? (
                        <div className="mt-2 text-xs text-slate-700 whitespace-pre-wrap">
                          {it.memo}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
