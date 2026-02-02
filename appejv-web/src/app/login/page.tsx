'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserNotFoundModal, setShowUserNotFoundModal] = useState(false);
  const [showWrongPasswordModal, setShowWrongPasswordModal] = useState(false);

  // Mock users data (same as mobile app)
  const mockUsers = [
    {
      id: 1,
      phone: '0123456789',
      password: 'appejv123',
      name: 'Admin User',
      role_id: 1,
    },
    {
      id: 2,
      phone: '0987654321',
      password: 'appejv123',
      name: 'Nguyễn Văn A',
      role_id: 2,
    },
    {
      id: 3,
      phone: '0901234567',
      password: 'appejv123',
      name: 'Trần Thị B',
      role_id: 3,
    },
  ];

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      alert('Vui lòng nhập số điện thoại và mật khẩu');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^[0-9\s]{10,11}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert('Số điện thoại không hợp lệ');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Normalize phone number for search
      const normalizedPhone = phoneNumber.replace(/\s+/g, '').trim();

      // Find matching user
      const user = mockUsers.find(u => {
        const userPhone = u.phone.replace(/\s+/g, '').trim();
        return userPhone === normalizedPhone && u.password === password;
      });

      if (user) {
        // Login successful
        console.log(`Đăng nhập thành công với tài khoản: ${user.name}`);
        // Store user data in localStorage
        localStorage.setItem('appejv_user', JSON.stringify(user));
        router.push('/');
      } else {
        // Check if phone number exists
        const phoneExists = mockUsers.some(u => {
          const userPhone = u.phone.replace(/\s+/g, '').trim();
          return userPhone === normalizedPhone;
        });

        if (phoneExists) {
          // Phone exists but wrong password
          setShowWrongPasswordModal(true);
        } else {
          // Phone doesn't exist
          setShowUserNotFoundModal(true);
        }
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      alert('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupportCall = () => {
    window.open('tel:0977879291', '_self');
  };

  const handleViewWithoutLogin = () => {
    router.push('/gallery');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/replace-holder.png')",
        backgroundColor: '#1a1a2e'
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-black bg-opacity-60 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6 text-left">
            Chào mừng đến với Appejv
          </h2>

          {/* Phone Number Input */}
          <div className="mb-4">
            <div className="relative flex items-center bg-white rounded-md">
              <div className="p-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="tel"
                placeholder="Số điện thoại"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 p-3 pl-0 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <div className="relative flex items-center bg-white rounded-md">
              <div className="p-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 p-3 pl-0 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="p-3"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isPasswordVisible ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Login Button Row */}
          <div className="flex space-x-3 mb-4">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : (
                'Đăng nhập'
              )}
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-12 h-12 bg-white bg-opacity-20 rounded-md flex items-center justify-center hover:bg-opacity-30"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-center mb-4">
            <button
              onClick={() => setShowWrongPasswordModal(true)}
              className="text-gray-300 text-sm hover:text-white"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* View Without Login */}
          <div className="text-center">
            <button
              onClick={handleViewWithoutLogin}
              className="text-gray-300 text-sm underline hover:text-white"
            >
              Xem không cần đăng nhập
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white text-xs">
            © Appejv Agent được phát triển bởi Appejv Co., Ltd.
          </p>
        </div>
      </div>

      {/* User Not Found Modal */}
      {showUserNotFoundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowUserNotFoundModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-left">
              Tên đăng nhập không tồn tại
            </h3>

            <p className="text-gray-600 mb-6 text-left">
              Vui lòng kiểm tra lại hoặc <span className="text-blue-600 font-semibold">Liên hệ Hỗ trợ</span> để{' '}
              <span className="text-blue-600 font-semibold">Đăng ký tài khoản</span> mới.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={handleSupportCall}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50"
              >
                Liên hệ Hỗ trợ
              </button>
              <button
                onClick={() => setShowUserNotFoundModal(false)}
                className="bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wrong Password Modal */}
      {showWrongPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowWrongPasswordModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-left">
              Mật khẩu không chính xác
            </h3>

            <p className="text-gray-600 mb-6 text-left">
              Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ nếu bạn không nhớ mật khẩu.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={handleSupportCall}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50"
              >
                Liên hệ Hỗ trợ
              </button>
              <button
                onClick={() => {
                  setShowWrongPasswordModal(false);
                  setPassword('appejv123');
                }}
                className="bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}