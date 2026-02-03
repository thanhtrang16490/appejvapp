'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { User, Combo } from '@/types';
import { PlaceholderFrame } from '@/components/ui';
import { mockSectorService } from '@/services/mock-sector';
import { products as productService } from '@/services';

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

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  
  const [currentUser] = useState<User>(defaultUser);
  const [product, setProduct] = useState<Combo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Load real product data from APPE JV sectors
    const loadProduct = async () => {
      try {
        const foundProduct = await productService.getProductById(productId.toString());
        setProduct(foundProduct as Combo | null);
      } catch (error) {
        console.error('Error loading product:', error);
        // Fallback to mock data if API fails
        try {
          const allCombos = await mockSectorService.getAllCombos();
          const foundProduct = allCombos.find(combo => combo.id === productId);
          setProduct(foundProduct || null);
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const getProductCode = (description: string) => {
    const match = description.match(/Mã SP: ([A-Z0-9-]+)/);
    return match ? match[1] : '';
  };

  const getProteinContent = (description: string) => {
    const match = description.match(/Đạm (\d+(?:\.\d+)?)%/);
    return match ? `${match[1]}%` : '';
  };

  const getBagSize = (description: string) => {
    const match = description.match(/Bao (\d+)kg/);
    return match ? `${match[1]}kg` : '';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: `Xem sản phẩm: ${product.name} - Giá: ${formatCurrency(product.price)} đ`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      if (product) {
        const shareText = `${product.name} - Giá: ${formatCurrency(product.price)} đ\n${window.location.href}`;
        await navigator.clipboard.writeText(shareText);
        alert('Đã copy thông tin sản phẩm vào clipboard');
      }
    }
  };

  const handleAddCustomer = () => {
    // Navigate to quotation with product pre-selected
    window.location.href = `/quotation?productId=${productId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-3"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 text-lg">Không tìm thấy sản phẩm thức ăn chăn nuôi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 relative">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => window.location.href = '/products'}
            className="p-2"
          >
            <svg className="w-7 h-7 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1"></div>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2"
          >
            <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-48">
            <button
              onClick={() => {
                window.location.href = '/products';
                setShowMenu(false);
              }}
              className="w-full flex items-center px-4 py-3 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span className="text-gray-900">Xem sản phẩm khác</span>
            </button>
            <button
              onClick={() => {
                window.location.href = '/';
                setShowMenu(false);
              }}
              className="w-full flex items-center px-4 py-3 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-gray-900">Về trang chủ</span>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        {/* Product Image */}
        <div className="bg-white p-2 pt-3">
          <div className="aspect-square bg-white rounded-2xl overflow-hidden px-1 py-0.5">
            <PlaceholderFrame 
              text="replace holder"
              className="w-full h-full rounded-2xl"
              aspectRatio="1/1"
              textSize="lg"
            />
          </div>
        </div>

        {/* Authenticity Notice */}
        <div className="bg-gray-50 px-3 py-2 border-b border-gray-100">
          <p className="text-center text-gray-600 text-sm italic">
            Sản phẩm 100% chính hãng, đảm bảo chất lượng dinh dưỡng cho vật nuôi
          </p>
        </div>

        {/* Product Information */}
        <div className="bg-white p-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <p className="text-2xl font-bold text-red-600 mb-3">
            {formatCurrency(product.price)} đ
          </p>

          <div className="py-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}. Sản phẩm được đóng bao {getBagSize(product.description || '')}. 
              Phí vận chuyển và các chi phí khác (nếu có) sẽ được thông báo tới quý khách hàng. 
              Sản phẩm được bảo quản trong kho khô ráo, thoáng mát.
            </p>
          </div>

          {/* Description Section */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                MÔ TẢ SẢN PHẨM
              </h2>
              <button 
                onClick={() => window.location.href = `/quotation?productId=${productId}`}
                className="text-xs font-medium text-red-600"
              >
                Xem báo giá
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Tên sản phẩm</p>
                <p className="text-sm text-gray-900">{product.name}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Mã sản phẩm</p>
                <p className="text-sm text-gray-900">{getProductCode(product.description || '')}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Hàm lượng đạm</p>
                <p className="text-sm text-gray-900">{getProteinContent(product.description || '')}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Quy cách đóng gói</p>
                <p className="text-sm text-gray-900">Bao {getBagSize(product.description || '')}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Nguyên liệu chính</p>
                <p className="text-sm text-gray-900">
                  {product.sector_id === 1 
                    ? 'Ngô, cám gạo, bột cá, bột đậu tương, premix vitamin và khoáng chất, amino acid tổng hợp, enzyme tiêu hóa, chất chống oxy hóa.'
                    : 'Ngô, cám gạo, bột cá, bột đậu tương, premix vitamin và khoáng chất, amino acid tổng hợp, enzyme tiêu hóa, chất chống oxy hóa, men tiêu hóa.'
                  }
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Hướng dẫn sử dụng</p>
                <p className="text-sm text-gray-900">
                  {product.sector_id === 1 
                    ? 'Cho ăn tự do hoặc theo định lượng 3-4 lần/ngày. Lượng thức ăn tùy theo giai đoạn phát triển của lợn. Luôn đảm bảo nước sạch cho lợn uống.'
                    : 'Cho ăn tự do hoặc theo định lượng 3-4 lần/ngày. Lượng thức ăn tùy theo giai đoạn phát triển của gia cầm. Luôn đảm bảo nước sạch cho gia cầm uống.'
                  }
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Bảo quản</p>
                <p className="text-sm text-gray-900">
                  Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và độ ẩm cao. 
                  Sử dụng trong vòng 3 tháng kể từ ngày sản xuất.
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Lưu ý</p>
                <p className="text-sm text-gray-900">
                  Sản phẩm đạt tiêu chuẩn TCVN và được kiểm định chất lượng. 
                  Để được tư vấn chi tiết về chương trình dinh dưỡng {product.sector_id === 1 ? 'lợn' : 'gia cầm'}, 
                  vui lòng liên hệ hotline 03513 595 030
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Thông tin liên hệ</p>
                <div className="text-sm text-gray-900 space-y-1">
                  <p className="font-semibold">CÔNG TY CỔ PHẦN APPE JV VIỆT NAM</p>
                  <p>Địa chỉ: Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam</p>
                  <p>Điện thoại: 03513 595 030 | Fax: 03513 835 990</p>
                  <p>Website: <a href="http://www.appe.vn" className="text-red-600 underline">www.appe.vn</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="w-11 h-11 border border-gray-300 rounded flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>

          <button
            onClick={handleAddCustomer}
            className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded flex items-center justify-center hover:bg-red-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-semibold">Liên hệ tư vấn dinh dưỡng</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation - Hidden on product detail */}
      {/* <BottomNavigation user={currentUser} currentPage="products" /> */}
    </div>
  );
}