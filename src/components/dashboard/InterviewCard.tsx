import React from "react";

export type InterviewItem = {
  day: string;     
  title: string;   
  step: string;     
  dateTime: string; 
  dday: string;     
};

interface InterviewCardProps {
  item: InterviewItem;
}

const InterviewCard: React.FC<InterviewCardProps> = ({ item }) => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 cursor-pointer hover:bg-slate-100">
      <div className="flex items-center gap-3">
        {/* 왼쪽 작은 날짜 박스 */}
        <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-white text-[11px] text-slate-500 shadow-sm">
          <span className="text-[10px]">일</span>
          <span className="text-sm font-semibold text-slate-900">
            {item.day}
          </span>
        </div>

        {/* 텍스트 정보 */}
        <div>
          <p className="text-sm font-medium text-slate-900">{item.title}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">{item.step}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{item.dateTime}</p>
        </div>
      </div>

      {/* D-day 뱃지 */}
      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
        {item.dday}
      </span>
    </div>
  );
};

export default InterviewCard;
