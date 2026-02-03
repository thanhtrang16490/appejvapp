'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Eye, Building2 } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase'
import { Sector } from '@/types'

export default function SectorsPage() {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchSectors()
  }, [])

  const fetchSectors = async () => {
    try {
      setLoading(true)
      
      // Fetch sectors from Supabase with product count
      const { data: sectorsData, error } = await supabase
        .from('sectors')
        .select(`
          id,
          name,
          description,
          image,
          created_at,
          updated_at,
          products (count)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching sectors:', error)
        setSectors([])
        return
      }

      // Transform data to match Sector interface
      const transformedSectors: Sector[] = sectorsData.map(sector => ({
        id: sector.id,
        name: sector.name,
        description: sector.description,
        image: sector.image,
        created_at: sector.created_at,
        updated_at: sector.updated_at
      }))

      setSectors(transformedSectors)
    } catch (error) {
      console.error('Error fetching sectors:', error)
      setSectors([])
    } finally {
      setLoading(false)
    }
  }

  const filteredSectors = sectors.filter(sector =>
    sector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sector.description && sector.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý lĩnh vực</h1>
          <p className="text-gray-600 mt-1">Quản lý các lĩnh vực kinh doanh của APPE JV</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Thêm lĩnh vực
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm lĩnh vực..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Sectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSectors.map((sector) => (
          <div key={sector.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-600" />
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

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {sector.name}
            </h3>

            {sector.description && (
              <p className="text-sm text-gray-600 mb-4">
                {sector.description}
              </p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Cập nhật: {new Date(sector.updated_at).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSectors.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy lĩnh vực</h3>
          <p className="text-gray-600 mb-6">Thử thay đổi từ khóa tìm kiếm hoặc thêm lĩnh vực mới</p>
          <button className="btn-primary">
            Thêm lĩnh vực đầu tiên
          </button>
        </div>
      )}
    </div>
  )
}