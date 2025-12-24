export function formatDotDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export function formatTimeHHmm(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
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

export function startOfDay(d: Date) {
  const nd = new Date(d);
  nd.setHours(0, 0, 0, 0);
  return nd;
}

export function endOfDay(d: Date) {
  const nd = new Date(d);
  nd.setHours(23, 59, 59, 999);
  return nd;
}

export function startOfWeekMonday(d: Date) {
  const nd = startOfDay(d);
  const day = nd.getDay();
  const diffToMonday = (day + 6) % 7;
  nd.setDate(nd.getDate() - diffToMonday);
  return nd;
}

export function endOfWeekSunday(d: Date) {
  const s = startOfWeekMonday(d);
  const e = endOfDay(new Date(s));
  e.setDate(s.getDate() + 6);
  return e;
}

export function startOfMonth(d: Date) {
  return startOfDay(new Date(d.getFullYear(), d.getMonth(), 1));
}

export function endOfMonth(d: Date) {
  return endOfDay(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}

export function inferPlace(location: string | null) {
  if (!location || !location.trim()) return "online" as const;

  const v = location.toLowerCase();
  const onlineHints = ["http://", "https://", "zoom", "meet.google", "teams", "webex", "discord"];
  return onlineHints.some((h) => v.includes(h)) ? ("online" as const) : ("offline" as const);
}

export function toServerIso(datetimeLocal: string) {
  if (!datetimeLocal) return null;
  const d = new Date(datetimeLocal);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}