'use client';

import { useState, useCallback } from 'react';
import { User } from '@/types';
import BottomNavigation from '@/components/layout/BottomNavigation';
import RoleSwitcher from '@/components/demo/RoleSwitcher';

// Default user
const defaultUser: User = {
  id: 1,
  role_id: 1,
  email: 'admin@appejv.vn',
  password: '123456',
  created_at: '2024-01-01T00:00:00Z',
  commission_rate: 10,
  name: 'Admin User',
  phone: '0123456789',
  parent_id: null,
  total_commission: 1000000,
  role: { name: 'admin', description: 'Administrator', id: 1 },
  address: '123 Đường ABC, Quận 1, TP.HCM',
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ED1C24&color=fff',
};

interface QuotationStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export default function QuotationPage() {
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [customerId, setCustomerId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerExists, setCustomerExists] = useState<boolean | null>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const steps: QuotationStep[] = [
    {
      id: 1,
      title: 'Thông tin khách hàng',
      description: 'Nhập mã khách hàng hoặc tạo mới',
      completed: false,
      current: currentStep === 1,
    },
    {
      id: 2,
      title: 'Chọn sản phẩm',
      description: 'Lựa chọn sản phẩm cho báo giá',
      completed: false,
      current: currentStep === 2,
    },
    {
      id: 3,
      title: 'Thông tin cơ bản',
      description: 'Điền thông tin chi tiết',
      completed: false,
      current: currentStep === 3,
    },
    {
      id: 4,
      title: 'Chi tiết báo giá',
      description: 'Xem lại và chỉnh sửa',
      completed: false,
      current: currentStep === 4,
    },
    {
      id: 5,
      title: 'Hoàn thành',
      description: 'Xác nhận và gửi báo giá',
      completed: false,
      current: currentStep === 5,
    },
  ];

  const handleUserChange = (user: User) => {
    setCurrentUser(user);
  };

  // Debounced function to check customer existence
  const checkCustomerExistence = useCallback(
    debounce(async (id: string) => {
      if (!id || id.trim() === '') {
        setIsLoading(false);
        setIsNewCustomer(false);
        setCustomerExists(null);
        setCustomerData(null);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setCustomerExists(null);
      setCustomerData(null);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock customer data
        const mockCustomers = [
          { id: 'KH001', name: 'Nguyễn Văn A', phone: '0123456789', address: '123 ABC Street' },
          { id: 'KH002', name: 'Trần Thị B', phone: '0987654321', address: '456 XYZ Street' },
        ];

        const customer = mockCustomers.find(c => c.id === id.trim().toUpperCase());
        
        if (customer) {
          setCustomerExists(true);
          setIsNewCustomer(false);
          setCustomerData(customer);
        } else {
          setCustomerExists(false);
          setIsNewCustomer(true);
          setCustomerData(null);
        }
      } catch (err: any) {
        console.error('API call failed:', err);
        setError('Không thể kiểm tra mã khách hàng. Vui lòng thử lại.');
        setIsNewCustomer(false);
        setCustomerExists(null);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const handleCustomerIdChange = (text: string) => {
    const upperCaseText = text.toUpperCase();
    setCustomerId(upperCaseText);
    checkCustomerExistence(upperCaseText);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateQuotation = () => {
    if (isLoading || error) {
      return;
    }
    
    alert('Tạo báo giá thành công!');
    // Reset form
    setCustomerId('');
    setPhoneNumber('');
    setCurrentStep(1);
    setCustomerData(null);
    setCustomerExists(null);
    setIsNewCustomer(false);
  };

  // Simple debounce function
  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Role Switcher */}
      <RoleSwitcher currentUser={currentUser} onUserChange={handleUserChange} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="p-2"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Tạo báo giá mới</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : step.current 
                    ? 'bg-red-600 border-red-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {step.completed ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  step.completed ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-900">
            {steps.find(s => s.current)?.title}
          </p>
          <p className="text-xs text-gray-500">
            {steps.find(s => s.current)?.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-20">
        {currentStep === 1 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Thông tin khách hàng
            </h2>

            {/* Customer ID Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã khách hàng
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => handleCustomerIdChange(e.target.value)}
                  placeholder="Nhập mã khách hàng (VD: KH001)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                  </div>
                )}
              </div>
              
              {/* Status Messages */}
              {error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              {customerExists === true && customerData && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">✓ Khách hàng đã tồn tại</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Tên:</strong> {customerData.name}</p>
                    <p><strong>SĐT:</strong> {customerData.phone}</p>
                    <p><strong>Địa chỉ:</strong> {customerData.address}</p>
                  </div>
                </div>
              )}
              
              {customerExists === false && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">ℹ Khách hàng mới</p>
                  <p className="text-sm text-gray-600">Sẽ tạo thông tin khách hàng mới trong bước tiếp theo</p>
                </div>
              )}
            </div>

            {/* Phone Number Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập số điện thoại"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={handleNextStep}
                disabled={!customerId || isLoading || !!error}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Chọn sản phẩm
            </h2>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 text-red-600" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Gói thức ăn heo 3 tháng</h3>
                    <p className="text-sm text-gray-500">Phù hợp cho trang trại nhỏ</p>
                    <p className="text-lg font-semibold text-red-600">4,500,000 VNĐ</p>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 text-red-600" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Gói thức ăn gà 5 tháng</h3>
                    <p className="text-sm text-gray-500">Phù hợp cho trang trại vừa</p>
                    <p className="text-lg font-semibold text-red-600">6,500,000 VNĐ</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handlePrevStep}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Quay lại
              </button>
              <button
                onClick={handleNextStep}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Thông tin cơ bản
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên khách hàng
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên khách hàng"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ lắp đặt
                </label>
                <textarea
                  rows={3}
                  placeholder="Nhập địa chỉ lắp đặt"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  rows={3}
                  placeholder="Nhập ghi chú (tùy chọn)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handlePrevStep}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Quay lại
              </button>
              <button
                onClick={handleNextStep}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Chi tiết báo giá
            </h2>
            
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-medium text-gray-900 mb-2">Thông tin khách hàng</h3>
                <p className="text-sm text-gray-600">Mã KH: {customerId}</p>
                <p className="text-sm text-gray-600">SĐT: {phoneNumber}</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-medium text-gray-900 mb-2">Sản phẩm đã chọn</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gói thức ăn heo 3 tháng</span>
                    <span className="text-sm font-medium">4,500,000 VNĐ</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                  <span className="text-xl font-bold text-red-600">150,000,000 VNĐ</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handlePrevStep}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Quay lại
              </button>
              <button
                onClick={handleNextStep}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hoàn thành
              </button>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Báo giá đã được tạo thành công!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Báo giá đã được lưu và sẵn sàng để gửi cho khách hàng.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Về trang chủ
              </button>
              <button
                onClick={handleCreateQuotation}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Tạo báo giá mới
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation user={currentUser} currentPage="quotation" />
    </div>
  );
}