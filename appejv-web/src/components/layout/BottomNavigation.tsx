'use client';

import { useState } from 'react';
import { User } from '@/types';

interface BottomNavigationProps {
  user: User | null;
  currentPage?: string;
}

interface NavItem {
  id: string;
  name: string;
  icon: string;
  label: string;
  href: string;
}

export default function BottomNavigation({ user, currentPage = 'home' }: BottomNavigationProps) {
  const [activeTab, setActiveTab] = useState(currentPage);

  const isCustomer = user?.role_id === 3;
  const isPublic = user?.role_id === 4;

  // Navigation items for regular users (agents/admin)
  const regularNavItems: NavItem[] = [
    {
      id: 'home',
      name: 'index',
      icon: '/images/nav-icon-1.png',
      label: 'Trang chủ',
      href: '/',
    },
    {
      id: 'account',
      name: 'account',
      icon: '/images/nav-icon-2.png',
      label: 'Khách hàng',
      href: '/account',
    },
    {
      id: 'products',
      name: 'products',
      icon: '/images/nav-icon-3.png',
      label: 'Sản phẩm',
      href: '/products',
    },
    {
      id: 'stats',
      name: 'stats',
      icon: '/images/nav-icon-4.png',
      label: 'Thống kê',
      href: '/stats',
    },
    {
      id: 'gallery',
      name: 'gallery',
      icon: '/images/nav-icon-5.png',
      label: 'Thư viện',
      href: '/gallery',
    },
  ];

  // Navigation items for customers (role_id = 3)
  const customerNavItems: NavItem[] = [
    {
      id: 'products',
      name: 'products',
      icon: '/images/nav-icon-3.png',
      label: 'Sản phẩm',
      href: '/products',
    },
    {
      id: 'gallery',
      name: 'gallery',
      icon: '/images/nav-icon-5.png',
      label: 'Thư viện',
      href: '/gallery',
    },
    {
      id: 'profile',
      name: 'profile',
      icon: '/images/nav-icon-2.png',
      label: 'Hồ sơ',
      href: '/profile',
    },
  ];

  // Navigation items for public users (role_id = 4)
  const publicNavItems: NavItem[] = [
    {
      id: 'products',
      name: 'products',
      icon: '/images/nav-icon-3.png',
      label: 'Sản phẩm',
      href: '/products',
    },
    {
      id: 'gallery',
      name: 'gallery',
      icon: '/images/nav-icon-5.png',
      label: 'Thư viện',
      href: '/gallery',
    },
    {
      id: 'login',
      name: 'login',
      icon: '/images/nav-icon-2.png',
      label: 'Đăng nhập',
      href: '/login',
    },
  ];

  const navItems = isPublic ? publicNavItems : (isCustomer ? customerNavItems : regularNavItems);

  const handleTabClick = (tabId: string, href: string) => {
    setActiveTab(tabId);
    // Navigate to the page
    window.location.href = href;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-evenly items-center py-1 pb-safe">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id, item.href)}
              className="flex-1 flex flex-col items-center justify-center py-2 px-1"
            >
              <div
                className={`flex items-center justify-center p-3 rounded-full transition-colors ${
                  isActive ? 'bg-red-50' : ''
                }`}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className={`w-6 h-6 transition-all ${
                    isActive 
                      ? 'filter brightness-0 saturate-100' 
                      : 'filter brightness-0 saturate-100 opacity-60'
                  }`}
                  style={{
                    filter: isActive 
                      ? 'brightness(0) saturate(100%) invert(11%) sepia(100%) saturate(7426%) hue-rotate(357deg) brightness(95%) contrast(118%)'
                      : 'brightness(0) saturate(100%) invert(60%) sepia(8%) saturate(1126%) hue-rotate(201deg) brightness(91%) contrast(87%)'
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}