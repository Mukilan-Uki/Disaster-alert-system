// src/components/ui/Loader.jsx
export default function Loader({ label = "Loading", size = "md" }) {
  const dims = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-9 w-9" };
  return (
    <div role="status" className="flex items-center gap-2 text-cyan-500">
      <svg className={`${dims[size]} animate-spin`} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}
