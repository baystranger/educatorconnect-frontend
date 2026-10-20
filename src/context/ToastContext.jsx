import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);
let nextId = 1;

/** App-wide success / error notifications ("Changes saved", API errors). */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);

  const show = useCallback((message, tone = 'success') => {
    if (!message) return;
    const id = nextId++;
    setToasts((current) => [...current.slice(-2), { id, message, tone }]);
    setTimeout(() => dismiss(id), tone === 'error' ? 7000 : 4000);
  }, [dismiss]);

  const value = useMemo(() => ({
    success: (message) => show(message, 'success'),
    info: (message) => show(message, 'info'),
    error: (errorOrMessage) => show(typeof errorOrMessage === 'string' ? errorOrMessage : errorOrMessage?.message, 'error'),
  }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="ec-toasts" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`ec-toast ec-toast-${toast.tone}`} role={toast.tone === 'error' ? 'alert' : 'status'}>
            <span>{toast.message}</span>
            <button type="button" aria-label="Dismiss" onClick={() => dismiss(toast.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>.');
  return context;
}
