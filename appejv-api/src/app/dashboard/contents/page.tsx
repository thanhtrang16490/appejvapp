'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Eye, FileText } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase'
import { Content } from '@/types'

export default function ContentsPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchContents()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchContents = async () => {
    try {
      // Fetch contents from Supabase with sector information
      const { data: contentsData, error } = await supabase
        .from('contents')
        .select(`
          id,
          title,
          content,
          image,
          brand,
          category,
          sector_id,
          created_at,
          updated_at,
          sectors (
            id,
            name,
            description,
            image,
            created_at,
            updated_at
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching contents:', error)
        setContents([])
        return
      }

      // Transform data to match Content interface
      const transformedContents: Content[] = (contentsData || []).map((content: any) => ({
        id: content.id,
        title: content.title,
        content: content.content,
        image: content.image,
        brand: content.brand,
        category: content.category,
        sector_id: content.sector_id,
        created_at: content.created_at,
        updated_at: content.updated_at,
        sector: content.sectors ? {
          id: content.sectors.id,
          name: content.sectors.name,
          description: content.sectors.description,
          image: content.sectors.image,
          created_at: content.sectors.created_at,
          updated_at: content.sectors.updated_at
        } : undefined
      }))

      setContents(transformedContents)
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContents = contents.filter(content =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'product':
        return 'bg-blue-100 text-blue-800'
      case 'guide':
        return 'bg-green-100 text-green-800'
      case 'news':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'product':
        return 'Sản phẩm'
      case 'guide':
        return 'Hướng dẫn'
      case 'news':
        return 'Tin tức'
      default:
        return category
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý nội dung</h1>
          <p className="text-gray-600 mt-1">Quản lý bài viết và nội dung thư viện</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Thêm nội dung
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select className="input-field w-48">
            <option value="">Tất cả danh mục</option>
            <option value="product">Sản phẩm</option>
            <option value="guide">Hướng dẫn</option>
            <option value="news">Tin tức</option>
          </select>
          <select className="input-field w-48">
            <option value="">Tất cả lĩnh vực</option>
            <option value="1">Thức ăn gia súc</option>
            <option value="2">Thức ăn gia cầm</option>
          </select>
        </div>
      </div>

      {/* Contents List */}
      <div className="space-y-4">
        {filteredContents.map((content) => (
          <div key={content.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadgeColor(content.category || '')}`}>
                      {getCategoryName(content.category || '')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {content.sector?.name}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {content.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {content.content}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span>Thương hiệu: {content.brand}</span>
                    <span>Cập nhật: {new Date(content.updated_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
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
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredContents.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy nội dung</h3>
          <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc thêm nội dung mới</p>
          <button className="btn-primary">
            Thêm nội dung đầu tiên
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredContents.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredContents.length}</span> trong tổng số <span className="font-medium">{contents.length}</span> nội dung
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