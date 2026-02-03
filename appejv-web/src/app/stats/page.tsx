'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import BottomNavigation from '@/components/layout/BottomNavigation';

interface RevenueData {
  id: number;
  revenue_amount: number;
  commission_amount: number;
  commission_rate: number;
  period_month: number;
  period_year: number;
  status: string;
  order: {
    id: number;
    order_code: string;
    customer_name: string;
    total_amount: number;
    order_date: string;
  };
}

interface OrderSummary {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  delivered_orders: number;
}

// Mock data
const mockRevenueData: RevenueData[] = [
  {
    id: 1,
    revenue_amount: 15000000,
    commission_amount: 750000,
    commission_rate: 5,
    period_month: 12,
    period_year: 2024,
    status: 'recorded',
    order: {
      id: 1,
      order_code: 'ORD-001',
      customer_name: 'Trại chăn nuôi Hòa Bình',
      total_amount: 15000000,
      order_date: '2024-12-01'
    }
  },
  {
    id: 2,
    revenue_amount: 8500000,
    commission_amount: 425000,
    commission_rate: 5,
    period_month: 12,
    period_year: 2024,
    status: 'recorded',
    order: {
      id: 2,
      order_code: 'ORD-002',
      customer_name: 'Trang trại gia cầm Minh Phát',
      total_amount: 8500000,
      order_date: '2024-12-05'
    }
  },
  {
    id: 3,
    revenue_amount: 12000000,
    commission_amount: 600000,
    commission_rate: 5,
    period_month: 11,
    period_year: 2024,
    status: 'recorded',
    order: {
      id: 3,
      order_code: 'ORD-003',
      customer_name: 'Hợp tác xã chăn nuôi Thành Đạt',
      total_amount: 12000000,
      order_date: '2024-11-20'
    }
  },
  {
    id: 4,
    revenue_amount: 6800000,
    commission_amount: 340000,
    commission_rate: 5,
    period_month: 11,
    period_year: 2024,
    status: 'recorded',
    order: {
      id: 4,
      order_code: 'ORD-004',
      customer_name: 'Trang trại lợn sạch Phú Thọ',
      total_amount: 6800000,
      order_date: '2024-11-15'
    }
  }
];

const mockOrderSummary: OrderSummary = {
  total_orders: 25,
  total_revenue: 125000000,
  pending_orders: 3,
  delivered_orders: 22
};

export default function StatsPage() {
  const { authState } = useAuth();
  const toast = useToast();
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    total_orders: 0,
    total_revenue: 0,
    pending_orders: 0,
    delivered_orders: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const currentUser = authState.user;

  useEffect(() => {
    if (currentUser) {
      fetchRevenueData();
      fetchOrderSummary();
    }
  }, [currentUser, selectedPeriod]);

  const fetchRevenueData = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock data by selected period
      const filteredData = mockRevenueData.filter(item => 
        item.period_month === selectedPeriod.month && 
        item.period_year === selectedPeriod.year
      );
      
      setRevenueData(filteredData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      toast.error('Không thể tải dữ liệu doanh thu');
    }
  };

  const fetchOrderSummary = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setOrderSummary(mockOrderSummary);
    } catch (error) {
      console.error('Error fetching order summary:', error);
      toast.error('Không thể tải tổng quan đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  // Calculate current period stats
  const currentPeriodRevenue = revenueData.reduce((sum, item) => sum + parseFloat(item.revenue_amount.toString()), 0);
  const currentPeriodCommission = revenueData.reduce((sum, item) => sum + parseFloat(item.commission_amount?.toString() || '0'), 0);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-semibold text-gray-900">Thống kê doanh thu</h1>
          <button 
            onClick={() => window.location.href = '/orders'}
            className="p-2"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod.month}
            onChange={(e) => setSelectedPeriod(prev => ({ ...prev, month: parseInt(e.target.value) }))}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
            ))}
          </select>
          <select
            value={selectedPeriod.year}
            onChange={(e) => setSelectedPeriod(prev => ({ ...prev, year: parseInt(e.target.value) }))}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        {/* Stats Cards */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Tổng đơn hàng</p>
                  <p className="text-lg font-bold text-gray-900">{orderSummary.total_orders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Tổng doanh thu</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(orderSummary.total_revenue)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Đang xử lý</p>
                  <p className="text-lg font-bold text-gray-900">{orderSummary.pending_orders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Đã giao</p>
                  <p className="text-lg font-bold text-gray-900">{orderSummary.delivered_orders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Period Stats */}
          {currentUser.role_id === 2 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Doanh thu kỳ này</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(currentPeriodRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Hoa hồng kỳ này</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(currentPeriodCommission)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Revenue History */}
        <div className="mx-4 mt-4 bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Lịch sử đơn hàng</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            ) : revenueData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Chưa có dữ liệu doanh thu trong kỳ này</p>
              </div>
            ) : (
              revenueData.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.order.order_code}</p>
                      <p className="text-sm text-gray-600">{item.order.customer_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.order.order_date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(item.revenue_amount)}</p>
                      {currentUser.role_id === 2 && item.commission_amount && (
                        <p className="text-sm text-green-600">
                          Hoa hồng: {formatCurrency(item.commission_amount)}
                        </p>
                      )}
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === 'recorded' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status === 'recorded' ? 'Đã ghi nhận' : 'Chờ xử lý'}
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