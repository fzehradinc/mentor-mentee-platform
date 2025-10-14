import { useState, useCallback } from 'react';

interface ToastConfig {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastState extends ToastConfig {
  id: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((config: ToastConfig) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...config, id }]);
  }, []);

  const hideToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    showToast({ message, type: 'success', duration });
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    showToast({ message, type: 'error', duration });
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    showToast({ message, type: 'info', duration });
  }, [showToast]);

  return {
    toasts,
    showToast,
    hideToast,
    success,
    error,
    info
  };
};
