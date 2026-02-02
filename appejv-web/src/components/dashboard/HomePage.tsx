'use client';

import { useEffect, useState } from 'react';
import { mockSectorService } from '@/services/mock-sector';
import { Sector, User } from '@/types';
import HomeHeader from './HomeHeader';
import BrandSelector from './BrandSelector';
import PromoBanners from './PromoBanners';
import ProductSection from './ProductSection';
import ContentGallery from './ContentGallery';
import BottomNavigation from '../layout/BottomNavigation';
import RoleSwitcher from '../demo/RoleSwitcher';

// Default mock user data - Public user (no login required)
const defaultUser: User = {
  id: 4,
  role_id: 4,
  email: null,
  password: '',
  created_at: '2024-01-01T00:00:00Z',
  commission_rate: null,
  name: 'Khách vãng lai',
  phone: '',
  parent_id: null,
  total_commission: null,
  role: { name: 'public', description: 'Public User', id: 4 },
  address: undefined,
  avatar: undefined,
};

export default function HomePage() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sectorsData = await mockSectorService.getAllSectors();
        setSectors(sectorsData);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUserChange = (user: User) => {
    setCurrentUser(user);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-2"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const isCustomer = currentUser?.role_id === 3;
  const isPublic = currentUser?.role_id === 4;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Role Switcher */}
      <RoleSwitcher currentUser={currentUser} onUserChange={handleUserChange} />

      {/* Header */}
      <HomeHeader user={currentUser} />

      {/* Main content with bottom padding for navigation */}
      <div className="bg-gray-50 pb-20">
        {/* Customer devices section - Only for customers */}
        {isCustomer && (
          <div className="bg-gray-50 py-4">
            {/* UserDevices component would go here */}
            <div className="px-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Thiết bị của bạn</h3>
                <p className="text-gray-600">Thông tin thiết bị sẽ hiển thị ở đây</p>
              </div>
            </div>
          </div>
        )}

        {/* Brand Selector - Hidden for customers and public users */}
        {!isCustomer && !isPublic && (
          <div className="py-4">
            <BrandSelector sectors={sectors} />
          </div>
        )}

        {/* Promo Banners - Always visible */}
        <div className="py-4">
          <PromoBanners />
        </div>

        {/* Product Sections - Hidden for customers */}
        {!isCustomer && (
          <div className="py-4">
            <div className="px-4 mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Bán chạy</h2>
            </div>
            {sectors.map((sector) => (
              <ProductSection key={sector.id} sector={sector} />
            ))}
          </div>
        )}

        {/* Content Gallery */}
        <div className="py-4">
          <ContentGallery />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation user={currentUser} currentPage="home" />
    </div>
  );
}