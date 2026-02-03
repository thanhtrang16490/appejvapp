'use client';

import { User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { AvatarFrame } from '@/components/ui';
import { LogOut } from 'lucide-react';

interface HomeHeaderProps {
  user: User | null;
}

export default function HomeHeader({ user }: HomeHeaderProps) {
  const { logout } = useAuth();
  const toast = useToast();

  const formatPhone = (phone: string) => {
    // Format phone as xxx xxx xxx (matching mobile app)
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
    return phone;
  };

  const formatCurrency = (amount: number) => {
    const roundedAmount = Math.round(amount / 1000) * 1000;
    return new Intl.NumberFormat('vi-VN', {
      maximumFractionDigits: 0,
    }).format(roundedAmount);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will be handled by middleware
      window.location.href = '/login';
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng xuất');
    }
  };

  const isAgent = user?.role_id === 1 || user?.role_id === 2;
  const isPublic = user?.role_id === 4;

  return (
    <div className="bg-red-600 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
      
      <div className="relative z-20 px-4 pt-4 pb-6">
        {/* Top section with user info and notifications */}
        <div className="flex items-center justify-between mb-4">
          {/* User info */}
          <button 
            onClick={() => {
              if (isPublic) {
                window.location.href = '/login';
              } else {
                window.location.href = '/profile';
              }
            }}
            className="flex items-center flex-1 hover:opacity-80 transition-opacity"
          >
            <AvatarFrame name={user?.name || 'User'} size="md" className="border border-gray-300" />
            
            <div className="ml-3 flex-1 text-left">
              <p className="text-white text-base font-bold truncate">
                {user?.name || 'Người dùng'}
              </p>
              <p className="text-yellow-400 text-sm truncate">
                {isPublic ? 'Nhấn để đăng nhập' : (user?.phone ? formatPhone(user.phone) : '(Chưa đăng nhập)')}
              </p>
            </div>
          </button>

          {/* Notification icons */}
          <div className="flex items-center space-x-2">
            {isAgent && (
              <button 
                onClick={() => window.location.href = '/quotation'}
                className="bg-black bg-opacity-20 rounded-full p-2 hover:bg-opacity-30"
              >
                <img
                  src="/images/trail-icon.png"
                  alt="Tạo báo giá"
                  className="w-6 h-6"
                />
              </button>
            )}
            {!isPublic && (
              <>
                <button 
                  onClick={() => window.location.href = '/notifications'}
                  className="bg-black bg-opacity-20 rounded-full p-2 hover:bg-opacity-30"
                >
                  <img
                    src="/images/bell.png"
                    alt="Thông báo"
                    className="w-6 h-6"
                  />
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-black bg-opacity-20 rounded-full p-2 hover:bg-opacity-30 transition-all"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Income card - Only for agents */}
        {isAgent && (
          <div className="bg-gradient-to-r from-yellow-400 from-60% to-transparent rounded-lg p-3 bg-opacity-90 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-white text-sm mb-1">
                  Doanh thu dự kiến T{new Date().getMonth() + 1}
                </p>
                <div className="flex items-center">
                  <p className="text-white text-2xl font-bold mr-2">
                    {formatCurrency(user?.total_commission || 0)}
                  </p>
                  <button className="p-1">
                    <img
                      src="/images/eye-icon.png"
                      alt="Toggle visibility"
                      className="w-9 h-9"
                    />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {user?.role_id !== 5 && (
                  <button 
                    onClick={() => window.location.href = '/community'}
                    className="flex flex-col items-center hover:opacity-80"
                  >
                    <img
                      src="/images/cong-dong.png"
                      alt="Cộng đồng"
                      className="w-6 h-6 mb-1"
                    />
                    <span className="text-white text-xs">Cộng đồng</span>
                  </button>
                )}
                <button 
                  onClick={() => window.location.href = '/stats'}
                  className="flex flex-col items-center hover:opacity-80"
                >
                  <img
                    src="/images/chart-pie.png"
                    alt="Thống kê"
                    className="w-6 h-6 mb-1"
                  />
                  <span className="text-white text-xs">Thống kê</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}