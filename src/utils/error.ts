import type { FieldErrors } from "@/src/types/error";

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