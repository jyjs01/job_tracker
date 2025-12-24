import type { ScheduleItem } from "@/src/types/schedule";

export function StatusBadge({ status }: { status: ScheduleItem["status"] }) {
  const cls =
    status === "예정"
      ? "bg-slate-100 text-slate-700"
      : status === "합격"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-rose-50 text-rose-700";

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

export function PlaceIcon({ place }: { place: ScheduleItem["place"] }) {
  if (place === "online") {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-slate-600">
        <svg width="16" height="16" viewBox="0 0 24 24" className="text-slate-500">
          <path
            fill="currentColor"
            d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-4.5l2 3H15l-2-3H7a3 3 0 0 1-3-3V5zm3-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H7z"
          />
        </svg>
        온라인
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-600">
      <svg width="16" height="16" viewBox="0 0 24 24" className="text-slate-500">
        <path
          fill="currentColor"
          d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1zm13 9H4v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9zM5 6a1 1 0 0 0-1 1v2h16V7a1 1 0 0 0-1-1H5z"
        />
      </svg>
      오프라인
    </span>
  );
}