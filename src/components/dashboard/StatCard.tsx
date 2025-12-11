import React from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  subText?: string;
  rightIcon?: React.ReactNode; 
};

export default function StatCard({
  label,
  value,
  subText,
  rightIcon,
}: StatCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
        {subText && (
          <p className="mt-1 text-[11px] text-slate-400">{subText}</p>
        )}
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 text-xs">
        {rightIcon ?? "아이콘"}
      </div>
    </div>
  );
}
