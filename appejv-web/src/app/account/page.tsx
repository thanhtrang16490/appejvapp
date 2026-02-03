'use client';

import { useState } from 'react';
import { User } from '@/types';
import BottomNavigation from '@/components/layout/BottomNavigation';

// Mock customer data
interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address: string;
  type: 'potential' | 'purchased';
}

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Nguyễn Văn C',
    phone: '0912345678',
    email: 'nguyenvanc@email.com',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    type: 'potential',
  },
  {
    id: 2,
    name: 'Trần Thị D',
    phone: '0923456789',
    address: '456 Đường XYZ, Quận 3, TP.HCM',
    type: 'potential',
  },
  {
    id: 3,
    name: 'Lê Văn E',
    phone: '0934567890',
    email: 'levane@email.com',
    address: '789 Đường DEF, Quận 5, TP.HCM',
    type: 'purchased',
  },
];

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
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ED1C24&color=fff',
};

type TabType = 'all' | 'potential' | 'purchased';

export default function AccountPage() {
  const [currentUser] = useState<User>(defaultUser);
  const [activeTab, setActiveTab] = useState<TabType>('potential');
  const [customers] = useState<Customer[]>(mockCustomers);
  const [loading] = useState(false);

  const getFilteredCustomers = () => {
    switch (activeTab) {
      case 'potential':
        return customers.filter(c => c.type === 'potential');
      case 'purchased':
        return customers.filter(c => c.type === 'purchased');
      case 'all':
      default:
        return customers;
    }
  };

  const filteredCustomers = getFilteredCustomers();
  const potentialCount = customers.filter(c => c.type === 'potential').length;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <button 
          onClick={() => window.location.href = '/'}
          className="p-2"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Khách hàng</h1>
        <button className="p-2">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-3 p-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setActiveTab('potential')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'potential'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Tiềm năng
        </button>
        <button
          onClick={() => setActiveTab('purchased')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'purchased'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Đã mua hàng
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        {/* Stats Card */}
        <div className="mx-4 mb-4 bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-red-900 font-medium mb-1">
                Chủ động thêm thông tin khách hàng để không bỏ lỡ cơ hội.
              </p>
              <p className="text-red-600 text-sm mb-2">
                Bạn đang có {potentialCount.toString().padStart(2, '0')}/20 khách hàng tiềm năng
              </p>
              <div className="w-full bg-white rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((potentialCount / 20) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <img
              src="/images/replace-holder.png"
              alt="Customer icon"
              className="w-16 h-16 ml-4"
            />
          </div>
          <button className="w-full flex items-center justify-between mt-4 pt-3 border-t-2 border-white">
            <span className="text-red-900 font-medium">Thêm khách hàng mới</span>
            <svg className="w-5 h-5 text-red-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Customer List */}
        <div className="px-4 space-y-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-2">Ô, hình như danh sách của bạn chưa có ai cả!</p>
              <p className="text-gray-500 text-sm mb-6">Hãy thêm liên hệ mới nhé.</p>
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center mx-auto">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tạo liên hệ mới
              </button>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                    {customer.email && (
                      <p className="text-xs text-gray-500">{customer.email}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-full">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-full">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </button>
                    {customer.type === 'potential' && (
                      <button className="p-2 rounded-full">
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation user={currentUser} currentPage="account" />
    </div>
  );
}