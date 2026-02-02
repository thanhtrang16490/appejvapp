'use client';

import { useState, useEffect } from 'react';

interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
  link?: string;
  color: string;
}

export default function PromotionalBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock banners data
  const mockBanners: Banner[] = [
    {
      id: 1,
      title: 'Khuyến mãi đặc biệt',
      description: 'Giảm giá 20% cho tất cả sản phẩm thức ăn chăn nuôi',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
      color: 'from-red-500 to-red-600',
    },
    {
      id: 2,
      title: 'Tư vấn miễn phí',
      description: 'Đội ngũ kỹ thuật tư vấn thiết kế hệ thống phù hợp',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 3,
      title: 'Bảo hành 25 năm',
      description: 'Cam kết bảo hành dài hạn cho tất cả sản phẩm',
      image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800',
      color: 'from-green-500 to-green-600',
    },
  ];

  useEffect(() => {
    // Simulate API call
    const loadBanners = async () => {
      try {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setBanners(mockBanners);
      } catch (error) {
        console.error('Error loading banners:', error);
        setBanners(mockBanners); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, [mockBanners]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Khuyến mãi & Ưu đãi</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} opacity-90`}></div>
            
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>

            {/* Content */}
            <div className="relative p-6 h-32 flex flex-col justify-center text-white">
              <h3 className="text-lg font-bold mb-2 group-hover:scale-105 transition-transform">
                {banner.title}
              </h3>
              <p className="text-sm opacity-90 line-clamp-2">
                {banner.description}
              </p>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            🔥 Ưu đãi có thời hạn
          </h3>
          <p className="text-gray-800 mb-4">
            Liên hệ ngay để nhận báo giá tốt nhất và tư vấn miễn phí từ chuyên gia
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium">
              Liên hệ tư vấn
            </button>
            <button className="bg-white text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Xem báo giá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}