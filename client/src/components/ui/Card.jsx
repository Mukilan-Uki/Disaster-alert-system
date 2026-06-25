// src/components/ui/Card.jsx
export function Card({ className = "", children, glass = false, ...props }) {
  return (
    <div
      className={`rounded-card border ${
        glass
          ? "bg-white/[0.04] border-white/10 backdrop-blur-xl"
          : "bg-white border-midnight-400/8 dark:bg-midnight-200 dark:border-white/10"
      } shadow-panel ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }) {
  return <div className={`p-6 pb-3 ${className}`}>{children}</div>;
}

export function CardBody({ className = "", children }) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }) {
  return (
    <h3 className={`font-display text-lg font-semibold text-midnight-400 dark:text-mist ${className}`}>
      {children}
    </h3>
  );
}

export default Card;
