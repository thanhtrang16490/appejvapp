'use client';

import { useState } from 'react';
import { User } from '@/types';

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
  address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam',
};

export default function TestNavigationPage() {
  const [currentUser] = useState<User>(defaultUser);

  const testPages = [
    { name: 'Trang chủ', path: '/', description: 'Dashboard chính' },
    { name: 'Khách hàng', path: '/account', description: 'Quản lý khách hàng - Back về trang chủ' },
    { name: 'Sản phẩm', path: '/products', description: 'Danh mục sản phẩm - Back về trang chủ' },
    { name: 'Chi tiết sản phẩm', path: '/product/1', description: 'Trang chi tiết sản phẩm - Back về /products' },
    { name: 'Thống kê', path: '/stats', description: 'Báo cáo hoa hồng - Back về trang chủ' },
    { name: 'Thư viện', path: '/gallery', description: 'Nội dung marketing - Không có nút back' },
    { name: 'Tạo báo giá', path: '/quotation', description: 'Quy trình báo giá - Back về trang chủ' },
    { name: 'Thông báo', path: '/notifications', description: 'Trung tâm thông báo - Back về trang chủ' },
    { name: 'Hồ sơ', path: '/profile', description: 'Thông tin cá nhân - Back về trang chủ' },
    { name: 'Đăng nhập', path: '/login', description: 'Trang đăng nhập - Không có nút back' },
    { name: 'Menu tổng quan', path: '/menu', description: 'Danh sách tất cả trang' },
    { name: 'Cộng đồng', path: '/community', description: 'Nhóm đại lý - Back về trang chủ' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
          <h1 className="text-xl font-semibold text-gray-900">Test Navigation</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            ✅ Cập nhật hoàn thành: Nút Back Navigation
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Trước:</strong> Tất cả nút back sử dụng <code>window.history.back()</code></p>
            <p>• <strong>Sau:</strong> Tất cả nút back điều hướng về trang chủ (<code>/</code>)</p>
            <p>• <strong>Giống mobile app:</strong> Back button luôn về trang chính thay vì browser history</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Danh sách trang để test</h3>
            <p className="text-sm text-gray-600 mt-1">Click vào từng trang để test nút back</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {testPages.map((page, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{page.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{page.description}</p>
                  </div>
                  <a
                    href={page.path}
                    className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                  >
                    Test →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">🧪 Hướng dẫn test:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Click vào nút &quot;Test&quot; của từng trang</li>
            <li>2. Trên trang đó, click nút back (←) ở header</li>
            <li>3. Kiểm tra xem có quay về trang chủ không</li>
            <li>4. Lặp lại với tất cả các trang</li>
          </ol>
        </div>

        {/* Status */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-green-900">Navigation đã được cập nhật!</h4>
              <p className="text-sm text-green-800">Tất cả nút back giờ hoạt động giống như mobile app</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}