import React from "react";

export type ClosingJobItem = {
  title: string;        
  companyInfo: string;
  locationInfo: string; 
  dueDate: string;      
  dday: string;         
};

interface ClosingJobCardProps {
  job: ClosingJobItem;
}

const ClosingJobCard: React.FC<ClosingJobCardProps> = ({ job }) => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 cursor-pointer hover:bg-slate-100">
      <div className="flex items-center gap-3">
        {/* 왼쪽 작은 아이콘 박스 */}
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-xs text-slate-500 shadow-sm">
          공고
        </div>

        {/* 텍스트 정보 */}
        <div>
          <p className="text-sm font-medium text-slate-900">{job.title}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {job.companyInfo}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {job.locationInfo}
          </p>
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
