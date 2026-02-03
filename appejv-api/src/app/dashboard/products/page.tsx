'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase'
import { Product } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      // Mock data based on real APPE JV products
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'HH cho lợn sữa (7 ngày tuổi - 10kg)',
          description: 'Mã SP: A1 - Đạm 20% - Bao 20kg',
          price: 27100,
          sector_id: 1,
          image: null,
          created_at: '2024-05-11T00:00:00Z',
          updated_at: '2024-05-11T00:00:00Z',
          sector: { id: 1, name: 'Thức ăn gia súc', description: null, image: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
        },
        {
          id: 2,
          name: 'HH cho lợn con tập ăn (10 ngày tuổi - 20kg)',
          description: 'Mã SP: A2 - Đạm 19% - Bao 25kg',
          price: 18090,
          sector_id: 1,
          image: null,
          created_at: '2024-05-11T00:00:00Z',
          updated_at: '2024-05-11T00:00:00Z',
          sector: { id: 1, name: 'Thức ăn gia súc', description: null, image: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
        },
        {
          id: 16,
          name: 'HH cho gà công nghiệp 01 - 12 ngày tuổi',
          description: 'Mã SP: A2010 - Đạm 21% - Bao 25kg',
          price: 13480,
          sector_id: 2,
          image: null,
          created_at: '2024-07-15T00:00:00Z',
          updated_at: '2024-07-15T00:00:00Z',
          sector: { id: 2, name: 'Thức ăn gia cầm', description: null, image: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
        },
        {
          id: 17,
          name: 'HH cho gà công nghiệp 13 - 24 ngày tuổi',
          description: 'Mã SP: A2011 - Đạm 20% - Bao 25kg',
          price: 13180,
          sector_id: 2,
          image: null,
          created_at: '2024-07-15T00:00:00Z',
          updated_at: '2024-07-15T00:00:00Z',
          sector: { id: 2, name: 'Thức ăn gia cầm', description: null, image: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
        },
        {
          id: 14,
          name: 'Đậm đặc cao cấp cho lợn tập ăn - xuất chuồng',
          description: 'Mã SP: A999 - Đạm 46% - Bao 25kg',
          price: 18770,
          sector_id: 1,
          image: null,
          created_at: '2024-05-11T00:00:00Z',
          updated_at: '2024-05-11T00:00:00Z',
          sector: { id: 1, name: 'Thức ăn gia súc', description: null, image: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' }
        }
      ]
      
      setProducts(mockProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  const getSectorBadgeColor = (sectorName: string) => {
    switch (sectorName) {
      case 'Thức ăn gia súc':
        return 'bg-green-100 text-green-800'
      case 'Thức ăn gia cầm':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-600 mt-1">Quản lý danh mục sản phẩm thức ăn chăn nuôi</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Thêm sản phẩm
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select className="input-field w-48">
            <option value="">Tất cả lĩnh vực</option>
            <option value="1">Thức ăn gia súc</option>
            <option value="2">Thức ăn gia cầm</option>
          </select>
          <select className="input-field w-48">
            <option value="">Sắp xếp theo</option>
            <option value="name">Tên sản phẩm</option>
            <option value="price">Giá</option>
            <option value="created_at">Ngày tạo</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-3">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSectorBadgeColor(product.sector?.name || '')}`}>
                {product.sector?.name}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {product.name}
            </h3>

            {product.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(product.price)} đ
                </p>
                <p className="text-xs text-gray-500">
                  Cập nhật: {new Date(product.updated_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc thêm sản phẩm mới</p>
          <button className="btn-primary">
            Thêm sản phẩm đầu tiên
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredProducts.length}</span> trong tổng số <span className="font-medium">{products.length}</span> sản phẩm
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn-secondary">Trước</button>
            <button className="btn-primary">1</button>
            <button className="btn-secondary">Sau</button>
          </div>
        </div>
      )}
    </div>
  )
}