'use client';

import { useState } from 'react';
import { User } from '@/types';
import BottomNavigation from '@/components/layout/BottomNavigation';
import RoleSwitcher from '@/components/demo/RoleSwitcher';
import { PlaceholderFrame } from '@/components/ui';

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
  address: '123 Đường ABC, Quận 1, TP.HCM',
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ED1C24&color=fff',
};

interface MediaContent {
  id: number;
  title: string;
  kind: string;
  content_id: number;
  link: string;
  thumbnail: string | null;
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  description?: string;
  hashtag?: string;
  imageUrl?: string;
  media_contents?: MediaContent[];
  category?: {
    code: string;
    id: number;
    name: string;
    sector: string;
  };
  content?: string;
  created_at?: string;
  hasImage: boolean;
}

interface Sector {
  id: number;
  name: string;
  code: string;
  image: string;
  image_rectangular: string;
  description: string | null;
  tech_phone: string | null;
  sale_phone: string | null;
  post_count?: number;
}

// Mock data for sectors
const mockSectors = [
  {
    id: 1,
    name: 'Appe JV',
    code: 'APPEJV',
    image: '',
    image_rectangular: '',
    description: 'Thức ăn chăn nuôi Appe JV',
    tech_phone: null,
    sale_phone: null,
    post_count: 15,
  },
  {
    id: 2,
    name: 'RTD',
    code: 'RTD',
    image: '',
    image_rectangular: '',
    description: 'Thức ăn chăn nuôi RTD',
    tech_phone: null,
    sale_phone: null,
    post_count: 8,
  },
];

// Mock posts data
const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Chỉ 1 triệu đồng',
    description: 'Bạn có tin: Chỉ 1 triệu đồng cho 1 tấn thức ăn chăn nuôi? Hãy cùng Appe JV tìm hiểu về cách nuôi dưỡng vật nuôi hiệu quả với thức ăn chất lượng cao...',
    content: 'Bạn có tin: Chỉ 1 triệu đồng cho 1 tấn thức ăn chăn nuôi? Hãy cùng Appe JV tìm hiểu về cách nuôi dưỡng vật nuôi hiệu quả với thức ăn chất lượng cao. Với công thức dinh dưỡng tối ưu và nguyên liệu tự nhiên, chúng tôi mang đến cho bạn những lựa chọn tốt nhất.',
    hashtag: '#appejvfeed #thucanchangnuoi #post #bancotin #1trieudongcho1tan',
    imageUrl: '',
    category: {
      code: 'HDMD',
      id: 1,
      name: 'Hiểu đúng mua đúng',
      sector: 'APPEJV',
    },
    created_at: '2024-02-01T10:00:00Z',
    hasImage: true,
    media_contents: [
      {
        id: 1,
        title: 'Sample Image',
        kind: 'image',
        content_id: 1,
        link: '',
        thumbnail: null,
        created_at: '2024-02-01T10:00:00Z',
      }
    ],
  },
  {
    id: 2,
    title: 'Bài viết mới nhất từ Appe JV',
    description: 'Khám phá những xu hướng mới nhất trong công nghệ sản xuất thức ăn chăn nuôi. Tìm hiểu cách áp dụng hiệu quả cho trang trại và hộ chăn nuôi.',
    content: 'Khám phá những xu hướng mới nhất trong công nghệ sản xuất thức ăn chăn nuôi. Tìm hiểu cách áp dụng hiệu quả cho trang trại và hộ chăn nuôi. Với nhiều năm kinh nghiệm, chúng tôi cam kết mang đến những giải pháp dinh dưỡng tốt nhất.',
    hashtag: '#appejv #thucanchangnuoi #congnghe',
    imageUrl: '',
    category: {
      code: 'NEWS',
      id: 2,
      name: 'Tin tức',
      sector: 'APPEJV',
    },
    created_at: '2024-02-01T08:00:00Z',
    hasImage: true,
    media_contents: [
      {
        id: 2,
        title: 'Latest News Image',
        kind: 'image',
        content_id: 2,
        link: '',
        thumbnail: null,
        created_at: '2024-02-01T08:00:00Z',
      }
    ],
  },
  {
    id: 3,
    title: 'Thức ăn chăn nuôi RTD - Dinh dưỡng tối ưu cho vật nuôi',
    description: 'RTD mang đến những sản phẩm thức ăn chăn nuôi chất lượng cao, đảm bảo dinh dưỡng tối ưu cho sự phát triển khỏe mạnh của vật nuôi.',
    content: 'RTD mang đến những sản phẩm thức ăn chăn nuôi chất lượng cao, đảm bảo dinh dưỡng tối ưu cho sự phát triển khỏe mạnh của vật nuôi. Với công thức khoa học và nguyên liệu tự nhiên, chúng tôi đảm bảo sự hài lòng của khách hàng.',
    hashtag: '#rtd #thucanchangnuoi #dinhdung',
    imageUrl: '',
    category: {
      code: 'PROD',
      id: 3,
      name: 'Sản phẩm',
      sector: 'ELT',
    },
    created_at: '2024-01-31T15:00:00Z',
    hasImage: true,
    media_contents: [
      {
        id: 3,
        title: 'Elevator Image',
        kind: 'image',
        content_id: 3,
        link: '',
        thumbnail: null,
        created_at: '2024-01-31T15:00:00Z',
      }
    ],
  },
];

// Utility functions
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(seconds)) {
    return '0 phút trước';
  }

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return `${interval} năm trước`;
  }

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} tháng trước`;
  }

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} ngày trước`;
  }

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} giờ trước`;
  }

  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} phút trước`;
  }

  if (seconds < 10) return 'vừa xong';

  return `${Math.floor(seconds)} giây trước`;
};

const stripHtmlTags = (html: string) => {
  if (!html) return '';
  const text = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
  return text.length > 80 ? text.substring(0, 80) + '...' : text;
};

export default function GalleryPage() {
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [posts] = useState<Post[]>(mockPosts);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: number]: number }>({});
  const [showOptions, setShowOptions] = useState(false);
  const [loading] = useState(false);
  const sectors = mockSectors;
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handleUserChange = (user: User) => {
    setCurrentUser(user);
  };

  const handleImageNavigation = (postId: number, direction: 'prev' | 'next') => {
    const post = posts.find(p => p.id === postId);
    if (!post?.media_contents) return;

    const currentIndex = currentImageIndexes[postId] || 0;
    const maxIndex = post.media_contents.length - 1;
    
    let newIndex = currentIndex;
    if (direction === 'next' && currentIndex < maxIndex) {
      newIndex = currentIndex + 1;
    } else if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }
    
    setCurrentImageIndexes(prev => ({
      ...prev,
      [postId]: newIndex
    }));
  };

  const handleCopyContent = async (post: Post) => {
    try {
      await navigator.clipboard.writeText(stripHtmlTags(post.content || ''));
      alert('Đã copy nội dung vào clipboard');
    } catch {
      alert('Không thể copy nội dung');
    }
    setShowOptions(false);
  };

  const handleShareContent = async (post: Post) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: stripHtmlTags(post.content || ''),
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(`${post.title}\n\n${stripHtmlTags(post.content || '')}`);
        alert('Đã copy nội dung để chia sẻ');
      }
    } catch {
      alert('Không thể chia sẻ nội dung');
    }
    setShowOptions(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Demo Role Switcher */}
      <RoleSwitcher currentUser={currentUser} onUserChange={handleUserChange} />

      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-center p-4">
          <h1 className="text-xl font-semibold text-white">Thư viện nội dung</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        {/* Sectors Header */}
        <div className="p-4">
          <div className="flex space-x-3">
            {sectors.map((sector) => (
              <div key={sector.id} className="bg-gray-700 rounded-lg p-4 flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {sector.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{sector.name}</p>
                    <p className="text-white text-xs opacity-80">{sector.post_count || 0} bài viết</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Không có bài viết nào</p>
            </div>
          ) : (
            posts.map((post) => {
              const currentIndex = currentImageIndexes[post.id] || 0;
              const mediaItems = post.media_contents || [];
              const sector = sectors.find(s => s.code === post.category?.sector);

              return (
                <div key={post.id} className="bg-white">
                  {/* User Info Bar */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {sector?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">
                        {sector?.name || 'Unknown'}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {post.created_at ? formatTimeAgo(post.created_at) : '0 phút trước'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setShowOptions(true);
                      }}
                      className="p-1"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>

                  {/* Post Image */}
                  {post.hasImage && mediaItems.length > 0 && (
                    <div className="relative aspect-square bg-gray-100">
                      <PlaceholderFrame 
                        text="replace holder"
                        className="w-full h-full rounded-none"
                        aspectRatio="1/1"
                        textSize="base"
                      />
                      
                      {/* Navigation arrows for multiple images */}
                      {mediaItems.length > 1 && (
                        <>
                          {currentIndex > 0 && (
                            <button
                              onClick={() => handleImageNavigation(post.id, 'prev')}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                          )}
                          
                          {currentIndex < mediaItems.length - 1 && (
                            <button
                              onClick={() => handleImageNavigation(post.id, 'next')}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          )}

                          {/* Dots indicator */}
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                            {mediaItems.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndexes(prev => ({ ...prev, [post.id]: index }))}
                                className={`w-2 h-2 rounded-full ${
                                  index === currentIndex ? 'bg-red-600' : 'bg-white bg-opacity-50'
                                }`}
                              />
                            ))}
                          </div>

                          {/* Image counter */}
                          <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {currentIndex + 1}/{mediaItems.length}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="p-4">
                    {/* Category */}
                    {post.category && (
                      <div className="mb-2">
                        <span className="inline-block bg-red-50 text-red-600 text-xs font-medium px-2 py-1 rounded-full border border-red-200">
                          {post.category.name}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    <div className="mb-2">
                      <p className="text-gray-900 text-sm leading-relaxed">
                        {post.description}
                        <button className="text-red-600 font-medium ml-1">
                          ... Xem chi tiết
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Options Modal */}
      {showOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-lg w-full max-w-md">
            <div className="p-4 space-y-2">
              <button
                onClick={() => {
                  if (selectedPost) {
                    handleCopyContent(selectedPost);
                  }
                }}
                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-900">Copy nội dung</span>
              </button>

              <button
                onClick={() => {
                  if (selectedPost) {
                    handleShareContent(selectedPost);
                  }
                }}
                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="text-gray-900">Chia sẻ</span>
              </button>

              <button
                onClick={() => setShowOptions(false)}
                className="w-full flex items-center justify-center p-3 text-gray-500 hover:bg-gray-50 rounded-lg border-t"
              >
                <span>Hủy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation user={currentUser} currentPage="gallery" />
    </div>
  );
}