// src/components/ui/Input.jsx
import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block font-body text-sm font-medium text-midnight-400 dark:text-mist"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={`w-full rounded-lg border bg-white px-4 py-2.5 font-body text-sm text-midnight-400
            placeholder:text-midnight-400/40 transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400
            dark:bg-midnight-200 dark:text-mist dark:placeholder:text-mist/30
            ${error ? "border-danger-400 focus:ring-danger-400/30" : "border-midnight-400/15 dark:border-white/15"}
            ${className}`}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-danger-400">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-midnight-400/50 dark:text-mist/50">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
