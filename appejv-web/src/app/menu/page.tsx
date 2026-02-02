'use client';

import { useState } from 'react';
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

interface MenuItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  bgColor: string;
  status: 'completed' | 'new' | 'missing';
  category: 'main' | 'business' | 'profile' | 'auth';
}

export default function MenuPage() {
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);

  const handleUserChange = (user: User) => {
    setCurrentUser(user);
  };

  const menuItems: MenuItem[] = [
    // Main Navigation
    {
      id: 'home',
      title: 'Trang chủ',
      description: 'Dashboard với thống kê và thông tin tổng quan',
      href: '/',
      icon: '🏠',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      status: 'completed',
      category: 'main',
    },
    {
      id: 'account',
      title: 'Khách hàng',
      description: 'Quản lý danh sách khách hàng tiềm năng',
      href: '/account',
      icon: '👥',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      status: 'completed',
      category: 'main',
    },
    {
      id: 'products',
      title: 'Sản phẩm',
      description: 'Danh mục sản phẩm và dịch vụ',
      href: '/products',
      icon: '📦',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      status: 'completed',
      category: 'main',
    },
    {
      id: 'stats',
      title: 'Thống kê',
      description: 'Báo cáo hoa hồng và hiệu suất bán hàng',
      href: '/stats',
      icon: '📊',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      status: 'completed',
      category: 'main',
    },
    {
      id: 'gallery',
      title: 'Thư viện',
      description: 'Nội dung marketing và tài liệu bán hàng',
      href: '/gallery',
      icon: '🖼️',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      status: 'completed',
      category: 'main',
    },

    // Business Features
    {
      id: 'product-detail',
      title: 'Chi tiết sản phẩm',
      description: 'Trang chi tiết sản phẩm với thông tin đầy đủ',
      href: '/product/1',
      icon: '📋',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      status: 'new',
      category: 'business',
    },
    {
      id: 'quotation',
      title: 'Tạo báo giá',
      description: 'Quy trình tạo báo giá cho khách hàng',
      href: '/quotation',
      icon: '📋',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      status: 'new',
      category: 'business',
    },
    {
      id: 'notifications',
      title: 'Thông báo',
      description: 'Trung tâm thông báo và cập nhật',
      href: '/notifications',
      icon: '🔔',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      status: 'new',
      category: 'business',
    },

    // Profile & Settings
    {
      id: 'profile',
      title: 'Hồ sơ cá nhân',
      description: 'Thông tin tài khoản và cài đặt',
      href: '/profile',
      icon: '👤',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      status: 'new',
      category: 'profile',
    },

    // Authentication
    {
      id: 'login',
      title: 'Đăng nhập',
      description: 'Trang đăng nhập hệ thống',
      href: '/login',
      icon: '🔐',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      status: 'new',
      category: 'auth',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✓ Hoàn thành
          </span>
        );
      case 'new':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            ✨ Mới
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            ⚠️ Chưa có
          </span>
        );
      default:
        return null;
    }
  };

  const categories = [
    { id: 'main', title: 'Trang chính', description: 'Các trang điều hướng chính' },
    { id: 'business', title: 'Tính năng kinh doanh', description: 'Công cụ hỗ trợ bán hàng' },
    { id: 'profile', title: 'Hồ sơ & Cài đặt', description: 'Quản lý tài khoản' },
    { id: 'auth', title: 'Xác thực', description: 'Đăng nhập và bảo mật' },
  ];

  const completedCount = menuItems.filter(item => item.status === 'completed').length;
  const newCount = menuItems.filter(item => item.status === 'new').length;
  const totalCount = menuItems.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Role Switcher */}
      <RoleSwitcher currentUser={currentUser} onUserChange={handleUserChange} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Appejv Web App - Tổng quan
          </h1>
          <p className="text-gray-600 mb-4">
            Danh sách tất cả các trang và tính năng đã được triển khai
          </p>
          
          {/* Progress Stats */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">{completedCount} hoàn thành</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">{newCount} mới thêm</span>
            </div>
            <div className="text-gray-500">
              Tổng: {totalCount} trang
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-20">
        {categories.map((category) => {
          const categoryItems = menuItems.filter(item => item.category === category.id);
          
          return (
            <div key={category.id} className="mb-8">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {category.title}
                </h2>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="block bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center text-2xl`}>
                        {item.icon}
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-red-600 font-medium">
                      Xem trang
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">🎉 Hoàn thành Web App</h3>
          <p className="text-red-100 mb-4">
            Đã triển khai thành công {totalCount} trang web dựa trên mobile app, 
            bao gồm tất cả các tính năng chính và giao diện giống hệt mobile.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Responsive design</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Role-based navigation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Mock data integration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation user={currentUser} currentPage="menu" />
    </div>
  );
}