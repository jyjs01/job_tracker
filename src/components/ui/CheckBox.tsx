import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    // 추후 추가 가능성
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", ...rest }, ref) => {
    const base =
      "h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-blue-500";

    return (
      <input
        ref={ref}
        type="checkbox"
        className={`${base} ${className}`}
        {...rest}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
