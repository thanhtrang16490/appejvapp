'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import BottomNavigation from '@/components/layout/BottomNavigation';
import RoleSwitcher from '@/components/demo/RoleSwitcher';
import { PlaceholderFrame } from '@/components/ui';

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
  address: '123 Đường ABC, Quận 1, TP.HCM',
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ED1C24&color=fff',
};

interface ProductLine {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

interface NewProduct {
  id: string;
  action: string;
  mainText: string;
  buttonText: string;
  backgroundColor: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  tag?: string;
}

const productLines: ProductLine[] = [
  {
    id: '1',
    name: 'Appe JV',
    image: '',
    productCount: 16,
  },
  {
    id: '2',
    name: 'RTD',
    image: '',
    productCount: 12,
  },
];

const newProducts: NewProduct[] = [
  {
    id: '1',
    action: 'Thức ăn chăn nuôi',
    mainText: 'GIẢI PHÁP MỚI',
    buttonText: 'Xem ngay',
    backgroundColor: '#D9261C',
  },
  {
    id: '2',
    action: 'Dinh dưỡng vật nuôi',
    mainText: 'CÔNG NGHỆ VƯỢT TRỘI',
    buttonText: 'Tìm hiểu',
    backgroundColor: '#D9261C',
  },
  {
    id: '3',
    action: 'Sản phẩm mới',
    mainText: 'TIẾT KIỆM CHI PHÍ',
    buttonText: 'Chi tiết',
    backgroundColor: '#D9261C',
  },
];

const bestSellingProducts: Product[] = [
  {
    id: 1,
    name: 'Thức ăn heo con CP59 (3-5kg)',
    price: 18500,
    image: '',
    tag: 'BÁN CHẠY',
  },
  {
    id: 2,
    name: 'Thức ăn heo thịt CP59 (20-40kg)',
    price: 16800,
    image: '',
    tag: 'MỚI',
  },
  {
    id: 3,
    name: 'Thức ăn heo nái mang thai CP59',
    price: 17200,
    image: '',
    tag: 'CHẤT LƯỢNG',
  },
  {
    id: 4,
    name: 'Thức ăn heo hoàn thiện CP59',
    price: 15900,
    image: '',
  },
];

export default function ProductsPage() {
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNewProductIndex, setActiveNewProductIndex] = useState(0);

  const handleUserChange = (user: User) => {
    setCurrentUser(user);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Auto-scroll new products carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNewProductIndex((prev) => (prev + 1) % newProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Role Switcher */}
      <RoleSwitcher currentUser={currentUser} onUserChange={handleUserChange} />

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
          <h1 className="text-xl font-bold text-gray-900">Sản phẩm</h1>
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
              placeholder="Bạn muốn tìm sản phẩm nào?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Sale Banner */}
        <div className="mx-4 mb-4">
          <div className="h-32 bg-yellow-400 rounded-lg flex items-center justify-center">
            <h2 className="text-4xl font-bold text-black tracking-widest">S A L E</h2>
          </div>
        </div>

        {/* Brand Cards */}
        <div className="px-4 mb-6">
          <div className="flex space-x-4">
            {productLines.map((line, index) => (
              <button
                key={line.id}
                onClick={() => window.location.href = `/product/${line.id}`}
                className={`flex-1 h-12 rounded-lg flex items-center justify-center shadow-sm transition-colors hover:opacity-80 ${
                  index === 1 
                    ? 'bg-yellow-400' 
                    : index === 0 
                    ? 'bg-green-500' 
                    : 'bg-white'
                }`}
              >
                <span className={`text-sm font-bold ${
                  index === 1 || index === 0 ? 'text-white' : 'text-gray-700'
                }`}>
                  {line.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* New Products Section */}
        <div className="px-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm mới</h2>
          
          {/* Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeNewProductIndex * 100}%)` }}
              >
                {newProducts.map((product) => (
                  <div key={product.id} className="w-full flex-shrink-0">
                    <div 
                      className="h-40 rounded-lg flex items-center justify-end p-6 text-white relative overflow-hidden"
                      style={{ backgroundColor: product.backgroundColor }}
                    >
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      <div className="text-right relative z-10">
                        <p className="text-sm opacity-90 mb-1">{product.action}</p>
                        <h3 className="text-xl font-bold mb-3">{product.mainText}</h3>
                        <button className="bg-yellow-400 text-white px-4 py-2 rounded-full text-sm font-medium border border-white flex items-center">
                          {product.buttonText}
                          <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center mt-4 space-x-2">
              {newProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveNewProductIndex(index)}
                  className={`h-0.5 rounded-full transition-all ${
                    index === activeNewProductIndex
                      ? 'w-4 bg-red-600'
                      : 'w-3 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Best Selling Section */}
        <div className="px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bán chạy</h2>
          
          {/* Appe JV Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-gray-500 uppercase">Appe JV</span>
              <button className="flex items-center text-red-600 hover:text-red-700">
                <span className="text-sm font-medium mr-1">Tất cả</span>
                <img
                  src="/images/arrow-icon.png"
                  alt="Arrow"
                  className="w-5 h-5"
                />
              </button>
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {bestSellingProducts.slice(0, 2).map((product) => (
                <div
                  key={product.id}
                  onClick={() => window.location.href = `/product/${product.id}`}
                  className="flex-shrink-0 w-40 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <PlaceholderFrame 
                      text="replace holder"
                      className="w-full h-32 rounded-none"
                      aspectRatio="none"
                      textSize="xs"
                    />
                    {product.tag && (
                      <div className="absolute top-2 left-0 bg-white px-2 py-1 rounded-r text-xs font-semibold">
                        {product.tag}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="text-sm font-bold text-red-600">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RTD Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-gray-500 uppercase">RTD</span>
              <button className="flex items-center text-red-600 hover:text-red-700">
                <span className="text-sm font-medium mr-1">Tất cả</span>
                <img
                  src="/images/arrow-icon.png"
                  alt="Arrow"
                  className="w-5 h-5"
                />
              </button>
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {bestSellingProducts.slice(2, 4).map((product) => (
                <div
                  key={product.id}
                  onClick={() => window.location.href = `/product/${product.id}`}
                  className="flex-shrink-0 w-40 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <PlaceholderFrame 
                      text="replace holder"
                      className="w-full h-32 rounded-none"
                      aspectRatio="none"
                      textSize="xs"
                    />
                    {product.tag && (
                      <div className="absolute top-2 left-0 bg-white px-2 py-1 rounded-r text-xs font-semibold">
                        {product.tag}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="text-sm font-bold text-red-600">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation user={currentUser} currentPage="products" />
    </div>
  );
}