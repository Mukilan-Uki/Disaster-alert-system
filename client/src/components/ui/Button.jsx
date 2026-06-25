// src/components/ui/Button.jsx
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-cyan-400 text-midnight-400 hover:bg-cyan-500 focus-visible:ring-cyan-400/50 shadow-glow",
  signal:
    "bg-signal-400 text-midnight-400 hover:bg-signal-500 focus-visible:ring-signal-400/50",
  ghost:
    "bg-transparent text-mist border border-white/15 hover:bg-white/5 focus-visible:ring-white/30",
  outline:
    "bg-transparent text-midnight-400 dark:text-mist border border-midnight-400/20 dark:border-white/20 hover:bg-midnight-400/5 dark:hover:bg-white/5 focus-visible:ring-cyan-400/40",
  danger:
    "bg-danger-400 text-white hover:bg-danger-500 focus-visible:ring-danger-400/50",
  link: "bg-transparent text-cyan-400 hover:text-cyan-500 underline-offset-4 hover:underline p-0 h-auto",
};

const SIZES = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

const Button = forwardRef(
  (
    {
      as: Component = "button",
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-display font-medium tracking-tight
          transition-all duration-200 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-midnight-400
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-none
          active:scale-[0.98]
          ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </Component>
    );
  }
);

Button.displayName = "Button";
export default Button;
