"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import FilterSelect from "@/src/components/ui/FilterSelect";

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

type JobPostingDetail = {
  id: string;
  title?: string | null;
  position?: string | null;
  companyName?: string | null;
  url?: string | null;
};

type ApplicationDetail = {
  id: string;
  status: string;
  appliedAt: string | null;
  memo: string | null;
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

function toDateTimeLocalValue(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  // datetime-local 은 로컬 기준 "YYYY-MM-DDTHH:mm"
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(
    d.getHours()
  )}:${pad2(d.getMinutes())}`;
}

function toServerIso(datetimeLocal: string) {
  if (!datetimeLocal) return null;
  const d = new Date(datetimeLocal);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function formatKSTLike(iso: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(
    d.getHours()
  )}:${pad2(d.getMinutes())}`;
}

const TYPE_PRESETS = [
  "1차 면접",
  "2차 면접",
  "최종 면접",
  "코딩테스트",
  "라이브 코딩",
  "과제 제출",
  "과제 발표",
];

const STATUS_OPTIONS: InterviewStatus[] = ["예정", "합격", "불합격"];

export default function InterviewDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const interviewId = params?.id;

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [interview, setInterview] = useState<InterviewRow | null>(null);

  const [jobPosting, setJobPosting] = useState<JobPostingDetail | null>(null);
  const [application, setApplication] = useState<ApplicationDetail | null>(null);

  const [type, setType] = useState("");
  const [scheduledAtLocal, setScheduledAtLocal] = useState(""); // datetime-local
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<InterviewStatus>("예정");
  const [memo, setMemo] = useState("");

  const hydrateForm = (row: InterviewRow) => {
    setType(row.type ?? "");
    setScheduledAtLocal(toDateTimeLocalValue(row.scheduledAt));
    setLocation(row.location ?? "");
    setStatus(row.status);
    setMemo(row.memo ?? "");
  };

  const fetchInterview = async () => {
    if (!interviewId || interviewId === "undefined") return;

    try {
      setLoading(true);
      setPageError(null);

      const res = await axios.get(`/api/interviews/${interviewId}`);
      const data = res.data.data;
      const row = Array.isArray(data) ? data[0] : data;
      console.log(row);

      setInterview(row);
      hydrateForm(row);
    } catch (err: unknown) {
      const ax = err as AxiosError<ApiErrorResponse>;
      if (ax.response?.status === 401) {
        setPageError("로그인이 필요합니다.");
      } else {
        setPageError(pickErrorMessage(ax.response?.data));
      }
      setInterview(null);
      setJobPosting(null);
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  const canSave = useMemo(() => {
    return type.trim().length > 0 && scheduledAtLocal.trim().length > 0;
  }, [type, scheduledAtLocal]);

  const onClickEdit = () => {
    if (!interview) return;
    hydrateForm(interview);
    setIsEditing(true);
  };

  const onClickCancelEdit = () => {
    if (!interview) return;
    hydrateForm(interview);
    setIsEditing(false);
  };

  const onSave = async () => {
    if (!interviewId || interviewId === "undefined") return;
    if (!canSave || saving) return;

    try {
      setSaving(true);

      const payload = {
        type: type.trim(),
        scheduledAt: toServerIso(scheduledAtLocal),
        location: location.trim() ? location.trim() : null,
        status,
        memo: memo.trim() ? memo.trim() : null,
      };

      const res = await axios.patch(`/api/interviews/${interviewId}`, payload);

      const updated = res.data.data;
      setInterview(updated);
      hydrateForm(updated);
      setIsEditing(false);
      router.refresh();
    } catch (err: unknown) {
      const ax = err as AxiosError<ApiErrorResponse>;
      const msg =
        ax.response?.status === 401 ? "로그인이 필요합니다." : pickErrorMessage(ax.response?.data);
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!interviewId || interviewId === "undefined") return;
    if (deleting) return;

    const ok = window.confirm("이 일정을 삭제할까요?\n삭제 후에는 되돌릴 수 없습니다.");
    if (!ok) return;

    try {
      setDeleting(true);
      await axios.delete(`/api/interviews/${interviewId}`);
      router.replace("/interviews");
      router.refresh();
    } catch (err: unknown) {
      const ax = err as AxiosError<ApiErrorResponse>;
      const msg =
        ax.response?.status === 401 ? "로그인이 필요합니다." : pickErrorMessage(ax.response?.data);
      alert(msg);
    } finally {
      setDeleting(false);
    }
  };

  const readOnlyBox =
    "h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 flex items-center";

  const statusBadgeClass = useMemo(() => {
    if (status === "예정") return "bg-slate-100 text-slate-700";
    if (status === "합격") return "bg-emerald-50 text-emerald-700";
    return "bg-rose-50 text-rose-700";
  }, [status]);

  return (
    <main className="px-6 py-6">
      <div className="mx-auto w-full max-w-6xl">
        {/* 상단 */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/interviews"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              aria-label="back"
            >
              ←
            </Link>

            <div>
              <h1 className="text-xl font-semibold text-slate-900">면접/과제 일정 상세</h1>
              <p className="mt-1 text-xs text-slate-500">
                일정 정보를 확인하고 필요하면 수정할 수 있어요.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" type="button" onClick={fetchInterview} disabled={loading}>
              새로고침
            </Button>

            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClickCancelEdit}
                  disabled={saving || deleting}
                >
                  취소
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  onClick={onSave}
                  disabled={!canSave || saving || deleting}
                  className="disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "저장 중..." : "저장"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" type="button" onClick={onClickEdit} disabled={!interview}>
                  수정
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onDelete}
                  disabled={!interview || deleting}
                  className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? "삭제 중..." : "삭제"}
                </Button>
              </>
            )}
          </div>
        </div>

        {pageError ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {pageError}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            불러오는 중...
          </div>
        ) : !interview ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            일정을 찾을 수 없습니다.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* 왼쪽: 일정 정보 */}
            <section className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">일정 정보</div>

                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass}`}
                >
                  {interview.status}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
                {/* 타입 */}
                <div className="lg:col-span-12">
                  <p className="text-[11px] font-medium text-slate-500">단계/타입</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {TYPE_PRESETS.map((p) => (
                      <Button
                        key={p}
                        type="button"
                        size="sm"
                        variant={type === p ? "primary" : "outline"}
                        className="rounded-full"
                        onClick={() => isEditing && setType(p)}
                        disabled={!isEditing}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>

                  <div className="mt-3">
                    <Input
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      placeholder="예: 1차 면접 / 과제 발표"
                      disabled={!isEditing}
                      className="disabled:bg-slate-50 disabled:text-slate-700"
                    />
                  </div>
                </div>

                {/* 일정 */}
                <div className="lg:col-span-6">
                  <p className="text-[11px] font-medium text-slate-500">일정</p>
                  <Input
                    type="datetime-local"
                    value={scheduledAtLocal}
                    onChange={(e) => setScheduledAtLocal(e.target.value)}
                    disabled={!isEditing}
                    className="mt-2 disabled:bg-slate-50 disabled:text-slate-700"
                  />
                  <p className="mt-2 text-[11px] text-slate-400">
                    {scheduledAtLocal ? `미리보기: ${formatKSTLike(toServerIso(scheduledAtLocal))}` : "날짜/시간을 선택하세요."}
                  </p>
                </div>

                {/* 상태 */}
                <div className="lg:col-span-6">
                  <FilterSelect
                    label="상태"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as InterviewStatus)}
                    disabled={!isEditing}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </FilterSelect>
                </div>

                {/* 장소 */}
                <div className="lg:col-span-12">
                  <p className="text-[11px] font-medium text-slate-500">장소</p>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="예: Zoom 링크 / 오프라인 주소"
                    disabled={!isEditing}
                    className="mt-2 disabled:bg-slate-50 disabled:text-slate-700"
                  />
                  {!isEditing && (
                    <p className="mt-2 text-[11px] text-slate-400">
                      {interview.location ? "링크/주소를 클릭해서 복사하거나 열어보세요." : "장소 정보가 없습니다."}
                    </p>
                  )}
                </div>

                {/* 메모 */}
                <div className="lg:col-span-12">
                  <p className="text-[11px] font-medium text-slate-500">메모</p>
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    rows={8}
                    placeholder="예: 준비 질문, 제출물, 안내사항 등"
                    disabled={!isEditing}
                    className={
                      "mt-2 w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none " +
                      "placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 " +
                      "disabled:bg-slate-50 disabled:text-slate-700"
                    }
                  />
                </div>
              </div>
            </section>

            {/* 오른쪽: 연결 정보/메타 */}
            <aside className="lg:col-span-4 space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">연결 정보</div>

                <div className="mt-4 space-y-3 text-[11px] text-slate-500">
                  <div>
                    <p className="text-slate-400">채용 공고</p>
                    {interview.jobPostingId ? (
                      <div className="mt-2">
                        <Link
                          href={`/job-postings/${interview.jobPostingId}`}
                          className="text-xs font-semibold text-sky-700 hover:underline"
                        >
                          {jobPosting?.companyName
                            ? `${jobPosting.companyName} · ${jobPosting.position ?? jobPosting.title ?? "공고"}`
                            : "공고 상세로 이동"}
                        </Link>
                        {jobPosting?.url ? (
                          <p className="mt-1">
                            <a
                              href={jobPosting.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-slate-500 underline"
                            >
                              공고 링크 열기
                            </a>
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <div className={`mt-2 ${readOnlyBox}`}>-</div>
                    )}
                  </div>

                  <div>
                    <p className="text-slate-400">지원 이력</p>
                    {interview.applicationId ? (
                      <div className="mt-2">
                        <Link
                          href={`/applications/${interview.applicationId}`}
                          className="text-xs font-semibold text-sky-700 hover:underline"
                        >
                          {application ? `지원 상세로 이동 · ${application.status}` : "지원 상세로 이동"}
                        </Link>
                        {application?.appliedAt ? (
                          <p className="mt-1 text-[11px] text-slate-400">
                            지원일: {application.appliedAt.slice(0, 10)}
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <div className={`mt-2 ${readOnlyBox}`}>-</div>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">메타 정보</div>

                <div className="mt-4 space-y-3 text-[11px] text-slate-500">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">생성</span>
                    <span className="text-xs font-medium text-slate-800">
                      {interview.createdAt ? interview.createdAt.slice(0, 10) : "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">수정</span>
                    <span className="text-xs font-medium text-slate-800">
                      {interview.updatedAt ? interview.updatedAt.slice(0, 10) : "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">현재 상태</span>
                    <span className="text-xs font-medium text-slate-800">{interview.status}</span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
