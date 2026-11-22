import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = 'success') => {
      counter.current += 1;
      const id = counter.current;
      setToasts((current) => [...current, { id, message, type }]);
      window.setTimeout(() => dismiss(id), 3800);
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" role="status" aria-live="polite">
        {toasts.map((item) => {
          const Icon = ICONS[item.type] ?? Info;
          return (
            <div key={item.id} className={`toast toast--${item.type}`}>
              <span className="toast__icon">
                <Icon size={18} />
              </span>
              <span className="toast__message">{item.message}</span>
              <button
                type="button"
                className="toast__close"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside a ToastProvider');
  return context;
};
