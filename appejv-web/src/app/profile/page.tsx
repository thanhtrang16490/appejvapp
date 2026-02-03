'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { AvatarFrame } from '@/components/ui';

export default function ProfilePage() {
  const router = useRouter();
  const { authState, logout, updateUser } = useAuth();
  const toast = useToast();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  
  const currentUser = authState.user;
  const [editForm, setEditForm] = useState({
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    phone: currentUser?.phone || '',
    name: currentUser?.name || '',
  });

  const formatPhoneNumber = (phoneNumber: string): string => {
    if (!phoneNumber) return '';
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) return phoneNumber;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Đăng xuất thành công');
      router.push('/login');
    } catch {
      toast.error('Có lỗi xảy ra khi đăng xuất');
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await updateUser(editForm);
      if (updatedUser) {
        setShowEditModal(false);
        toast.success('Thông tin đã được cập nhật thành công');
      } else {
        toast.error('Không thể cập nhật thông tin');
      }
    } catch {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  const handleBackClick = () => {
    console.log('Back button clicked'); // Debug log
    try {
      // Thử sử dụng window.history.back() trước
      if (typeof window !== 'undefined') {
        console.log('Using window.history.back()'); // Debug log
        window.history.back();
      } else {
        console.log('Fallback to router.push(/)'); // Debug log
        // Fallback về trang chủ
        router.push('/');
      }
    } catch {
      console.error('Error navigating back');
      // Fallback về trang chủ nếu có lỗi
      router.push('/');
    }
  };

  const handleSupportCall = () => {
    setShowSupportModal(true);
  };

  // Loading state check
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Background */}
      <div 
        className="relative h-72 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/replace-holder.png')",
          backgroundColor: '#1a1a2e'
        }}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Back Button */}
        <button 
          onClick={handleBackClick}
          className="absolute top-4 left-4 z-50 w-10 h-10 bg-black bg-opacity-30 rounded-full flex items-center justify-center text-white hover:bg-opacity-50 cursor-pointer"
          style={{ pointerEvents: 'auto' }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Profile Info */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-8">
          <AvatarFrame name={currentUser.name} size="lg" className="border-2 border-white mb-2" />
          <h1 className="text-lg font-medium text-white mb-1 text-shadow">
            {currentUser.name}
          </h1>
          <p className="text-sm text-white text-shadow">
            {formatPhoneNumber(currentUser.phone)}
          </p>
        </div>

        {/* Role Badge */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="bg-red-600 py-3 px-4 rounded-t-lg">
            <p className="text-white text-xs font-bold text-center">
              {currentUser.role?.description?.toUpperCase() || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        {/* Account Section */}
        <div className="bg-white mt-2">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
            <h2 className="text-xs font-bold text-gray-500">TÀI KHOẢN</h2>
            <button
              onClick={() => {
                setEditForm({
                  email: currentUser?.email || '',
                  address: currentUser?.address || '',
                  phone: currentUser?.phone || '',
                  name: currentUser?.name || '',
                });
                setShowEditModal(true);
              }}
              className="text-xs font-bold text-red-600"
            >
              YÊU CẦU THAY ĐỔI
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Thông tin cá nhân</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Bank Account - Only for non-customers */}
            {currentUser.role_id !== 3 && (
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Tài khoản thụ hưởng</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Hợp đồng của bạn</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white mt-2">
          <div className="px-4 py-2 border-b border-gray-100">
            <h2 className="text-xs font-bold text-gray-500">CÀI ĐẶT</h2>
          </div>

          <div className="divide-y divide-gray-100">
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Mật khẩu</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 4.828A4 4 0 015.5 4H9v1H5.5a3 3 0 00-2.121.879l-.707.707A1 1 0 012 7.414V11H1V7.414a2 2 0 01.586-1.414l.707-.707A5 5 0 015.5 3H9a1 1 0 011 1v7a1 1 0 01-1 1H5.5a3 3 0 00-2.121.879l-.707.707A1 1 0 012 13.414V17H1v-3.586a2 2 0 01.586-1.414l.707-.707A5 5 0 015.5 11H8V4a2 2 0 012-2h4.5a5 5 0 013.207 1.293l.707.707A2 2 0 0119 5.414V9h-1V5.414a1 1 0 00-.293-.707l-.707-.707A4 4 0 0014.5 3H10a1 1 0 00-1 1v7h4.5a4 4 0 012.828 1.172l.707.707A1 1 0 0117 13.586V17h-1v-3.414a2 2 0 00-.586-1.414l-.707-.707A3 3 0 0012.5 11H9V4z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Thông báo</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* App Info Section */}
        <div className="bg-white mt-2">
          <div className="px-4 py-2 border-b border-gray-100">
            <h2 className="text-xs font-bold text-gray-500">THÔNG TIN ỨNG DỤNG</h2>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Phiên bản ứng dụng</span>
              </div>
              <span className="text-xs text-gray-500">1.0.0</span>
            </div>

            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Điều khoản và chính sách</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button 
              onClick={handleSupportCall}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Liên hệ hỗ trợ</span>
              </div>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </button>

            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center p-3 bg-gray-500 hover:bg-gray-600"
            >
              <div className="flex items-center">
                <svg className="w-6 h-6 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-medium text-white">Đăng xuất</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-lg w-full max-w-md max-h-[70vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa thông tin</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <textarea
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập địa chỉ"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Xác nhận đăng xuất
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Contact Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
                Liên hệ hỗ trợ
              </h3>
              <div className="space-y-3 mb-6">
                <div className="text-center">
                  <p className="font-semibold text-gray-900">CÔNG TY CỔ PHẦN APPE JV VIỆT NAM</p>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Địa chỉ:</span> Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam</p>
                  <p><span className="font-medium">Điện thoại:</span> 03513 595 030</p>
                  <p><span className="font-medium">Fax:</span> 03513 835 990</p>
                  <p><span className="font-medium">Website:</span> www.appe.vn</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setShowSupportModal(false);
                    window.open('tel:03513595030', '_self');
                    toast.info('Đang thực hiện cuộc gọi...');
                  }}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Gọi ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}