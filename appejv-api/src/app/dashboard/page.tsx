'use client'

import { useEffect, useState } from 'react'
import { Users, Package, Building2, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase'
import { DashboardStats } from '@/types'

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue 
}: { 
  title: string
  value: number
  icon: any
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
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Mock data for now - replace with actual Supabase queries
      const mockStats: DashboardStats = {
        totalUsers: 156,
        totalProducts: 67,
        totalSectors: 2,
        totalContents: 25,
        recentUsers: [],
        recentProducts: []
      }
      
      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
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
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Người dùng {i}</p>
                  <p className="text-xs text-gray-500">user{i}@example.com</p>
                </div>
                <span className="text-xs text-gray-400">2 giờ trước</span>
              </div>
            ))}
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
            {[
              'HH cho lợn sữa (7 ngày tuổi - 10kg)',
              'HH cho lợn con tập ăn (10 ngày tuổi - 20kg)',
              'HH cho gà công nghiệp 01 - 12 ngày tuổi',
              'HH cho vịt, ngan con (từ 01 - 21 ngày tuổi)',
              'Đậm đặc cao cấp cho lợn tập ăn'
            ].map((product, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{product}</p>
                  <p className="text-xs text-gray-500">Thức ăn chăn nuôi</p>
                </div>
                <span className="text-xs text-gray-400">{i + 1}h trước</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}