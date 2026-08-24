import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const push = useCallback((message, tone = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, message, tone }]);
    setTimeout(() => dismiss(id), 4200);
  }, [dismiss]);

  const value = useMemo(() => ({
    toast: {
      success: (message) => push(message, "success"),
      error: (message) => push(message, "error"),
      info: (message) => push(message, "info"),
    },
  }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${
              item.tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : item.tone === "error" ? "border-rose-200 bg-rose-50 text-rose-900"
                  : "border-slate-200 bg-white text-slate-800"
            }`}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext)?.toast || { success() {}, error() {}, info() {} };
}
