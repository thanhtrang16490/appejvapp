import toast from 'react-hot-toast';

export const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  const showLoading = (message: string) => {
    return toast.loading(message);
  };

  const showInfo = (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#fff',
      },
    });
  };

  const showWarning = (message: string) => {
    toast(message, {
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#fff',
      },
    });
  };

  const dismiss = (toastId?: string) => {
    toast.dismiss(toastId);
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  // Promise-based toast for async operations
  const promise = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  };

  return {
    success: showSuccess,
    error: showError,
    loading: showLoading,
    info: showInfo,
    warning: showWarning,
    dismiss,
    dismissAll,
    promise,
  };
};

// Export individual functions for direct use
export const toast_success = (message: string) => toast.success(message);
export const toast_error = (message: string) => toast.error(message);
export const toast_loading = (message: string) => toast.loading(message);
export const toast_info = (message: string) => toast(message, {
  icon: 'ℹ️',
  style: {
    background: '#3B82F6',
    color: '#fff',
  },
});
export const toast_warning = (message: string) => toast(message, {
  icon: '⚠️',
  style: {
    background: '#F59E0B',
    color: '#fff',
  },
});

export default useToast;