import { InputHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  className?: string;
  rightIcon?: ReactNode;
}

export function Input({
  label,
  icon,
  error,
  className,
  rightIcon,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={props.id} className="text-sm text-text-secondary">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={twMerge(
            `text-md w-full rounded-md border border-border bg-white px-4 py-2 text-text-primary shadow-sm outline-none transition placeholder:text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary`,
            icon ? "pl-10" : "",
            rightIcon ? "pr-10" : "",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "",
            className,
          )}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {rightIcon}
          </span>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
