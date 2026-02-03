'use client';

import { useState } from 'react';
import { User } from '@/types';
import BottomNavigation from '@/components/layout/BottomNavigation';
import OrderManagement from '@/components/dashboard/OrderManagement';

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

export default function GalleryPage() {
  const [currentUser] = useState<User>(defaultUser);

  const handleOrderSelect = (orderId: string) => {
    // Navigate to order details or handle order selection
    console.log('Selected order:', orderId);
    // You can implement navigation to order details page here
    // window.location.href = `/orders/${orderId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Quản lý đơn hàng</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20 p-4">
        <OrderManagement onOrderSelect={handleOrderSelect} />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation user={currentUser} currentPage="gallery" />
    </div>
  );
}