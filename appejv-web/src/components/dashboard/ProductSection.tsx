'use client';

import { Sector } from '@/types';
import { PlaceholderFrame, InventoryDisplay } from '@/components/ui';

interface ProductSectionProps {
  sector: Sector;
}

export default function ProductSection({ sector }: ProductSectionProps) {
  const formatCurrency = (amount: number) => {
    const roundedAmount = Math.round(amount / 1000) * 1000;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(roundedAmount);
  };

  const getProductTag = () => {
    // No tag for products
    return null;
  };

  if (!sector.products || sector.products.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
          {sector.name}
        </h3>
        <button
          onClick={() => window.location.href = '/products'}
          className="flex items-center text-red-600 text-sm font-medium hover:text-red-700"
        >
          <span>Tất cả</span>
          <img
            src="/images/arrow-icon.png"
            alt="Arrow"
            className="w-5 h-5 ml-2"
          />
        </button>
      </div>

      {/* Products horizontal scroll */}
      <div className="overflow-x-auto">
        <div className="flex space-x-4 px-4 pb-4">
          {sector.products.map((product) => (
            <div
              key={product.id}
              onClick={() => window.location.href = `/product/${product.id}`}
              className="flex-shrink-0 w-32 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
            >
              {/* Product image */}
              <div className="relative w-full h-32">
                <PlaceholderFrame 
                  text="replace holder"
                  className="w-full h-full rounded-none"
                  aspectRatio="none"
                  textSize="xs"
                />
                {/* Tag */}
                {getProductTag() && (
                  <div className="absolute top-2 left-0 bg-white px-2 py-1 rounded-r">
                    <span className="text-xs font-semibold text-black">
                      {getProductTag()}
                    </span>
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="p-3">
                <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h4>
                <p className="text-sm font-bold text-red-600 mb-1">
                  {formatCurrency(product.price)}
                </p>
                {/* Inventory info */}
                {product.stock_quantity !== undefined ? (
                  <InventoryDisplay 
                    stockQuantity={product.stock_quantity}
                    minStockLevel={product.min_stock_level || 0}
                    size="sm"
                    unit={product.unit || 'bao'}
                    showWarning={false}
                  />
                ) : (
                  <InventoryDisplay 
                    stockQuantity={0}
                    size="sm"
                    showWarning={false}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}