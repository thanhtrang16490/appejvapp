'use client';

import { useMemo } from 'react';

interface InventoryDisplayProps {
  stockQuantity: number;
  minStockLevel?: number;
  showWarning?: boolean;
  size?: 'sm' | 'md' | 'lg';
  unit?: string;
}

type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'updating';

export default function InventoryDisplay({ 
  stockQuantity, 
  minStockLevel = 0, 
  showWarning = true, 
  size = 'md',
  unit = 'bao'
}: InventoryDisplayProps) {
  
  const inventoryStatus: InventoryStatus = useMemo(() => {
    if (stockQuantity === undefined || stockQuantity === null) {
      return 'updating';
    }
    if (stockQuantity <= 0) {
      return 'out_of_stock';
    }
    if (stockQuantity <= minStockLevel) {
      return 'low_stock';
    }
    return 'in_stock';
  }, [stockQuantity, minStockLevel]);

  const getStatusConfig = () => {
    switch (inventoryStatus) {
      case 'out_of_stock':
        return {
          text: 'Hết hàng',
          bgColor: 'bg-red-100',
          textColor: 'text-red-600',
          showQuantity: false
        };
      case 'low_stock':
        return {
          text: `Tồn kho: ${stockQuantity} ${unit}`,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-600',
          showQuantity: true
        };
      case 'updating':
        return {
          text: 'Đang cập nhật',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          showQuantity: false
        };
      default: // in_stock
        return {
          text: `Tồn kho: ${stockQuantity} ${unit}`,
          bgColor: 'bg-green-100',
          textColor: 'text-green-600',
          showQuantity: true
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-sm px-3 py-2';
      default: // md
        return 'text-xs px-2 py-1';
    }
  };

  const statusConfig = getStatusConfig();
  const sizeClasses = getSizeClasses();

  return (
    <div className="flex items-center space-x-2">
      <span 
        className={`inline-flex items-center rounded-full font-medium ${statusConfig.bgColor} ${statusConfig.textColor} ${sizeClasses}`}
      >
        {statusConfig.text}
      </span>
      
      {/* Low stock warning indicator */}
      {showWarning && inventoryStatus === 'low_stock' && (
        <span className="text-red-600 text-xs font-medium flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Sắp hết hàng
        </span>
      )}
    </div>
  );
}