import React from "react";

export interface FilterSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  className = "",
  children,
  ...rest
}) => {
  const base =
    "h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs " +
    "text-slate-700 shadow-sm outline-none " +
    "focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <select className={`${base} ${className}`} {...rest}>
        {children}
      </select>
    </div>
  );
};

export default FilterSelect;