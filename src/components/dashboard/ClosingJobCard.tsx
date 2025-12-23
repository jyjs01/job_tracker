import React from "react";
import {
  Code2,
  Server,
  Smartphone,
  Layers3,
  Database,
  type LucideIcon,
} from "lucide-react";

export type JobRole = "프론트엔드" | "백엔드" | "모바일" | "풀스택" | "데이터";

export type ClosingJobItem = {
  title: string;
  role: JobRole;
  companyInfo: string;
  locationInfo: string;
  dueDate: string;
  dday: string;
};

interface ClosingJobCardProps {
  job: ClosingJobItem;
}

const ROLE_ICON: Record<JobRole, { Icon: LucideIcon; label: string }> = {
  프론트엔드: { Icon: Code2, label: "FE" },
  백엔드: { Icon: Server, label: "BE" },
  모바일: { Icon: Smartphone, label: "APP" },
  풀스택: { Icon: Layers3, label: "FS" },
  데이터: { Icon: Database, label: "DATA" },
};

const ClosingJobCard: React.FC<ClosingJobCardProps> = ({ job }) => {
  const { Icon, label } = ROLE_ICON[job.role];

  return (
    <div className="group flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 transition-colors">
      <div className="flex items-center gap-3">
        <div className="relative">
          {/* 배경 그라데이션 + 링 */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-slate-900 to-slate-700 text-white shadow-sm ring-1 ring-slate-200 transition-transform duration-200 group-hover:scale-[1.03]">
            <Icon className="h-4 w-4 opacity-90" />
          </div>

          {/* 라벨 */}
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-white px-1.5 py-0.5 text-[9px] font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200">
            {label}
          </span>
        </div>

        {/* 텍스트 정보 */}
        <div>
          <p className="text-sm font-medium text-slate-900">{job.title}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">{job.companyInfo}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{job.locationInfo}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{job.dueDate}</p>
        </div>
      </div>

      {/* D-day 뱃지 */}
      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
        {job.dday}
      </span>
    </div>
  );
};

export default ClosingJobCard;
