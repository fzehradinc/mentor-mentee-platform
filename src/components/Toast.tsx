import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const configs = {
    success: {
      icon: CheckCircle,
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-900',
      iconColor: 'text-green-600'
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-900',
      iconColor: 'text-red-600'
    },
    info: {
      icon: CheckCircle,
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-900',
      iconColor: 'text-blue-600'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full ${config.bg} border-2 ${config.border} rounded-xl shadow-lg p-4 animate-slideIn`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <p className={`flex-1 ${config.text} font-medium`}>{message}</p>
        <button
          onClick={onClose}
          className={`${config.text} hover:opacity-70 transition-opacity`}
          aria-label="Bildirimi kapat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
