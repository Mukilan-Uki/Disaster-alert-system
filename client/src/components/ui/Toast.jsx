// src/components/ui/Toast.jsx
import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = { success: CheckCircle2, error: XCircle, warning: AlertTriangle, info: Info };
const TONES = {
  success: "border-safe-400/30 text-safe-500",
  error: "border-danger-400/30 text-danger-400",
  warning: "border-signal-400/30 text-signal-500",
  info: "border-cyan-400/30 text-cyan-500",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ tone = "info", title, description, duration = 4000 }) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, tone, title, description }]);
      if (duration) setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.tone];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className={`pointer-events-auto flex items-start gap-3 rounded-lg border bg-white p-4 shadow-panel dark:bg-midnight-200 ${TONES[t.tone]}`}
                role="status"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="flex-1">
                  {t.title && (
                    <p className="font-body text-sm font-semibold text-midnight-400 dark:text-mist">{t.title}</p>
                  )}
                  {t.description && (
                    <p className="mt-0.5 font-body text-sm text-midnight-400/70 dark:text-mist/70">{t.description}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="text-midnight-400/40 hover:text-midnight-400 dark:text-mist/40 dark:hover:text-mist"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
