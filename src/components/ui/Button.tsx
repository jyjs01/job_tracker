import React from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "text";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-slate-900 text-slate-50 hover:bg-slate-950 border border-transparent",
  outline: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 border border-transparent",
  text: "bg-transparent text-slate-500 hover:underline border border-transparent p-0 h-auto",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-3 text-sm",
  lg: "h-11 px-4 text-sm",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
  children,
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-semibold transition-colors cursor-pointer";
  const width = fullWidth ? "w-full" : "";

  const classes = [
    base,
    variantStyles[variant],
    sizeStyles[size],
    width,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;
