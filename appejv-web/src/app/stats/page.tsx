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

interface Commission {
  id: number;
  month: number;
  amount: number;
  paid: boolean;
  contractName: string;
}

const mockCommissions: Commission[] = [
  { id: 1, month: 1, amount: 2500000, paid: true, contractName: 'Hợp đồng #001' },
  { id: 2, month: 1, amount: 1800000, paid: true, contractName: 'Hợp đồng #002' },
  { id: 3, month: 2, amount: 3200000, paid: false, contractName: 'Hợp đồng #003' },
  { id: 4, month: 2, amount: 1500000, paid: true, contractName: 'Hợp đồng #004' },
  { id: 5, month: 3, amount: 2800000, paid: false, contractName: 'Hợp đồng #005' },
];

export default function StatsPage() {
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [commissions] = useState<Commission[]>(mockCommissions);
  const [loading] = useState(false);

  const handleUserChange = (user: User) => {
    setCurrentUser(user);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  const currentMonth = new Date().getMonth() + 1;

  // Calculate stats
  const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0);
  const paidCommissions = commissions.filter(c => c.paid).reduce((sum, c) => sum + c.amount, 0);
  const pendingCommissions = commissions.filter(c => !c.paid).reduce((sum, c) => sum + c.amount, 0);
  const currentMonthCommissions = commissions.filter(c => c.month === currentMonth).reduce((sum, c) => sum + c.amount, 0);

  // Monthly data for chart
  const monthlyData = months.map((month, index) => {
    const monthCommissions = commissions.filter(c => c.month === index + 1);
    const total = monthCommissions.reduce((sum, c) => sum + c.amount, 0);
    return { month, amount: total };
  });

  const maxAmount = Math.max(...monthlyData.map(d => d.amount));

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
          <h1 className="text-xl font-semibold text-gray-900">Thống kê</h1>
          <button className="p-2">
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        {/* Stats Cards */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Tổng hoa hồng</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(totalCommissions)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Tháng này</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(currentMonthCommissions)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Đã thanh toán</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(paidCommissions)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Chờ thanh toán</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(pendingCommissions)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mx-4 bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ hoa hồng theo tháng</h3>
          <div className="flex items-end justify-between h-40 space-x-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-red-600 rounded-t transition-all duration-300"
                  style={{ 
                    height: maxAmount > 0 ? `${(data.amount / maxAmount) * 120}px` : '2px',
                    minHeight: '2px'
                  }}
                ></div>
                <p className="text-xs text-gray-600 mt-2">{data.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Commission History */}
        <div className="mx-4 mt-4 bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Lịch sử hoa hồng</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : commissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Chưa có dữ liệu hoa hồng</p>
              </div>
            ) : (
              commissions.map((commission) => (
                <div key={commission.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{commission.contractName}</p>
                      <p className="text-sm text-gray-600">Tháng {commission.month}/2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(commission.amount)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        commission.paid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {commission.paid ? 'Đã thanh toán' : 'Chờ thanh toán'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation user={currentUser} currentPage="stats" />
    </div>
  );
}