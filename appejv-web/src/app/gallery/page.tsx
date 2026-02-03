'use client';

import { useState } from 'react';
import { User } from '@/types';
import BottomNavigation from '@/components/layout/BottomNavigation';
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
  address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam',
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

// Mock posts data
const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Thức ăn chăn nuôi APPE JV - Giải pháp dinh dưỡng tối ưu',
    description: 'APPE JV mang đến những sản phẩm thức ăn chăn nuôi chất lượng cao với công thức dinh dưỡng cân bằng, giúp vật nuôi phát triển khỏe mạnh và đạt hiệu quả kinh tế tối ưu.',
    content: 'APPE JV mang đến những sản phẩm thức ăn chăn nuôi chất lượng cao với công thức dinh dưỡng cân bằng, giúp vật nuôi phát triển khỏe mạnh và đạt hiệu quả kinh tế tối ưu. Với nhiều năm kinh nghiệm trong ngành chăn nuôi, chúng tôi cam kết cung cấp những giải pháp dinh dưỡng tốt nhất cho từng giai đoạn phát triển của vật nuôi.',
    hashtag: '#appejv #thucanchangnuoi #dinhdung #chatluong',
    imageUrl: '',
    category: {
      code: 'PROD',
      id: 1,
      name: 'Sản phẩm',
      sector: 'APPEJV',
    },
    created_at: '2024-02-03T10:00:00Z',
    hasImage: true,
    media_contents: [
      {
        id: 1,
        title: 'APPE JV Products',
        kind: 'image',
        content_id: 1,
        link: '',
        thumbnail: null,
        created_at: '2024-02-03T10:00:00Z',
      }
    ],
  },
  {
    id: 2,
    title: 'Hướng dẫn chăn nuôi lợn hiệu quả với thức ăn APPE JV',
    description: 'Tìm hiểu cách sử dụng thức ăn hỗn hợp APPE JV để tối ưu hóa tỷ lệ chuyển đổi thức ăn và tăng trọng nhanh cho lợn ở mọi giai đoạn phát triển.',
    content: 'Thức ăn hỗn hợp APPE JV được nghiên cứu và sản xuất theo công nghệ tiên tiến, đảm bảo cung cấp đầy đủ dinh dưỡng cho lợn ở mọi giai đoạn phát triển. Với hàm lượng đạm từ 13-20%, sản phẩm giúp tối ưu hóa tỷ lệ chuyển đổi thức ăn và tăng trọng nhanh. Hướng dẫn chi tiết cách sử dụng và liều lượng phù hợp cho từng giai đoạn.',
    hashtag: '#appejv #channoilon #huongdan #tangtrong',
    imageUrl: '',
    category: {
      code: 'GUIDE',
      id: 2,
      name: 'Hướng dẫn',
      sector: 'APPEJV',
    },
    created_at: '2024-02-02T15:30:00Z',
    hasImage: true,
    media_contents: [
      {
        id: 2,
        title: 'Pig Farming Guide',
        kind: 'image',
        content_id: 2,
        link: '',
        thumbnail: null,
        created_at: '2024-02-02T15:30:00Z',
      }
    ],
  },
  {
    id: 3,
    title: 'Thức ăn gia cầm APPE JV - Chất lượng vượt trội',
    description: 'Khám phá dòng sản phẩm thức ăn gia cầm APPE JV với công thức đặc biệt dành cho gà, vịt, ngan các giai đoạn phát triển.',
    content: 'Thức ăn hỗn hợp cho gà, vịt, ngan APPE JV được thiết kế phù hợp với đặc điểm sinh lý của gia cầm. Với công thức dinh dưỡng cân bằng và hàm lượng đạm từ 17-21%, sản phẩm giúp gia cầm phát triển đều, tăng trọng nhanh và đạt hiệu quả kinh tế cao. Đặc biệt phù hợp cho chăn nuôi quy mô công nghiệp.',
    hashtag: '#appejv #thucangiacam #ga #vit #ngan',
    imageUrl: '',
    category: {
      code: 'PROD',
      id: 3,
      name: 'Sản phẩm',
      sector: 'APPEJV',
    },
    created_at: '2024-02-01T09:15:00Z',
    hasImage: true,
    media_contents: [
      {
        id: 3,
        title: 'Poultry Feed Products',
        kind: 'image',
        content_id: 3,
        link: '',
        thumbnail: null,
        created_at: '2024-02-01T09:15:00Z',
      }
    ],
  },
  {
    id: 4,
    title: 'Công nghệ sản xuất thức ăn chăn nuôi hiện đại tại APPE JV',
    description: 'Tìm hiểu về quy trình sản xuất thức ăn chăn nuôi hiện đại với công nghệ tiên tiến và kiểm soát chất lượng nghiêm ngặt tại APPE JV.',
    content: 'APPE JV áp dụng công nghệ sản xuất hiện đại với dây chuyền tự động, đảm bảo chất lượng sản phẩm ổn định. Quy trình kiểm soát chất lượng nghiêm ngặt từ khâu nguyên liệu đầu vào đến sản phẩm hoàn thiện. Tất cả sản phẩm đều được kiểm tra dinh dưỡng và an toàn thực phẩm theo tiêu chuẩn quốc tế.',
    hashtag: '#appejv #congnghe #sanxuat #chatluong',
    imageUrl: '',
    category: {
      code: 'NEWS',
      id: 4,
      name: 'Tin tức',
      sector: 'APPEJV',
    },
    created_at: '2024-01-31T14:20:00Z',
    hasImage: true,
    media_contents: [
      {
        id: 4,
        title: 'Production Technology',
        kind: 'image',
        content_id: 4,
        link: '',
        thumbnail: null,
        created_at: '2024-01-31T14:20:00Z',
      }
    ],
  },
  {
    id: 5,
    title: 'Lợi ích của thức ăn đậm đặc cao cấp A999',
    description: 'Thức ăn đậm đặc A999 với hàm lượng đạm lên đến 46% là giải pháp tối ưu cho việc bổ sung dinh dưỡng cho lợn.',
    content: 'Thức ăn đậm đặc A999 với hàm lượng đạm lên đến 46% là giải pháp tối ưu cho việc bổ sung dinh dưỡng cho lợn. Sản phẩm giúp cải thiện sức khỏe đường ruột, tăng cường hệ miễn dịch và nâng cao hiệu quả chăn nuôi. Đặc biệt hiệu quả cho lợn từ giai đoạn tập ăn đến xuất chuồng.',
    hashtag: '#appejv #A999 #damdac #protein #lon',
    imageUrl: '',
    category: {
      code: 'PROD',
      id: 5,
      name: 'Sản phẩm',
      sector: 'APPEJV',
    },
    created_at: '2024-01-30T11:45:00Z',
    hasImage: true,
    media_contents: [
      {
        id: 5,
        title: 'A999 Concentrate Feed',
        kind: 'image',
        content_id: 5,
        link: '',
        thumbnail: null,
        created_at: '2024-01-30T11:45:00Z',
      }
    ],
  },
  {
    id: 6,
    title: 'Chăn nuôi bò thịt hiệu quả với thức ăn A618',
    description: 'Thức ăn hỗn hợp A618 dành cho bò thịt được thiết kế đặc biệt với hàm lượng đạm 16%, phù hợp với nhu cầu dinh dưỡng của bò.',
    content: 'Thức ăn hỗn hợp A618 dành cho bò thịt được thiết kế đặc biệt với hàm lượng đạm 16%, phù hợp với nhu cầu dinh dưỡng của bò trong giai đoạn nuôi thịt. Sản phẩm giúp bò phát triển khỏe mạnh, tăng trọng đều và đạt trọng lượng xuất chuồng tối ưu. Công thức cân bằng giúp tiết kiệm chi phí chăn nuôi.',
    hashtag: '#appejv #A618 #bo #thit #changnuoi',
    imageUrl: '',
    category: {
      code: 'GUIDE',
      id: 6,
      name: 'Hướng dẫn',
      sector: 'APPEJV',
    },
    created_at: '2024-01-29T16:10:00Z',
    hasImage: true,
    media_contents: [
      {
        id: 6,
        title: 'Cattle Feed A618',
        kind: 'image',
        content_id: 6,
        link: '',
        thumbnail: null,
        created_at: '2024-01-29T16:10:00Z',
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
  const [currentUser] = useState<User>(defaultUser);
  const [posts] = useState<Post[]>(mockPosts);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: number]: number }>({});
  const [showOptions, setShowOptions] = useState(false);
  const [loading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-center p-4">
          <h1 className="text-xl font-semibold text-white">Thư viện nội dung</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
       

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

              return (
                <div key={post.id} className="bg-white">
                  {/* User Info Bar */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">A</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 text-sm">APPE JV</span>
                        <div className="flex items-center text-xs text-gray-500">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Hà Nam • {post.created_at ? formatTimeAgo(post.created_at) : '0 phút trước'}
                        </div>
                      </div>
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
                        <span className="inline-block bg-green-50 text-green-600 text-xs font-medium px-2 py-1 rounded-full border border-green-200">
                          {post.category.name}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    <div className="mb-2">
                      <p className="text-gray-900 text-sm leading-relaxed">
                        {post.description}
                        <button className="text-green-600 font-medium ml-1">
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