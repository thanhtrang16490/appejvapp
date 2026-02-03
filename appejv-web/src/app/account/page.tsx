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
};

export default function AccountPage() {
  const [currentUser] = useState<User>(defaultUser);
  const [customers] = useState<Customer[]>(mockCustomers);
  const [loading] = useState(false);

  const filteredCustomers = customers;
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
        <button 
          onClick={() => window.location.href = '/profile'}
          className="p-2"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>





      {/* Content */}
      <div className="flex-1 pb-20">

        <div className="mx-4 mb-4 bg-teal-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-teal-900 font-medium mb-1">
                Chủ động thêm thông tin khách hàng để không bỏ lỡ cơ hội.
              </p>
              <p className="text-teal-600 text-sm mb-2">
                Bạn đang có {potentialCount.toString().padStart(2, '0')}/20 khách hàng tiềm năng
              </p>
              <div className="w-full bg-white rounded-full h-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300"
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
            <span className="text-teal-900 font-medium">Thêm khách hàng mới</span>
            <svg className="w-5 h-5 text-teal-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Customer List */}
        <div className="px-4 space-y-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">Chưa có khách hàng nào trong danh sách!</p>
              <p className="text-gray-500 text-sm mb-6">Hãy thêm khách hàng mới để bắt đầu quản lý.</p>
              <button 
                onClick={() => window.location.href = '/contacts/create'}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg flex items-center mx-auto hover:bg-teal-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm khách hàng mới
              </button>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => window.location.href = `/customer/${customer.id}`}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Button 1: Order History */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to order history for this customer
                        console.log(`View order history for customer ${customer.id}`);
                        window.location.href = `/customer/${customer.id}?tab=orders`;
                      }}
                      className="p-2 rounded-full hover:bg-blue-50"
                    >
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </button>

                    {/* Button 2: Customer Info */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to customer details page
                        console.log(`View customer info for ${customer.id}`);
                        window.location.href = `/customer/${customer.id}`;
                      }}
                      className="p-2 rounded-full hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>

                    {/* Button 3: Quick Call */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Initiate phone call
                        window.location.href = `tel:${customer.phone}`;
                      }}
                      className="p-2 rounded-full hover:bg-green-50"
                    >
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
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