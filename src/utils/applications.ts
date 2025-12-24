import type { ApplicationStatus } from "@/src/types/applications";
import type { InterviewStatus } from "@/src/types/interviews";
import type { FieldErrors } from "@/src/types/error";

export function getInitial(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed[0].toUpperCase();
}

export function badgeClass(status: ApplicationStatus) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium";
  switch (status) {
    case "준비":
      return `${base} border-slate-200 bg-slate-50 text-slate-700`;
    case "지원 완료":
      return `${base} border-slate-200 bg-white text-slate-700`;
    case "서류 합격":
      return `${base} border-emerald-200 bg-emerald-50 text-emerald-700`;
    case "면접 진행":
      return `${base} border-blue-200 bg-blue-50 text-blue-700`;
    case "합격":
      return `${base} border-purple-200 bg-purple-50 text-purple-700`;
    case "불합격":
      return `${base} border-rose-200 bg-rose-50 text-rose-700`;
    default:
      return `${base} border-slate-200 bg-white text-slate-700`;
  }
}

export function statusBadgeStyle(status: InterviewStatus) {
  const base = "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold";
  if (status === "예정") return `${base} bg-slate-100 text-slate-700`;
  if (status === "합격") return `${base} bg-emerald-50 text-emerald-700`;
  return `${base} bg-rose-50 text-rose-700`;
}

export function formatDate(value?: string | Date | null) {
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