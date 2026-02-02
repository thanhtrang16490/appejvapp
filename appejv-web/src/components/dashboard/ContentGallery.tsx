'use client';

import { useState, useEffect } from 'react';
import { PlaceholderFrame } from '@/components/ui';

interface ContentItem {
  id: number;
  title: string;
  content: string;
  image: string;
  brand: string;
  category: string;
  created_at: string;
}

export default function ContentGallery() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock content data
  const mockContents: ContentItem[] = [
    {
      id: 1,
      title: 'Lợi ích của thức ăn heo CP59 chất lượng',
      content: 'Thức ăn heo CP59 giúp heo phát triển khỏe mạnh với tỷ lệ chuyển đổi thức ăn tối ưu...',
      image: '',
      brand: 'Appe JV',
      category: 'education',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Hướng dẫn cho heo ăn CP59 hiệu quả',
      content: 'Quy trình cho heo ăn thức ăn CP59 khoa học để tối ưu hóa tăng trưởng...',
      image: '',
      brand: 'Appe JV',
      category: 'guide',
      created_at: '2024-01-02T00:00:00Z',
    },
    {
      id: 3,
      title: 'Bảo quản thức ăn heo CP59 đúng cách',
      content: 'Cách bảo quản thức ăn heo CP59 để đảm bảo chất lượng dinh dưỡng...',
      image: '',
      brand: 'Appe JV',
      category: 'maintenance',
      created_at: '2024-01-03T00:00:00Z',
    },
    {
      id: 4,
      title: 'Xu hướng chăn nuôi heo hiện đại với CP59',
      content: 'Những xu hướng mới nhất trong chăn nuôi heo sử dụng thức ăn CP59...',
      image: '',
      brand: 'Appe JV',
      category: 'trend',
      created_at: '2024-01-04T00:00:00Z',
    },
    {
      id: 5,
      title: 'Chính sách hỗ trợ chăn nuôi heo',
      content: 'Các chính sách hỗ trợ từ chính phủ cho ngành chăn nuôi heo...',
      image: '',
      brand: 'Appe JV',
      category: 'policy',
      created_at: '2024-01-05T00:00:00Z',
    },
  ];

  useEffect(() => {
    const loadContents = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        setContents(mockContents);
      } catch (error) {
        console.error('Error loading contents:', error);
        setContents(mockContents);
      } finally {
        setLoading(false);
      }
    };

    loadContents();
  }, [mockContents]);

  if (loading) {
    return (
      <div className="bg-white py-4">
        <div className="px-4 mb-4">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 px-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 w-56 bg-gray-200 rounded-lg animate-pulse" style={{ aspectRatio: '4/5' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-4">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className="text-xl font-bold text-gray-900">Bài viết liên quan</h3>
        <button
          onClick={() => window.location.href = '/gallery'}
          className="text-red-600 text-sm font-medium hover:text-red-700"
        >
          Xem tất cả
        </button>
      </div>

      {/* Content horizontal scroll */}
      <div className="overflow-x-auto">
        <div className="flex space-x-4 px-4">
          {contents.map((content) => (
            <div
              key={content.id}
              onClick={() => window.location.href = '/gallery'}
              className="flex-shrink-0 w-56 bg-white rounded-lg shadow-sm border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              style={{ aspectRatio: '4/5' }}
            >
              {/* Content image */}
              <div className="w-full h-36">
                <PlaceholderFrame 
                  text="replace holder"
                  className="w-full h-full rounded-none"
                  aspectRatio="none"
                  textSize="sm"
                />
              </div>

              {/* Content info */}
              <div className="p-3 flex-1">
                <h4 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                  {content.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {content.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}