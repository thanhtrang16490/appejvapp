'use client'

import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Users, Package, Eye, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const monthlyData = [
  { month: 'T1', users: 12, products: 5, contents: 3 },
  { month: 'T2', users: 19, products: 8, contents: 5 },
  { month: 'T3', users: 15, products: 12, contents: 7 },
  { month: 'T4', users: 25, products: 15, contents: 9 },
  { month: 'T5', users: 32, products: 18, contents: 12 },
  { month: 'T6', users: 28, products: 22, contents: 15 },
]

const sectorData = [
  { name: 'Thức ăn gia súc', value: 65, color: '#22c55e' },
  { name: 'Thức ăn gia cầm', value: 35, color: '#f59e0b' },
]

const userRoleData = [
  { name: 'Admin', value: 5, color: '#ef4444' },
  { name: 'Agent', value: 45, color: '#3b82f6' },
  { name: 'Customer', value: 50, color: '#22c55e' },
]

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6months')

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

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
          <h1 className="text-2xl font-bold text-gray-900">Thống kê & Phân tích</h1>
          <p className="text-gray-600 mt-1">Báo cáo chi tiết về hoạt động hệ thống</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field w-40"
          >
            <option value="1month">1 tháng</option>
            <option value="3months">3 tháng</option>
            <option value="6months">6 tháng</option>
            <option value="1year">1 năm</option>
          </select>
          <button className="btn-secondary flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng lượt xem</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12,543</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +15.3%
              </div>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Người dùng hoạt động</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,234</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8.2%
              </div>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sản phẩm được xem</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8,765</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.1%
              </div>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tỷ lệ tương tác</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">67.8%</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +5.4%
              </div>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Growth */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tăng trưởng theo tháng</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-600 rounded-full mr-2"></div>
                <span className="text-gray-600">Người dùng</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                <span className="text-gray-600">Sản phẩm</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
                <span className="text-gray-600">Nội dung</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#22c55e" />
              <Bar dataKey="products" fill="#3b82f6" />
              <Bar dataKey="contents" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sector Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Phân bố theo lĩnh vực</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {sectorData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-600">{entry.name}: {entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Roles Distribution */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Phân bố vai trò người dùng</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userRoleData.map((role, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: `${role.color}20` }}>
                <span className="text-2xl font-bold" style={{ color: role.color }}>{role.value}%</span>
              </div>
              <h4 className="font-medium text-gray-900">{role.name}</h4>
              <p className="text-sm text-gray-500">{Math.round(role.value * 1.56)} người dùng</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Xem tất cả
          </button>
        </div>
        <div className="space-y-4">
          {[
            { action: 'Người dùng mới đăng ký', user: 'Nguyễn Văn A', time: '2 phút trước', type: 'user' },
            { action: 'Sản phẩm mới được thêm', user: 'Admin', time: '15 phút trước', type: 'product' },
            { action: 'Nội dung được cập nhật', user: 'Admin', time: '1 giờ trước', type: 'content' },
            { action: 'Người dùng mới đăng ký', user: 'Trần Thị B', time: '2 giờ trước', type: 'user' },
            { action: 'Báo cáo được xuất', user: 'Admin', time: '3 giờ trước', type: 'report' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 py-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'user' ? 'bg-green-100' :
                activity.type === 'product' ? 'bg-blue-100' :
                activity.type === 'content' ? 'bg-purple-100' :
                'bg-gray-100'
              }`}>
                {activity.type === 'user' && <Users className="w-4 h-4 text-green-600" />}
                {activity.type === 'product' && <Package className="w-4 h-4 text-blue-600" />}
                {activity.type === 'content' && <BarChart3 className="w-4 h-4 text-purple-600" />}
                {activity.type === 'report' && <Download className="w-4 h-4 text-gray-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">bởi {activity.user}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}