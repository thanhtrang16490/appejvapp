'use client';

import { useState, useEffect, useMemo } from 'react';
import { User, Combo } from '@/types';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { PlaceholderFrame } from '@/components/ui';
import { mockSectorService } from '@/services/mock-sector';
import { products as productService } from '@/services';

// Default user - Admin
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

interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
}

const productCategories: ProductCategory[] = [
  {
    id: 'gia-suc',
    name: 'Thức ăn gia súc',
    description: 'Thức ăn hỗn hợp và đậm đặc cho lợn, bò',
    icon: '🐷',
    backgroundColor: '#22C55E',
    textColor: 'white',
  },
  {
    id: 'gia-cam',
    name: 'Thức ăn gia cầm',
    description: 'Thức ăn hỗn hợp cho gà, vịt, ngan',
    icon: '🐔',
    backgroundColor: '#F59E0B',
    textColor: 'white',
  },
];

export default function ProductsPage() {
  const [currentUser] = useState<User>(defaultUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [allProducts, setAllProducts] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load real product data from APPE JV sectors
    const loadData = async () => {
      try {
        const allCombos = await productService.getAllProducts();
        setAllProducts(allCombos as Combo[]);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to mock data if API fails
        try {
          const fallbackCombos = await mockSectorService.getAllCombos();
          setAllProducts(fallbackCombos);
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter products based on search query and category
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryId = selectedCategory === 'gia-suc' ? 1 : 2;
      filtered = filtered.filter(product => product.sector_id === categoryId);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [allProducts, selectedCategory, searchQuery]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const getProductsByCategory = (sectorId: number, limit?: number) => {
    const products = allProducts.filter(product => product.sector_id === sectorId);
    return limit ? products.slice(0, limit) : products;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-7 h-7 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Sản phẩm APPE JV</h1>
          <button className="p-2 -mr-2">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-gray-600">?</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm thức ăn chăn nuôi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-4 mb-6">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              Tất cả ({allProducts.length})
            </button>
            {productCategories.map((category) => {
              const count = allProducts.filter(p => 
                p.sector_id === (category.id === 'gia-suc' ? 1 : 2)
              ).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'text-white'
                      : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id ? category.backgroundColor : undefined
                  }}
                >
                  {category.icon} {category.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* APPE JV Brand Banner */}
        <div className="mx-4 mb-6">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">APPE JV VIETNAM</h2>
                <p className="text-green-100 mb-3">Thức ăn chăn nuôi chất lượng cao</p>
                <div className="flex items-center text-sm text-green-100">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Hà Nam, Việt Nam
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{allProducts.length}</div>
                <div className="text-sm text-green-100">Sản phẩm</div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            {/* Search Results or Category View */}
            {searchQuery.trim() ? (
              <div className="px-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Kết quả tìm kiếm &quot;{searchQuery}&quot; ({filteredProducts.length})
                  </h2>
                  {filteredProducts.length > 0 && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Xóa tìm kiếm
                    </button>
                  )}
                </div>
                
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                    <p className="text-gray-500 mb-4">Thử tìm kiếm với từ khóa khác</p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Xem tất cả sản phẩm
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => window.location.href = `/product/${product.id}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        <div className="relative">
                          <PlaceholderFrame 
                            text="replace holder"
                            className="w-full h-32 rounded-none"
                            aspectRatio="none"
                            textSize="xs"
                          />
                          <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
                            {product.sector_id === 1 ? '🐷 Gia súc' : '🐔 Gia cầm'}
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                            {product.description}
                          </p>
                          <p className="text-sm font-bold text-green-600">
                            {formatCurrency(product.price)} đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Category Sections */}
                {selectedCategory === 'all' ? (
                  <>
                    {/* Thức ăn gia súc Section */}
                    <div className="px-4 mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">🐷</span>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">Thức ăn gia súc</h2>
                            <p className="text-sm text-gray-500">Thức ăn hỗn hợp và đậm đặc cho lợn, bò</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedCategory('gia-suc')}
                          className="flex items-center text-green-600 hover:text-green-700"
                        >
                          <span className="text-sm font-medium mr-1">Tất cả</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {getProductsByCategory(1, 6).map((product, index) => (
                          <div
                            key={product.id}
                            onClick={() => window.location.href = `/product/${product.id}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                          >
                            <div className="relative">
                              <PlaceholderFrame 
                                text="replace holder"
                                className="w-full h-32 rounded-none"
                                aspectRatio="none"
                                textSize="xs"
                              />
                              {index === 0 && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                  BÁN CHẠY
                                </div>
                              )}
                              {index === 1 && (
                                <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                  MỚI
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                                {product.description}
                              </p>
                              <p className="text-sm font-bold text-green-600">
                                {formatCurrency(product.price)} đ
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Thức ăn gia cầm Section */}
                    <div className="px-4 mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">🐔</span>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">Thức ăn gia cầm</h2>
                            <p className="text-sm text-gray-500">Thức ăn hỗn hợp cho gà, vịt, ngan</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedCategory('gia-cam')}
                          className="flex items-center text-amber-600 hover:text-amber-700"
                        >
                          <span className="text-sm font-medium mr-1">Tất cả</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {getProductsByCategory(2, 6).map((product, index) => (
                          <div
                            key={product.id}
                            onClick={() => window.location.href = `/product/${product.id}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                          >
                            <div className="relative">
                              <PlaceholderFrame 
                                text="replace holder"
                                className="w-full h-32 rounded-none"
                                aspectRatio="none"
                                textSize="xs"
                              />
                              {index === 0 && (
                                <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                  CHẤT LƯỢNG
                                </div>
                              )}
                              {index === 1 && (
                                <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                  PHỔ BIẾN
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                                {product.description}
                              </p>
                              <p className="text-sm font-bold text-amber-600">
                                {formatCurrency(product.price)} đ
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Single Category View */
                  <div className="px-4">
                    <div className="mb-6">
                      {selectedCategory === 'gia-suc' ? (
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2">🐷</span>
                            <h2 className="text-xl font-bold text-green-800">Thức ăn gia súc</h2>
                          </div>
                          <p className="text-green-700 text-sm">
                            Thức ăn hỗn hợp và đậm đặc cho lợn, bò các giai đoạn phát triển. 
                            Sản phẩm được nghiên cứu với công thức dinh dưỡng cân bằng, 
                            giúp tối ưu hóa tỷ lệ chuyển đổi thức ăn và tăng trọng nhanh.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2">🐔</span>
                            <h2 className="text-xl font-bold text-amber-800">Thức ăn gia cầm</h2>
                          </div>
                          <p className="text-amber-700 text-sm">
                            Thức ăn hỗn hợp cho gà, vịt, ngan các giai đoạn phát triển. 
                            Được phân chia theo từng giai đoạn với hàm lượng đạm phù hợp, 
                            đảm bảo gia cầm phát triển đều và đạt hiệu quả kinh tế cao.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => window.location.href = `/product/${product.id}`}
                          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        >
                          <div className="relative">
                            <PlaceholderFrame 
                              text="replace holder"
                              className="w-full h-32 rounded-none"
                              aspectRatio="none"
                              textSize="xs"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                              {product.name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                              {product.description}
                            </p>
                            <p className="text-sm font-bold text-green-600">
                              {formatCurrency(product.price)} đ
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation user={currentUser} currentPage="products" />
    </div>
  );
}