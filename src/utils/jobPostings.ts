import type { DeadlineFilter } from "@/src/types/jobPostings";
import type { ApplicationStatus } from "@/src/types/applications";
import type { FieldErrors } from "@/src/types/error";

export function formatDate(value?: string | Date) {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "-";
  return d.toISOString().slice(0, 10);
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
export function formatDateTime(iso: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(
    d.getHours()
  )}:${pad2(d.getMinutes())}`;
}

export function getDeadlineStatus(dueDate?: string): DeadlineFilter | "없음" {
  if (!dueDate) return "없음";
  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return "없음";

  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffMs = targetDate.getTime() - startOfToday.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "마감 지남";
  if (diffDays <= 7) return "마감 임박";
  return "여유 있음";
}

export function getPagesToShow(currentPage: number, totalPages: number, windowSize = 3) {
  if (totalPages <= windowSize) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  let end = start + windowSize - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - windowSize + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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
export function pickErrorMessage(data: unknown): string {
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

export function dueInText(value?: string | Date) {
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

export function statusDot(status: ApplicationStatus) {
  if (status === "합격") return "bg-emerald-500";
  if (status === "불합격") return "bg-rose-500";
  if (status === "면접 진행") return "bg-sky-500";
  if (status === "서류 합격") return "bg-indigo-500";
  if (status === "지원 완료") return "bg-emerald-500";
  return "bg-slate-400";
}
export function inferDotColor(type: string) {
  const t = type.toLowerCase();
  if (t.includes("과제")) return "bg-amber-500";
  if (t.includes("테스트") || t.includes("coding") || t.includes("test")) return "bg-amber-500";
  return "bg-sky-500";
}