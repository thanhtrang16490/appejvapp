'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockSectorService } from '@/services/mock-sector';
import { sectors as sectorService } from '@/services';
import { Sector } from '@/types';
import HomeHeader from './HomeHeader';
import BrandSelector from './BrandSelector';
import PromoBanners from './PromoBanners';
import ProductSection from './ProductSection';
import BottomNavigation from '../layout/BottomNavigation';

export default function HomePage() {
  const { authState } = useAuth();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sectorsData = await sectorService.getAllSectors();
        // Handle API response format: { data: [...] }
        let sectorsArray: Sector[] = [];
        
        if (Array.isArray(sectorsData)) {
          sectorsArray = sectorsData;
        } else if (sectorsData && typeof sectorsData === 'object' && 'data' in sectorsData) {
          const responseData = (sectorsData as Record<string, unknown>).data;
          sectorsArray = Array.isArray(responseData) ? responseData : [];
        } else {
          sectorsArray = [];
        }
        
        setSectors(sectorsArray);
        console.log('Loaded sectors:', sectorsArray.length);
      } catch (error) {
        console.error('Error loading home data:', error);
        // Fallback to mock data if API fails
        try {
          const fallbackSectors = await mockSectorService.getAllSectors();
          setSectors(fallbackSectors);
          console.log('Loaded fallback sectors:', fallbackSectors.length);
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
          setSectors([]); // Set empty array as final fallback
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (authState.isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-2"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const currentUser = authState.user;
  const isCustomer = currentUser?.role_id === 3;
  const isPublic = currentUser?.role_id === 4;

  return (
    <div className="min-h-screen bg-gray-50">
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
        {!isCustomer && !isPublic && Array.isArray(sectors) && sectors.length > 0 && (
          <div className="py-4">
            <BrandSelector sectors={sectors} />
          </div>
        )}

        {/* Promo Banners - Always visible */}
        <div className="py-4">
          <PromoBanners />
        </div>

        {/* Product Sections - Hidden for customers */}
        {!isCustomer && Array.isArray(sectors) && sectors.length > 0 && (
          <div className="py-4">
            <div className="px-4 mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Bán chạy</h2>
            </div>
            {sectors.map((sector) => (
              <ProductSection key={sector.id} sector={sector} />
            ))}
          </div>
        )}

        {/* Content Gallery - Removed as requested */}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation user={currentUser} currentPage="index" />
    </div>
  );
}