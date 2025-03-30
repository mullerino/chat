import { InputHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  className?: string;
}

export function Input({ label, icon, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={props.id} className="text-text-secondary text-sm">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="text-text-secondary absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={twMerge(
            `text-md text-text-primary placeholder:text-text-secondary w-full rounded-md border border-border bg-white px-4 py-2 shadow-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary`,
            icon ? "pl-10" : "",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "",
            className,
          )}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
