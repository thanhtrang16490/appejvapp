'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';

interface Order {
  id: number;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  payment_status: string;
  delivery_status: string;
  order_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  agent: {
    id: string;
    name: string;
  };
  order_items: Array<{
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  accounts_receivable: Array<{
    id: number;
    outstanding_amount: number;
    due_date: string;
    status: string;
  }>;
}

// Mock data
const mockOrders: Order[] = [
  {
    id: 1,
    order_code: 'ORD-001',
    customer_name: 'Trại chăn nuôi Hòa Bình',
    customer_phone: '0912345678',
    total_amount: 15000000,
    status: 'delivered',
    payment_status: 'paid',
    delivery_status: 'delivered',
    order_date: '2024-12-01',
    expected_delivery_date: '2024-12-05',
    actual_delivery_date: '2024-12-04',
    customer: {
      id: '1',
      name: 'Trại chăn nuôi Hòa Bình',
      phone: '0912345678'
    },
    agent: {
      id: '1',
      name: 'Nguyễn Văn A'
    },
    order_items: [
      {
        id: 1,
        product_name: 'HH cho lợn sữa (7 ngày tuổi - 10kg)',
        quantity: 100,
        unit_price: 27100,
        total_price: 2710000
      },
      {
        id: 2,
        product_name: 'HH cho lợn con tập ăn (10 ngày tuổi - 20kg)',
        quantity: 200,
        unit_price: 18090,
        total_price: 3618000
      }
    ],
    accounts_receivable: []
  },
  {
    id: 2,
    order_code: 'ORD-002',
    customer_name: 'Trang trại gia cầm Minh Phát',
    customer_phone: '0987654321',
    total_amount: 8500000,
    status: 'shipped',
    payment_status: 'partial',
    delivery_status: 'in_transit',
    order_date: '2024-12-05',
    expected_delivery_date: '2024-12-10',
    customer: {
      id: '2',
      name: 'Trang trại gia cầm Minh Phát',
      phone: '0987654321'
    },
    agent: {
      id: '1',
      name: 'Nguyễn Văn A'
    },
    order_items: [
      {
        id: 3,
        product_name: 'HH cho gà công nghiệp 01 - 12 ngày tuổi',
        quantity: 150,
        unit_price: 13480,
        total_price: 2022000
      },
      {
        id: 4,
        product_name: 'HH cho vịt, ngan con (từ 01 - 21 ngày tuổi)',
        quantity: 120,
        unit_price: 12360,
        total_price: 1483200
      }
    ],
    accounts_receivable: [
      {
        id: 1,
        outstanding_amount: 4250000,
        due_date: '2024-12-20',
        status: 'outstanding'
      }
    ]
  },
  {
    id: 3,
    order_code: 'ORD-003',
    customer_name: 'Hợp tác xã chăn nuôi Thành Đạt',
    customer_phone: '0934567890',
    total_amount: 12000000,
    status: 'processing',
    payment_status: 'unpaid',
    delivery_status: 'preparing',
    order_date: '2024-12-08',
    expected_delivery_date: '2024-12-15',
    customer: {
      id: '3',
      name: 'Hợp tác xã chăn nuôi Thành Đạt',
      phone: '0934567890'
    },
    agent: {
      id: '2',
      name: 'Trần Thị B'
    },
    order_items: [
      {
        id: 5,
        product_name: 'HH cho bò thịt',
        quantity: 300,
        unit_price: 10640,
        total_price: 3192000
      },
      {
        id: 6,
        product_name: 'Đậm đặc cao cấp cho lợn tập ăn - xuất chuồng',
        quantity: 80,
        unit_price: 18770,
        total_price: 1501600
      }
    ],
    accounts_receivable: [
      {
        id: 2,
        outstanding_amount: 12000000,
        due_date: '2024-12-25',
        status: 'outstanding'
      }
    ]
  },
  {
    id: 4,
    order_code: 'ORD-004',
    customer_name: 'Trang trại lợn sạch Phú Thọ',
    customer_phone: '0945678901',
    total_amount: 6800000,
    status: 'confirmed',
    payment_status: 'unpaid',
    delivery_status: 'preparing',
    order_date: '2024-12-10',
    expected_delivery_date: '2024-12-18',
    customer: {
      id: '4',
      name: 'Trang trại lợn sạch Phú Thọ',
      phone: '0945678901'
    },
    agent: {
      id: '1',
      name: 'Nguyễn Văn A'
    },
    order_items: [
      {
        id: 7,
        product_name: 'HH cho lợn siêu nạc (10 - 25kg)',
        quantity: 180,
        unit_price: 12830,
        total_price: 2309400
      }
    ],
    accounts_receivable: [
      {
        id: 3,
        outstanding_amount: 6800000,
        due_date: '2025-01-10',
        status: 'outstanding'
      }
    ]
  }
];

export default function OrdersPage() {
  const { authState } = useAuth();
  const toast = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const currentUser = authState.user;

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser, selectedStatus, selectedPaymentStatus, selectedDeliveryStatus, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredOrders = [...mockOrders];

      // Filter by status
      if (selectedStatus !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === selectedStatus);
      }
      if (selectedPaymentStatus !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.payment_status === selectedPaymentStatus);
      }
      if (selectedDeliveryStatus !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.delivery_status === selectedDeliveryStatus);
      }

      // Filter by search term
      if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => 
          order.order_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_phone.includes(searchTerm)
        );
      }

      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
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

  const getStatusColor = (status: string, type: 'order' | 'payment' | 'delivery') => {
    const colors = {
      order: {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        processing: 'bg-purple-100 text-purple-800',
        shipped: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
      },
      payment: {
        unpaid: 'bg-red-100 text-red-800',
        partial: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800',
        overdue: 'bg-red-100 text-red-800'
      },
      delivery: {
        preparing: 'bg-gray-100 text-gray-800',
        shipped: 'bg-blue-100 text-blue-800',
        in_transit: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        returned: 'bg-red-100 text-red-800'
      }
    };

    return colors[type][status as keyof typeof colors[typeof type]] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string, type: 'order' | 'payment' | 'delivery') => {
    const texts = {
      order: {
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        processing: 'Đang xử lý',
        shipped: 'Đã gửi hàng',
        delivered: 'Đã giao hàng',
        cancelled: 'Đã hủy'
      },
      payment: {
        unpaid: 'Chưa thanh toán',
        partial: 'Thanh toán một phần',
        paid: 'Đã thanh toán',
        overdue: 'Quá hạn'
      },
      delivery: {
        preparing: 'Đang chuẩn bị',
        shipped: 'Đã gửi hàng',
        in_transit: 'Đang vận chuyển',
        delivered: 'Đã giao hàng',
        returned: 'Đã trả lại'
      }
    };

    return texts[type][status as keyof typeof texts[typeof type]] || status;
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
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
          <h1 className="text-xl font-semibold text-gray-900">Quản lý đơn hàng</h1>
          <button 
            onClick={() => window.location.href = '/orders/create'}
            className="p-2"
          >
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-3 gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đã gửi hàng</option>
            <option value="delivered">Đã giao hàng</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <select
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          >
            <option value="all">Thanh toán</option>
            <option value="unpaid">Chưa thanh toán</option>
            <option value="partial">Một phần</option>
            <option value="paid">Đã thanh toán</option>
            <option value="overdue">Quá hạn</option>
          </select>

          <select
            value={selectedDeliveryStatus}
            onChange={(e) => setSelectedDeliveryStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          >
            <option value="all">Giao hàng</option>
            <option value="preparing">Đang chuẩn bị</option>
            <option value="shipped">Đã gửi hàng</option>
            <option value="in_transit">Đang vận chuyển</option>
            <option value="delivered">Đã giao hàng</option>
            <option value="returned">Đã trả lại</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-600">Không có đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.order_code}</h3>
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{order.customer_phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">{formatCurrency(order.total_amount)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.order_date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status, 'order')}`}>
                      {getStatusText(order.status, 'order')}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.payment_status, 'payment')}`}>
                      {getStatusText(order.payment_status, 'payment')}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.delivery_status, 'delivery')}`}>
                      {getStatusText(order.delivery_status, 'delivery')}
                    </span>
                  </div>

                  {/* Order Items Summary */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      {order.order_items.length} sản phẩm
                    </p>
                    {order.order_items.slice(0, 2).map((item, index) => (
                      <p key={index} className="text-xs text-gray-500">
                        {item.product_name} x{item.quantity}
                      </p>
                    ))}
                    {order.order_items.length > 2 && (
                      <p className="text-xs text-gray-500">
                        và {order.order_items.length - 2} sản phẩm khác...
                      </p>
                    )}
                  </div>

                  {/* Outstanding Amount */}
                  {order.accounts_receivable.length > 0 && order.accounts_receivable[0].outstanding_amount > 0 && (
                    <div className="mb-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        Còn nợ: {formatCurrency(order.accounts_receivable[0].outstanding_amount)}
                      </p>
                      <p className="text-xs text-yellow-600">
                        Hạn thanh toán: {new Date(order.accounts_receivable[0].due_date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <button
                      onClick={() => toast.info('Tính năng xem chi tiết đơn hàng sẽ được phát triển')}
                      className="text-blue-600 text-sm font-medium hover:text-blue-800"
                    >
                      Xem chi tiết
                    </button>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toast.info('Tính năng theo dõi giao hàng sẽ được phát triển')}
                        className="text-purple-600 text-sm font-medium hover:text-purple-800"
                      >
                        Theo dõi
                      </button>
                      {order.payment_status !== 'paid' && (
                        <button
                          onClick={() => toast.info('Tính năng thanh toán sẽ được phát triển')}
                          className="text-green-600 text-sm font-medium hover:text-green-800"
                        >
                          Thanh toán
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}