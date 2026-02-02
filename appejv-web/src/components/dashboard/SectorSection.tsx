'use client';

import { Sector } from '@/types';

interface SectorSectionProps {
  sector: Sector;
}

export default function SectorSection({ sector }: SectorSectionProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleViewAll = () => {
    // Navigate to sector detail page
    console.log('Navigate to sector:', sector.id);
  };

  const handleComboClick = (comboId: number) => {
    // Navigate to combo detail page
    console.log('Navigate to combo:', comboId);
  };

  if (!sector.list_combos || sector.list_combos.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Sector Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {sector.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{sector.name}</h3>
            <p className="text-gray-600 text-sm">{sector.description}</p>
          </div>
        </div>
        
        <button
          onClick={handleViewAll}
          className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center space-x-1"
        >
          <span>Xem tất cả</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sector.list_combos.slice(0, 4).map((combo) => (
          <div
            key={combo.id}
            onClick={() => handleComboClick(combo.id)}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
          >
            {/* Product Image */}
            <div className="aspect-w-16 aspect-h-12 bg-gray-100">
              <img
                src={combo.image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400'}
                alt={combo.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400';
                }}
              />
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                {combo.name}
              </h4>
              
              {combo.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {combo.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-red-600">
                  {formatCurrency(combo.price)}
                </div>
                
                <div className="flex items-center space-x-1">
                  <svg className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-500">4.8</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Phổ biến
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Bảo hành 25 năm
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show more button if there are more than 4 combos */}
      {sector.list_combos.length > 4 && (
        <div className="mt-6 text-center">
          <button
            onClick={handleViewAll}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>Xem thêm {sector.list_combos.length - 4} sản phẩm</span>
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}