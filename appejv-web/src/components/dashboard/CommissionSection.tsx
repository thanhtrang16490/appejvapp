'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';

interface CommissionSectionProps {
  user: User | null;
}

interface Commission {
  id: number;
  created_at: string;
  paid: boolean;
  seller: number;
  money: number;
  sector_id: number;
  contract_id: number | null;
}

interface MonthlyCommission {
  month: number;
  commissions: Commission[];
}

export default function CommissionSection({ user }: CommissionSectionProps) {
  const [showCommission, setShowCommission] = useState(false);
  const [monthlyCommissions, setMonthlyCommissions] = useState<MonthlyCommission[]>([]);

  // Mock commission data
  const mockCommissions: Commission[] = [
    { id: 1, created_at: '2024-01-15T00:00:00Z', paid: true, seller: user?.id || 1, money: 2500000, sector_id: 1, contract_id: 1 },
    { id: 2, created_at: '2024-01-20T00:00:00Z', paid: true, seller: user?.id || 1, money: 1800000, sector_id: 1, contract_id: 2 },
    { id: 3, created_at: '2024-02-10T00:00:00Z', paid: false, seller: user?.id || 1, money: 3200000, sector_id: 2, contract_id: 3 },
    { id: 4, created_at: '2024-02-25T00:00:00Z', paid: true, seller: user?.id || 1, money: 1500000, sector_id: 1, contract_id: 4 },
  ];

  useEffect(() => {
    // Group commissions by month
    const grouped = mockCommissions.reduce((acc, commission) => {
      const date = new Date(commission.created_at);
      const month = date.getMonth() + 1; // 1-based month
      
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.commissions.push(commission);
      } else {
        acc.push({ month, commissions: [commission] });
      }
      
      return acc;
    }, [] as MonthlyCommission[]);

    setMonthlyCommissions(grouped.sort((a, b) => b.month - a.month));
  }, []);

  const totalCommission = user?.total_commission || mockCommissions.reduce((sum, c) => sum + c.money, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[month - 1];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Hoa hồng</h2>
        <button
          onClick={() => setShowCommission(!showCommission)}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          {showCommission ? 'Ẩn' : 'Hiển thị'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Commission */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Tổng hoa hồng</p>
              <p className="text-2xl font-bold">
                {showCommission ? formatCurrency(totalCommission) : '••••••••'}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-400 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* This Month Commission */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Tháng này</p>
              <p className="text-2xl font-bold">
                {showCommission ? formatCurrency(
                  monthlyCommissions.find(m => m.month === new Date().getMonth() + 1)
                    ?.commissions.reduce((sum, c) => sum + c.money, 0) || 0
                ) : '••••••••'}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-400 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Commission */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Chờ thanh toán</p>
              <p className="text-2xl font-bold">
                {showCommission ? formatCurrency(
                  mockCommissions.filter(c => !c.paid).reduce((sum, c) => sum + c.money, 0)
                ) : '••••••••'}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      {showCommission && monthlyCommissions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Chi tiết theo tháng</h3>
          <div className="space-y-3">
            {monthlyCommissions.map((monthData) => {
              const monthTotal = monthData.commissions.reduce((sum, c) => sum + c.money, 0);
              const paidCount = monthData.commissions.filter(c => c.paid).length;
              
              return (
                <div key={monthData.month} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{getMonthName(monthData.month)}</h4>
                      <p className="text-sm text-gray-600">
                        {monthData.commissions.length} giao dịch • {paidCount} đã thanh toán
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(monthTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}