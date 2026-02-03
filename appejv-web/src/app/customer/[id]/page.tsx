'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { User } from '@/types';

// Mock customer data
interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address: string;
  type: 'potential' | 'purchased';
  created_at: string;
  notes?: string;
}

interface Order {
  id: string;
  date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  items_count: number;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: 'cash' | 'transfer' | 'check';
  order_id: string;
  status: 'completed' | 'pending';
}

interface Debt {
  id: string;
  order_id: string;
  order_date: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  due_date: string;
  status: 'overdue' | 'due_soon' | 'current';
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Nguyễn Văn C',
    phone: '0912345678',
    email: 'nguyenvanc@email.com',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    type: 'purchased',
    created_at: '2024-01-15T00:00:00Z',
    notes: 'Khách hàng VIP, thường xuyên đặt hàng số lượng lớn'
  },
  {
    id: 2,
    name: 'Trần Thị D',
    phone: '0923456789',
    address: '456 Đường XYZ, Quận 3, TP.HCM',
    type: 'potential',
    created_at: '2024-02-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Lê Văn E',
    phone: '0934567890',
    email: 'levane@email.com',
    address: '789 Đường DEF, Quận 5, TP.HCM',
    type: 'purchased',
    created_at: '2024-01-20T00:00:00Z'
  }
];

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-02-03T10:30:00Z',
    total_amount: 15500000,
    status: 'delivered',
    items_count: 3
  },
  {
    id: 'ORD-002',
    date: '2024-01-28T14:15:00Z',
    total_amount: 8740000,
    status: 'delivered',
    items_count: 2
  },
  {
    id: 'ORD-003',
    date: '2024-01-20T09:20:00Z',
    total_amount: 25600000,
    status: 'delivered',
    items_count: 4
  }
];

const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    date: '2024-02-04T16:00:00Z',
    amount: 15500000,
    method: 'transfer',
    order_id: 'ORD-001',
    status: 'completed'
  },
  {
    id: 'PAY-002',
    date: '2024-01-29T10:30:00Z',
    amount: 8740000,
    method: 'cash',
    order_id: 'ORD-002',
    status: 'completed'
  },
  {
    id: 'PAY-003',
    date: '2024-01-22T14:15:00Z',
    amount: 20000000,
    method: 'transfer',
    order_id: 'ORD-003',
    status: 'completed'
  }
];

const mockDebts: Debt[] = [
  {
    id: 'DEBT-001',
    order_id: 'ORD-003',
    order_date: '2024-01-20T09:20:00Z',
    total_amount: 25600000,
    paid_amount: 20000000,
    remaining_amount: 5600000,
    due_date: '2024-02-20T00:00:00Z',
    status: 'current'
  }
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

type TabType = 'info' | 'orders' | 'payments' | 'debts';

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = parseInt(params.id as string);
  
  const [currentUser] = useState<User>(defaultUser);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const foundCustomer = mockCustomers.find(c => c.id === customerId);
    setCustomer(foundCustomer || null);
    setLoading(false);

    // Check for tab parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab') as TabType;
    if (tabParam && ['info', 'orders', 'payments', 'debts'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [customerId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'due_soon':
        return 'bg-orange-100 text-orange-800';
      case 'current':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string, type: string) => {
    if (type === 'order') {
      switch (status) {
        case 'pending': return 'Chờ xác nhận';
        case 'confirmed': return 'Đã xác nhận';
        case 'processing': return 'Đang xử lý';
        case 'delivered': return 'Đã giao';
        case 'cancelled': return 'Đã hủy';
        default: return 'Không xác định';
      }
    } else if (type === 'payment') {
      switch (status) {
        case 'completed': return 'Đã thanh toán';
        case 'pending': return 'Chờ thanh toán';
        default: return 'Không xác định';
      }
    } else if (type === 'debt') {
      switch (status) {
        case 'overdue': return 'Quá hạn';
        case 'due_soon': return 'Sắp đến hạn';
        case 'current': return 'Trong hạn';
        default: return 'Không xác định';
      }
    }
    return status;
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash': return 'Tiền mặt';
      case 'transfer': return 'Chuyển khoản';
      case 'check': return 'Séc';
      default: return method;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button 
            onClick={() => window.history.back()}
            className="p-2"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Chi tiết khách hàng</h1>
          <div className="w-10"></div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Không tìm thấy khách hàng</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <button 
          onClick={() => window.history.back()}
          className="p-2"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Chi tiết khách hàng</h1>
        <button 
          onClick={() => window.location.href = `tel:${customer.phone}`}
          className="p-2"
        >
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
      </div>

      {/* Customer Summary */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl font-bold text-teal-600">
              {customer.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
            <p className="text-gray-600">{customer.phone}</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
              customer.type === 'purchased' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {customer.type === 'purchased' ? 'Đã mua hàng' : 'Tiềm năng'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-4 bg-white border-b border-gray-200">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'info'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Thông tin
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'orders'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Đơn hàng
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'payments'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Thanh toán
        </button>
        <button
          onClick={() => setActiveTab('debts')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'debts'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Công nợ
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        {activeTab === 'info' && (
          <div className="p-4 space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Thông tin cơ bản</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tên khách hàng:</span>
                  <span className="font-medium text-gray-900">{customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số điện thoại:</span>
                  <span className="font-medium text-gray-900">{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900">{customer.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Địa chỉ:</span>
                  <span className="font-medium text-gray-900 text-right flex-1 ml-4">{customer.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="font-medium text-gray-900">{formatDate(customer.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loại khách hàng:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.type === 'purchased' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {customer.type === 'purchased' ? 'Đã mua hàng' : 'Tiềm năng'}
                  </span>
                </div>
              </div>
            </div>

            {customer.notes && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Ghi chú</h3>
                <p className="text-gray-700">{customer.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="p-4 space-y-3">
            {mockOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-600">Chưa có đơn hàng nào</p>
              </div>
            ) : (
              mockOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">#{order.id}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status, 'order')}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày đặt:</span>
                      <span className="text-gray-900">{formatDate(order.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số sản phẩm:</span>
                      <span className="text-gray-900">{order.items_count} sản phẩm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="font-semibold text-teal-600">{formatCurrency(order.total_amount)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="p-4 space-y-3">
            {mockPayments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <p className="text-gray-600">Chưa có thanh toán nào</p>
              </div>
            ) : (
              mockPayments.map((payment) => (
                <div key={payment.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">#{payment.id}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusText(payment.status, 'payment')}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày thanh toán:</span>
                      <span className="text-gray-900">{formatDate(payment.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Đơn hàng:</span>
                      <span className="text-gray-900">#{payment.order_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phương thức:</span>
                      <span className="text-gray-900">{getPaymentMethodText(payment.method)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(payment.amount)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'debts' && (
          <div className="p-4 space-y-3">
            {mockDebts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600">Không có công nợ</p>
              </div>
            ) : (
              mockDebts.map((debt) => (
                <div key={debt.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">#{debt.order_id}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(debt.status)}`}>
                      {getStatusText(debt.status, 'debt')}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày đặt hàng:</span>
                      <span className="text-gray-900">{formatDate(debt.order_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hạn thanh toán:</span>
                      <span className="text-gray-900">{formatDate(debt.due_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="text-gray-900">{formatCurrency(debt.total_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Đã thanh toán:</span>
                      <span className="text-green-600">{formatCurrency(debt.paid_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Còn lại:</span>
                      <span className="font-semibold text-teal-600">{formatCurrency(debt.remaining_amount)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation user={currentUser} currentPage="account" />
    </div>
  );
}