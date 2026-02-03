'use client'

import { useEffect, useState } from 'react'
import { Users, Package, Building2, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase'
import { DashboardStats, RecentUser, RecentProduct } from '@/types'

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue 
}: { 
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  trend?: 'up' | 'down'
  trendValue?: string
}) => (
  <div className="card">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
        {trend && trendValue && (
          <div className={`flex items-center mt-2 text-sm ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {trendValue}
          </div>
        )}
      </div>
      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
    </div>
  </div>
)

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchDashboardStats()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)

      // Fetch real statistics from Supabase
      const [usersResult, productsResult, sectorsResult, contentsResult] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('sectors').select('*', { count: 'exact', head: true }),
        supabase.from('contents').select('*', { count: 'exact', head: true })
      ])

      // Fetch recent users
      const { data: recentUsersData } = await supabase
        .from('users')
        .select(`
          id, email, name, created_at,
          roles (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch recent products
      const { data: recentProductsData } = await supabase
        .from('products')
        .select(`
          id, name, price, created_at,
          sectors (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      const stats: DashboardStats = {
        totalUsers: usersResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalSectors: sectorsResult.count || 0,
        totalContents: contentsResult.count || 0,
        recentUsers: recentUsersData || [],
        recentProducts: recentProductsData || []
      }
      
      setStats(stats)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Fallback to default stats
      const fallbackStats: DashboardStats = {
        totalUsers: 0,
        totalProducts: 0,
        totalSectors: 0,
        totalContents: 0,
        recentUsers: [],
        recentProducts: []
      }
      setStats(fallbackStats)
    } finally {
      setLoading(false)
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Tổng quan hệ thống APPE JV</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng người dùng"
          value={stats?.totalUsers || 0}
          icon={Users}
          trend="up"
          trendValue="+12% so với tháng trước"
        />
        <StatCard
          title="Tổng sản phẩm"
          value={stats?.totalProducts || 0}
          icon={Package}
          trend="up"
          trendValue="+5 sản phẩm mới"
        />
        <StatCard
          title="Lĩnh vực"
          value={stats?.totalSectors || 0}
          icon={Building2}
        />
        <StatCard
          title="Nội dung"
          value={stats?.totalContents || 0}
          icon={FileText}
          trend="up"
          trendValue="+3 bài viết mới"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Người dùng mới</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-3">
            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user: RecentUser) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">{user.roles?.[0]?.name}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Chưa có người dùng mới</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sản phẩm mới</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-3">
            {stats?.recentProducts && stats.recentProducts.length > 0 ? (
              stats.recentProducts.map((product: RecentProduct) => (
                <div key={product.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sectors?.[0]?.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(product.price)}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(product.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Chưa có sản phẩm mới</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}