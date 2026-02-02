'use client';

import { Sector } from '@/types';

interface BrandSelectorProps {
  sectors: Sector[];
}

export default function BrandSelector({ sectors }: BrandSelectorProps) {
  const handleBrandClick = (sectorId: number) => {
    console.log('Navigate to brand:', sectorId);
  };

  return (
    <div className="px-4">
      <div className="flex justify-between space-x-4">
        {sectors.map((sector) => (
          <button
            key={sector.id}
            onClick={() => window.location.href = '/products'}
            className={`flex-1 h-12 rounded-lg flex items-center justify-center shadow-sm transition-colors hover:opacity-80 ${
              sector.id === 2 
                ? 'bg-yellow-400' 
                : sector.id === 1 
                ? 'bg-green-500' 
                : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-center h-8 px-3">
              <span className={`text-sm font-bold ${
                sector.id === 2 
                  ? 'text-white' 
                  : sector.id === 1 
                  ? 'text-white' 
                  : 'text-gray-700'
              }`}>
                {sector.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}