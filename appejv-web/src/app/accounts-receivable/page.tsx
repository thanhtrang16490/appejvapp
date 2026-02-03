'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';

interface AccountsReceivable {
  id: number;
  invoice_code: string;
  total_amount: number;
  paid_amount: number;
  outstanding_amount: number;
  due_date: string;
  status: string;
  payment_terms: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  order: {
    id: number;
    order_code: string;
    order_date: string;
    agent: {
      id: string;
      name: string;
    };
  };
}

interface Summary {
  total_outstanding: number;
  total_overdue: number;
  count_outstanding: number;
  count_overdue: number;
}

// Mock data
const mockReceivables: AccountsReceivable[] = [
  {
    id: 1,
    invoice_code: 'INV-001',
    total_amount: 8500000,
    paid_amount: 4250000,
    outstanding_amount: 4250000,
    due_date: '2024-12-20',
    status: 'outstanding',
    payment_terms: 'Net 30',
    customer: {
      id: '2',
      name: 'Trang trại gia cầm Minh Phát',
      phone: '0987654321',
      email: 'minhphat@email.com'
    },
    order: {
      id: 2,
      order_code: 'ORD-002',
      order_date: '2024-12-05',
      agent: {
        id: '1',
        name: 'Nguyễn Văn A'
      }
    }
  },
  {
    id: 2,
    invoice_code: 'INV-002',
    total_amount: 12000000,
    paid_amount: 0,
    outstanding_amount: 12000000,
    due_date: '2024-12-25',
    status: 'outstanding',
    payment_terms: 'Net 30',
    customer: {
      id: '3',
      name: 'Hợp tác xã chăn nuôi Thành Đạt',
      phone: '0934567890',
      email: 'thanhdat@email.com'
    },
    order: {
      id: 3,
      order_code: 'ORD-003',
      order_date: '2024-12-08',
      agent: {
        id: '2',
        name: 'Trần Thị B'
      }
    }
  },
  {
    id: 3,
    invoice_code: 'INV-003',
    total_amount: 6800000,
    paid_amount: 0,
    outstanding_amount: 6800000,
    due_date: '2025-01-10',
    status: 'outstanding',
    payment_terms: 'Net 30',
    customer: {
      id: '4',
      name: 'Trang trại lợn sạch Phú Thọ',
      phone: '0945678901',
      email: 'phutho@email.com'
    },
    order: {
      id: 4,
      order_code: 'ORD-004',
      order_date: '2024-12-10',
      agent: {
        id: '1',
        name: 'Nguyễn Văn A'
      }
    }
  },
  {
    id: 4,
    invoice_code: 'INV-004',
    total_amount: 9200000,
    paid_amount: 0,
    outstanding_amount: 9200000,
    due_date: '2024-12-15',
    status: 'overdue',
    payment_terms: 'Net 15',
    customer: {
      id: '5',
      name: 'Trại chăn nuôi Bình Minh',
      phone: '0956789012',
      email: 'binhminh@email.com'
    },
    order: {
      id: 5,
      order_code: 'ORD-005',
      order_date: '2024-11-30',
      agent: {
        id: '1',
        name: 'Nguyễn Văn A'
      }
    }
  }
];

const mockSummary: Summary = {
  total_outstanding: 32250000,
  total_overdue: 9200000,
  count_outstanding: 4,
  count_overdue: 1
};

export default function AccountsReceivablePage() {
  const { authState } = useAuth();
  const toast = useToast();
  const [receivables, setReceivables] = useState<AccountsReceivable[]>([]);
  const [summary, setSummary] = useState<Summary>({
    total_outstanding: 0,
    total_overdue: 0,
    count_outstanding: 0,
    count_overdue: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  const currentUser = authState.user;

  useEffect(() => {
    if (currentUser) {
      fetchAccountsReceivable();
    }
  }, [currentUser, selectedStatus, showOverdueOnly]);

  const fetchAccountsReceivable = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredReceivables = [...mockReceivables];

      // Filter by status
      if (selectedStatus !== 'all') {
        filteredReceivables = filteredReceivables.filter(item => item.status === selectedStatus);
      }

      // Filter overdue only
      if (showOverdueOnly) {
        const today = new Date();
        filteredReceivables = filteredReceivables.filter(item => {
          const dueDate = new Date(item.due_date);
          return dueDate < today && item.status !== 'paid';
        });
      }

      setReceivables(filteredReceivables);
      setSummary(mockSummary);
    } catch (error) {
      console.error('Error fetching accounts receivable:', error);
      toast.error('Không thể tải danh sách công nợ');
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

  const getStatusColor = (status: string) => {
    const colors = {
      outstanding: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      written_off: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      outstanding: 'Còn nợ',
      overdue: 'Quá hạn',
      paid: 'Đã thanh toán',
      written_off: 'Đã xóa nợ'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

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
          <h1 className="text-xl font-semibold text-gray-900">Công nợ phải thu</h1>
          <button className="p-2">
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600">Tổng công nợ</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(summary.total_outstanding)}</p>
                <p className="text-xs text-gray-500">{summary.count_outstanding} hóa đơn</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600">Quá hạn</p>
                <p className="text-lg font-bold text-red-600">{formatCurrency(summary.total_overdue)}</p>
                <p className="text-xs text-gray-500">{summary.count_overdue} hóa đơn</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 p-4 space-y-4">
        <div className="flex items-center space-x-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="outstanding">Còn nợ</option>
            <option value="overdue">Quá hạn</option>
            <option value="paid">Đã thanh toán</option>
            <option value="written_off">Đã xóa nợ</option>
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showOverdueOnly}
              onChange={(e) => setShowOverdueOnly(e.target.checked)}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">Chỉ quá hạn</span>
          </label>
        </div>
      </div>

      {/* Receivables List */}
      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : receivables.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-600">Không có công nợ nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {receivables.map((receivable) => (
              <div key={receivable.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{receivable.invoice_code}</h3>
                      <p className="text-sm text-gray-600">{receivable.customer.name}</p>
                      <p className="text-xs text-gray-500">{receivable.customer.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        {formatCurrency(receivable.outstanding_amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Tổng: {formatCurrency(receivable.total_amount)}
                      </p>
                    </div>
                  </div>

                  {/* Status and Due Date */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(receivable.status)}`}>
                      {getStatusText(receivable.status)}
                    </span>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Hạn: {new Date(receivable.due_date).toLocaleDateString('vi-VN')}
                      </p>
                      {isOverdue(receivable.due_date) && receivable.status !== 'paid' && (
                        <p className="text-xs text-red-600">
                          Quá hạn {getDaysOverdue(receivable.due_date)} ngày
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Đã thanh toán</span>
                      <span>{formatCurrency(receivable.paid_amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min((receivable.paid_amount / receivable.total_amount) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="mb-3 p-2 bg-gray-50 rounded">
                    <p className="text-sm text-gray-700">
                      Đơn hàng: {receivable.order.order_code}
                    </p>
                    <p className="text-xs text-gray-500">
                      Ngày đặt: {new Date(receivable.order.order_date).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Điều khoản: {receivable.payment_terms}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <button
                      onClick={() => toast.info('Tính năng xem đơn hàng sẽ được phát triển')}
                      className="text-blue-600 text-sm font-medium hover:text-blue-800"
                    >
                      Xem đơn hàng
                    </button>
                    <div className="flex space-x-2">
                      {receivable.status !== 'paid' && (
                        <button
                          onClick={() => toast.info('Tính năng thanh toán sẽ được phát triển')}
                          className="text-green-600 text-sm font-medium hover:text-green-800"
                        >
                          Thanh toán
                        </button>
                      )}
                      <button
                        onClick={() => toast.info('Tính năng xem chi tiết công nợ sẽ được phát triển')}
                        className="text-purple-600 text-sm font-medium hover:text-purple-800"
                      >
                        Chi tiết
                      </button>
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