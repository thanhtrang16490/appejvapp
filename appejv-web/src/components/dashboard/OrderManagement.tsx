'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  notes?: string;
}

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';

interface OrderManagementProps {
  orders?: Order[];
  onOrderSelect?: (orderId: string) => void;
  loading?: boolean;
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customer_name: 'Trại chăn nuôi Hòa Bình',
    customer_phone: '0912345678',
    customer_address: '123 Đường ABC, Quận 1, TP.HCM',
    status: 'confirmed',
    total_amount: 15500000,
    created_at: '2024-02-03T10:30:00Z',
    updated_at: '2024-02-03T11:00:00Z',
    items: [
      {
        id: 'ITEM-001',
        product_id: '1',
        product_name: 'HH cho lợn sữa (7 ngày tuổi - 10kg)',
        quantity: 100,
        unit_price: 27100,
        total_price: 2710000
      },
      {
        id: 'ITEM-002',
        product_id: '2',
        product_name: 'HH cho lợn con tập ăn (10 ngày tuổi - 20kg)',
        quantity: 200,
        unit_price: 18090,
        total_price: 3618000
      }
    ],
    notes: 'Giao hàng trước 8h sáng'
  },
  {
    id: 'ORD-002',
    customer_name: 'Trang trại gia cầm Minh Phát',
    customer_phone: '0987654321',
    customer_address: '456 Đường XYZ, Quận 3, TP.HCM',
    status: 'pending',
    total_amount: 8740000,
    created_at: '2024-02-03T14:15:00Z',
    updated_at: '2024-02-03T14:15:00Z',
    items: [
      {
        id: 'ITEM-003',
        product_id: '3',
        product_name: 'HH cho gà công nghiệp 01 - 12 ngày tuổi',
        quantity: 150,
        unit_price: 13480,
        total_price: 2022000
      }
    ]
  },
  {
    id: 'ORD-003',
    customer_name: 'Hợp tác xã chăn nuôi Thành Đạt',
    customer_phone: '0901234567',
    customer_address: '789 Đường DEF, Quận 5, TP.HCM',
    status: 'delivered',
    total_amount: 25600000,
    created_at: '2024-02-02T09:20:00Z',
    updated_at: '2024-02-02T16:45:00Z',
    items: [
      {
        id: 'ITEM-004',
        product_id: '1',
        product_name: 'HH cho lợn sữa (7 ngày tuổi - 10kg)',
        quantity: 200,
        unit_price: 27100,
        total_price: 5420000
      }
    ]
  }
];

export default function OrderManagement({ 
  orders = mockOrders, 
  onOrderSelect,
  loading = false 
}: OrderManagementProps) {
  const { authState } = useAuth();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const handleOrderClick = (order: Order) => {
    if (onOrderSelect) {
      onOrderSelect(order.id);
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-600">Theo dõi và quản lý các đơn hàng của khách hàng</p>
        </div>
        <button
          onClick={() => window.location.href = '/orders/create'}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Tạo đơn hàng mới
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filterStatus === 'all'
              ? 'bg-teal-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          Tất cả ({orders.length})
        </button>
        {(['pending', 'confirmed', 'processing', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => {
          const count = orders.filter(order => order.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {getStatusText(status)} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn hàng nào</h3>
          <p className="text-gray-500 mb-4">
            {filterStatus === 'all' 
              ? 'Chưa có đơn hàng nào được tạo'
              : `Không có đơn hàng nào ở trạng thái "${getStatusText(filterStatus)}"`
            }
          </p>
          <button 
            onClick={() => window.location.href = '/orders/create'}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
          >
            Tạo đơn hàng đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleOrderClick(order)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">#{order.id}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-teal-600">{formatCurrency(order.total_amount)}</p>
                  <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{order.customer_name}</h4>
                  <p className="text-sm text-gray-600 mb-1">{order.customer_phone}</p>
                  {order.customer_address && (
                    <p className="text-sm text-gray-500">{order.customer_address}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Số sản phẩm:</span> {order.items.length}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Tổng số lượng:</span> {order.items.reduce((sum, item) => sum + item.quantity, 0)} bao
                  </p>
                  {order.notes && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Ghi chú:</span> {order.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Sản phẩm:</p>
                <div className="space-y-1">
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.product_name}</span>
                      <span className="text-gray-900">{item.quantity} bao × {formatCurrency(item.unit_price)}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-500">... và {order.items.length - 2} sản phẩm khác</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}