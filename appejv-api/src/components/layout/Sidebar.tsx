'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  Settings, 
  LogOut,
  Building2,
  BarChart3
} from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Người dùng', href: '/dashboard/users', icon: Users },
  { name: 'Lĩnh vực', href: '/dashboard/sectors', icon: Building2 },
  { name: 'Sản phẩm', href: '/dashboard/products', icon: Package },
  { name: 'Nội dung', href: '/dashboard/contents', icon: FileText },
  { name: 'Thống kê', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Cài đặt', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-lg font-bold text-white">A</span>
        </div>
        <div className="ml-3">
          <h1 className="text-lg font-semibold text-gray-900">APPE JV</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Đăng xuất
        </button>
      </div>
    </div>
  )
}