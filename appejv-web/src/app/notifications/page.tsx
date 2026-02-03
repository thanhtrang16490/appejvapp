'use client';

import { useState } from 'react';
import { User } from '@/types';
import BottomNavigation from '@/components/layout/BottomNavigation';

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

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'alert' | 'commission';
  title: string;
  message: string;
  time: string;
  icon: string;
  iconBackground: string;
  iconColor: string;
  hasAction: boolean;
  actionText?: string;
  read: boolean;
}

interface FilterOption {
  id: string;
  type: string;
  label: string;
  icon: string;
  iconBackground: string;
  iconColor: string;
  selected: boolean;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Hợp đồng mới được ký',
    message: 'Khách hàng Nguyễn Văn A đã ký hợp đồng mua thức ăn chăn nuôi 5 tấn',
    time: '2 giờ trước',
    icon: '✓',
    iconBackground: '#ECFDF3',
    iconColor: '#12B669',
    hasAction: true,
    actionText: 'Xem chi tiết',
    read: false,
  },
  {
    id: '2',
    type: 'commission',
    title: 'Hoa hồng mới',
    message: 'Bạn nhận được hoa hồng 2,500,000 VNĐ từ hợp đồng #HD001',
    time: '5 giờ trước',
    icon: '💰',
    iconBackground: '#F9F5FF',
    iconColor: '#9D76ED',
    hasAction: true,
    actionText: 'Xem thống kê',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Cộng đồng Appejv',
    message: 'Có 5 bài viết mới trong nhóm "Chia sẻ kinh nghiệm bán hàng"',
    time: '1 ngày trước',
    icon: '👥',
    iconBackground: '#EFF8FF',
    iconColor: '#2E90FA',
    hasAction: false,
    read: true,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Bài viết mới',
    message: 'Appe JV vừa đăng bài viết "Xu hướng dinh dưỡng vật nuôi 2024"',
    time: '2 ngày trước',
    icon: '📄',
    iconBackground: '#FFFAEB',
    iconColor: '#F79009',
    hasAction: true,
    actionText: 'Đọc ngay',
    read: true,
  },
  {
    id: '5',
    type: 'alert',
    title: 'Khách hàng tiềm năng',
    message: 'Bạn có 3 khách hàng tiềm năng chưa liên hệ trong tuần này',
    time: '3 ngày trước',
    icon: '👤',
    iconBackground: '#FFECED',
    iconColor: '#ED1C24',
    hasAction: true,
    actionText: 'Xem danh sách',
    read: true,
  },
];

// Filter options
const filterOptions: FilterOption[] = [
  {
    id: '1',
    type: 'success',
    label: 'Hợp đồng',
    icon: '✓',
    iconBackground: '#ECFDF3',
    iconColor: '#12B669',
    selected: false,
  },
  {
    id: '2',
    type: 'commission',
    label: 'Hoa hồng',
    icon: '💰',
    iconBackground: '#F9F5FF',
    iconColor: '#9D76ED',
    selected: false,
  },
  {
    id: '3',
    type: 'info',
    label: 'Cộng đồng',
    icon: '👥',
    iconBackground: '#EFF8FF',
    iconColor: '#2E90FA',
    selected: false,
  },
  {
    id: '4',
    type: 'warning',
    label: 'Bài viết',
    icon: '📄',
    iconBackground: '#FFFAEB',
    iconColor: '#F79009',
    selected: false,
  },
  {
    id: '5',
    type: 'alert',
    label: 'Khách hàng',
    icon: '👤',
    iconBackground: '#FFECED',
    iconColor: '#ED1C24',
    selected: false,
  },
];

export default function NotificationsPage() {
  const [currentUser] = useState<User>(defaultUser);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filters, setFilters] = useState<FilterOption[]>(filterOptions);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const toggleFilter = (filterId: string) => {
    setFilters(prev => prev.map(filter => 
      filter.id === filterId 
        ? { ...filter, selected: !filter.selected }
        : filter
    ));
  };

  const getFilteredNotifications = () => {
    const selectedFilters = filters.filter(f => f.selected);
    if (selectedFilters.length === 0) {
      return notifications;
    }
    
    const selectedTypes = selectedFilters.map(f => f.type);
    return notifications.filter(notification => 
      selectedTypes.includes(notification.type)
    );
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

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
          <div className="flex-1 text-center">
            <h1 className="text-xl font-semibold text-gray-900">Thông báo</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500">{unreadCount} thông báo chưa đọc</p>
            )}
          </div>
          <button 
            onClick={() => setShowFilterModal(true)}
            className="p-2"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {filteredNotifications.length} thông báo
            </span>
            {filters.some(f => f.selected) && (
              <div className="flex items-center space-x-2">
                {filters.filter(f => f.selected).map(filter => (
                  <span
                    key={filter.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: filter.iconBackground, 
                      color: filter.iconColor 
                    }}
                  >
                    <span className="mr-1">{filter.icon}</span>
                    {filter.label}
                  </span>
                ))}
              </div>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 pb-20">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 4.828A4 4 0 015.5 4H9v1H5.5a3 3 0 00-2.121.879l-.707.707A1 1 0 012 7.414V11H1V7.414a2 2 0 01.586-1.414l.707-.707A5 5 0 015.5 3H9a1 1 0 011 1v7a1 1 0 01-1 1H5.5a3 3 0 00-2.121.879l-.707.707A1 1 0 012 13.414V17H1v-3.586a2 2 0 01.586-1.414l.707-.707A5 5 0 015.5 11H8V4a2 2 0 012-2h4.5a5 5 0 013.207 1.293l.707.707A2 2 0 0119 5.414V9h-1V5.414a1 1 0 00-.293-.707l-.707-.707A4 4 0 0014.5 3H10a1 1 0 00-1 1v7h4.5a4 4 0 012.828 1.172l.707.707A1 1 0 0117 13.586V17h-1v-3.414a2 2 0 00-.586-1.414l-.707-.707A3 3 0 0012.5 11H9V4z" />
              </svg>
            </div>
            <p className="text-gray-500 text-center">Không có thông báo nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : 'bg-white'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{
                      backgroundColor: notification.iconBackground,
                      color: notification.iconColor,
                    }}
                  >
                    {notification.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${
                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{notification.time}</span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {notification.message}
                    </p>
                    
                    {notification.hasAction && notification.actionText && (
                      <button className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium">
                        {notification.actionText} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Lọc thông báo</h3>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                    filter.selected
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{
                        backgroundColor: filter.iconBackground,
                        color: filter.iconColor,
                      }}
                    >
                      {filter.icon}
                    </div>
                    <span className="font-medium text-gray-900">{filter.label}</span>
                  </div>
                  
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    filter.selected
                      ? 'bg-red-600 border-red-600'
                      : 'border-gray-300'
                  }`}>
                    {filter.selected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setFilters(prev => prev.map(f => ({ ...f, selected: false })));
                  }}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation user={currentUser} currentPage="notifications" />
    </div>
  );
}