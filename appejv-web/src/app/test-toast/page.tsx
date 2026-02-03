'use client';

import { useToast } from '@/hooks/useToast';
import { showCustomToast } from '@/components/ui/Toast';

export default function TestToastPage() {
  const toast = useToast();

  const handlePromiseToast = () => {
    const mockPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve('Thành công!');
        } else {
          reject(new Error('Có lỗi xảy ra!'));
        }
      }, 2000);
    });

    toast.promise(mockPromise, {
      loading: 'Đang xử lý...',
      success: 'Hoàn thành thành công!',
      error: 'Xử lý thất bại!',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Toast Notifications</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Toasts</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => toast.success('Đây là thông báo thành công!')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Success Toast
            </button>
            
            <button
              onClick={() => toast.error('Đây là thông báo lỗi!')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Error Toast
            </button>
            
            <button
              onClick={() => toast.warning('Đây là thông báo cảnh báo!')}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Warning Toast
            </button>
            
            <button
              onClick={() => toast.info('Đây là thông báo thông tin!')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Info Toast
            </button>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Toasts</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => showCustomToast.success('Custom success toast với UI đẹp hơn!')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Custom Success
              </button>
              
              <button
                onClick={() => showCustomToast.error('Custom error toast với UI đẹp hơn!')}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Custom Error
              </button>
              
              <button
                onClick={() => showCustomToast.warning('Custom warning toast với UI đẹp hơn!')}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Custom Warning
              </button>
              
              <button
                onClick={() => showCustomToast.info('Custom info toast với UI đẹp hơn!')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Custom Info
              </button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Advanced Features</h3>
            
            <div className="space-y-2">
              <button
                onClick={handlePromiseToast}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Promise Toast (Loading → Success/Error)
              </button>
              
              <button
                onClick={() => {
                  const loadingToast = toast.loading('Đang xử lý...');
                  setTimeout(() => {
                    toast.dismiss(loadingToast);
                    toast.success('Hoàn thành!');
                  }, 2000);
                }}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Manual Loading Control
              </button>
              
              <button
                onClick={() => toast.dismissAll()}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Dismiss All Toasts
              </button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Real-world Examples</h3>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  toast.loading('Đang đăng nhập...');
                  setTimeout(() => {
                    toast.dismissAll();
                    toast.success('Chào mừng Admin User! Đăng nhập thành công.');
                  }, 1500);
                }}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Simulate Login Success
              </button>
              
              <button
                onClick={() => {
                  toast.loading('Đang tải sản phẩm...');
                  setTimeout(() => {
                    toast.dismissAll();
                    toast.success('Đã tải 41 sản phẩm thành công');
                  }, 1000);
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Simulate Data Loading
              </button>
              
              <button
                onClick={() => {
                  toast.error('Không thể kết nối đến server');
                  setTimeout(() => {
                    toast.warning('Đang sử dụng dữ liệu offline');
                  }, 1000);
                }}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Simulate Network Error
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}