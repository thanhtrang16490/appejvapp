'use client';

import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface CustomToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onDismiss: () => void;
}

export function CustomToast({ message, type, onDismiss }: CustomToastProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className={`flex items-center p-4 rounded-lg border shadow-lg ${getBgColor()}`}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className={`ml-3 flex-1 ${getTextColor()}`}>
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className={`ml-4 flex-shrink-0 rounded-md p-1.5 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 ${getTextColor()}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Helper functions to show custom toasts
export const showCustomToast = {
  success: (message: string) => {
    toast.custom((t) => (
      <CustomToast
        message={message}
        type="success"
        onDismiss={() => toast.dismiss(t.id)}
      />
    ), {
      duration: 3000,
    });
  },
  
  error: (message: string) => {
    toast.custom((t) => (
      <CustomToast
        message={message}
        type="error"
        onDismiss={() => toast.dismiss(t.id)}
      />
    ), {
      duration: 5000,
    });
  },
  
  warning: (message: string) => {
    toast.custom((t) => (
      <CustomToast
        message={message}
        type="warning"
        onDismiss={() => toast.dismiss(t.id)}
      />
    ), {
      duration: 4000,
    });
  },
  
  info: (message: string) => {
    toast.custom((t) => (
      <CustomToast
        message={message}
        type="info"
        onDismiss={() => toast.dismiss(t.id)}
      />
    ), {
      duration: 4000,
    });
  },
};