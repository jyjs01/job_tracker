import type { JsonObject, DashboardVM } from "@/src/types/dashboard";
import { JobRole } from "@/src/components/dashboard/ClosingJobCard";

export function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null;
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function getString(obj: JsonObject, key: string): string | null {
  const v = obj[key];
  return typeof v === "string" ? v : null;
}

export function getUnknown(obj: JsonObject, key: string): unknown {
  return obj[key];
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function formatYmd(date: Date) {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}-${m}-${d}`;
}

function parseDateLike(value: unknown): Date | null {
  if (!value) return null;

  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const d = new Date(`${value}T23:59:59+09:00`);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

export function parseDueDate(value: unknown): Date | null {
  if (typeof value !== "string" || !value) return null;

  const datePart = value.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return null;

  const d = new Date(`${datePart}T23:59:59+09:00`);
  return isNaN(d.getTime()) ? null : d;
}

export function diffDaysFromNow(target: Date, now = new Date()) {
  const ms = target.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function toDday(target: Date) {
  const d = diffDaysFromNow(target);
  if (d === 0) return "D-day";
  if (d > 0) return `D-${d}`;
  return `D+${Math.abs(d)}`;
}

export function weekRange(now = new Date()) {
  const cur = new Date(now);
  const day = cur.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;

  const start = new Date(cur);
  start.setDate(cur.getDate() + diffToMon);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  end.setMilliseconds(-1);

  return { start, end };
}

export function calcPassRate(passed: number, total: number) {
  if (!total) return "0.0%";
  return `${((passed / total) * 100).toFixed(1)}%`;
}

export function isDocPassed(status: unknown) {
  const s = String(status ?? "").toLowerCase();
  return (
    (s.includes("doc") && s.includes("pass")) ||
    (s.includes("document") && s.includes("pass")) ||
    (s.includes("서류") && (s.includes("합격") || s.includes("통과")))
  );
}

export function pickFirstString(obj: JsonObject, keys: string[]) {
  for (const k of keys) {
    const v = getString(obj, k);
    if (v && v.trim()) return v;
  }
  return "";
}

export function pickFirstDate(obj: JsonObject, keys: string[]) {
  for (const k of keys) {
    const d = parseDateLike(getUnknown(obj, k));
    if (d) return d;
  }
  return null;
}

export function isJobRole(v: unknown): v is JobRole {
  return (
    v === "프론트엔드" ||
    v === "백엔드" ||
    v === "모바일" ||
    v === "풀스택" ||
    v === "데이터"
  );
}

export function getDefaultVM(): DashboardVM {
  return {
    stats: {
      totalApplications: 0,
      passedDocs: 0,
      passRate: "0.0%",
      weeklyApplied: 0,
      thisWeekInterviews: 0,
    },
    upcomingInterviews: [],
    closingJobs: [],
  };
}