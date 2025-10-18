import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast) => {
    const id = ++idCounter;
    const item = { id, type: toast.type || 'info', title: toast.title, message: toast.message, duration: toast.duration ?? 3500 };
    setToasts((prev) => [...prev, item]);
    if (item.duration !== 0) {
      setTimeout(() => remove(id), item.duration);
    }
    return id;
  }, [remove]);

  return (
    <ToastContext.Provider value={{ toasts, push, remove }}>
      {children}
    </ToastContext.Provider>
  );
};
