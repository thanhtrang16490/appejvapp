'use client';

import { useState, useEffect } from 'react';

interface Banner {
  id: string;
  action: string;
  mainText: string;
  buttonText: string;
  backgroundColor: string[];
  imageUrl: string;
  useGradient: boolean;
}

export default function PromoBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock banner data matching mobile app
  const mockBanners: Banner[] = [
    {
      id: '1',
      action: 'Sản phẩm nổi bật',
      mainText: 'Appejv Feed',
      buttonText: 'Xem ngay',
      backgroundColor: ['#ED1C24', '#D9261C'],
      imageUrl: '',
      useGradient: true,
    },
    {
      id: '2',
      action: 'Giải pháp dinh dưỡng',
      mainText: 'Appejv Global',
      buttonText: 'Xem ngay',
      backgroundColor: ['#4CAF50', '#2E7D32'],
      imageUrl: '',
      useGradient: true,
    },
  ];

  useEffect(() => {
    // Simulate API call
    const loadBanners = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setBanners(mockBanners);
      } catch (error) {
        console.error('Error loading banners:', error);
        setBanners(mockBanners);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="px-4">
        <div className="h-36 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
          <span className="ml-2 text-gray-600">Đang tải banner...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="relative">
        {/* Banner container */}
        <div className="overflow-hidden rounded-lg shadow-lg">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner.id} className="w-full flex-shrink-0">
                <div className="h-36 relative">
                  {banner.useGradient ? (
                    <div 
                      className="w-full h-full rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${banner.backgroundColor[0]}, ${banner.backgroundColor[1]})`
                      }}
                      onClick={() => {
                        if (banner.id === '1') {
                          window.location.href = '/products';
                        } else if (banner.id === '2') {
                          window.location.href = '/gallery';
                        }
                      }}
                    >
                      <div className="text-center text-white p-4">
                        <svg className="w-8 h-8 mx-auto mb-2 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-xl font-bold mb-1 drop-shadow-lg">{banner.mainText}</h3>
                        <p className="text-sm mb-3 drop-shadow-lg">{banner.action}</p>
                        <div className="inline-block bg-white bg-opacity-30 border border-white rounded-full px-3 py-1">
                          <span className="text-sm font-medium">{banner.buttonText}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={banner.imageUrl}
                      alt={banner.mainText}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination dots */}
        {banners.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-0.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-4 bg-red-600'
                    : 'w-3 bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}