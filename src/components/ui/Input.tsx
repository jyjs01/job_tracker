import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    // 추후 추가 가능성
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...rest }, ref) => {
    const base =
      "h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none text-slate-900 " +
      "placeholder:text-slate-500 " +
      "focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

    return <input ref={ref} className={`${base} ${className}`} {...rest} />;
  }
);

Input.displayName = "Input";

export default Input;
