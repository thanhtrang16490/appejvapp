'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase'
import { User } from '@/types'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // Mock data for now - replace with actual Supabase query
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@appejv.vn',
          name: 'Admin User',
          phone: '0123456789',
          role_id: 1,
          parent_id: null,
          commission_rate: 10,
          total_commission: 1000000,
          address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          role: { id: 1, name: 'Admin', description: 'Administrator', created_at: '2024-01-01T00:00:00Z' }
        },
        {
          id: '2',
          email: 'agent@appejv.vn',
          name: 'Nguyễn Văn A',
          phone: '0987654321',
          role_id: 2,
          parent_id: '1',
          commission_rate: 8,
          total_commission: 500000,
          address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z',
          role: { id: 2, name: 'Agent', description: 'Sales Agent', created_at: '2024-01-01T00:00:00Z' }
        },
        {
          id: '3',
          email: 'customer@appejv.vn',
          name: 'Trần Thị B',
          phone: '0901234567',
          role_id: 3,
          parent_id: '2',
          commission_rate: null,
          total_commission: null,
          address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam',
          created_at: '2024-02-01T00:00:00Z',
          updated_at: '2024-02-01T00:00:00Z',
          role: { id: 3, name: 'Customer', description: 'Customer', created_at: '2024-01-01T00:00:00Z' }
        }
      ]
      
      setUsers(mockUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  )

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'agent':
        return 'bg-blue-100 text-blue-800'
      case 'customer':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-600 mt-1">Quản lý tài khoản và phân quyền người dùng</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Thêm người dùng
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select className="input-field w-48">
            <option value="">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hoa hồng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng hoa hồng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role?.name || '')}`}>
                      {user.role?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.commission_rate ? `${user.commission_rate}%` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(user.total_commission)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredUsers.length}</span> trong tổng số <span className="font-medium">{users.length}</span> người dùng
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn-secondary">Trước</button>
          <button className="btn-primary">1</button>
          <button className="btn-secondary">Sau</button>
        </div>
      </div>
    </div>
  )
}