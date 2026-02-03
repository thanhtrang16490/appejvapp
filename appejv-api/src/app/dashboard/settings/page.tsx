'use client'

import { useState } from 'react'
import { Save, Shield, Bell, Globe, Database, Key, Mail } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    siteName: 'APPE JV Admin',
    siteDescription: 'Hệ thống quản trị thức ăn chăn nuôi APPE JV',
    contactEmail: 'admin@appejv.vn',
    contactPhone: '03513 595 030',
    address: 'Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam',
    enableNotifications: true,
    enableEmailAlerts: true,
    maintenanceMode: false,
    allowRegistration: false,
    requireEmailVerification: true,
  })

  const tabs = [
    { id: 'general', name: 'Tổng quan', icon: Globe },
    { id: 'security', name: 'Bảo mật', icon: Shield },
    { id: 'notifications', name: 'Thông báo', icon: Bell },
    { id: 'database', name: 'Cơ sở dữ liệu', icon: Database },
    { id: 'api', name: 'API', icon: Key },
  ]

  const handleSave = () => {
    // Save settings logic here
    alert('Cài đặt đã được lưu thành công!')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên hệ thống
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả hệ thống
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={3}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email liên hệ
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ công ty
              </label>
              <textarea
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                rows={2}
                className="input-field"
              />
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Chế độ bảo trì</h4>
                <p className="text-sm text-gray-500">Tạm thời tắt hệ thống để bảo trì</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Cho phép đăng ký</h4>
                <p className="text-sm text-gray-500">Cho phép người dùng mới đăng ký tài khoản</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Xác thực email</h4>
                <p className="text-sm text-gray-500">Yêu cầu xác thực email khi đăng ký</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Đổi mật khẩu admin</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                  />
                </div>
                <button className="btn-primary">
                  Cập nhật mật khẩu
                </button>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Thông báo hệ thống</h4>
                <p className="text-sm text-gray-500">Nhận thông báo về hoạt động hệ thống</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Cảnh báo qua email</h4>
                <p className="text-sm text-gray-500">Gửi email khi có sự cố hoặc cảnh báo</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableEmailAlerts}
                  onChange={(e) => setSettings({ ...settings, enableEmailAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Cấu hình email</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Server
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Port
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="587"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="admin@appejv.vn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'database':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Database className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Cảnh báo
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Các thao tác với cơ sở dữ liệu có thể ảnh hưởng đến toàn bộ hệ thống. Hãy thực hiện cẩn thận.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Sao lưu dữ liệu</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Tạo bản sao lưu toàn bộ cơ sở dữ liệu
                </p>
                <button className="btn-primary w-full">
                  Tạo bản sao lưu
                </button>
              </div>

              <div className="card">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Khôi phục dữ liệu</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Khôi phục dữ liệu từ bản sao lưu
                </p>
                <button className="btn-secondary w-full">
                  Chọn file khôi phục
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Thông tin cơ sở dữ liệu</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Tổng số bảng</p>
                  <p className="text-2xl font-bold text-primary-600 mt-1">8</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Dung lượng</p>
                  <p className="text-2xl font-bold text-primary-600 mt-1">245 MB</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Sao lưu cuối</p>
                  <p className="text-2xl font-bold text-primary-600 mt-1">2 ngày</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'api':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Cấu hình API</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Base URL
                  </label>
                  <input
                    type="text"
                    value="http://localhost:3001/api"
                    readOnly
                    className="input-field bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Secret Key
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      value="••••••••••••••••••••••••••••••••"
                      readOnly
                      className="input-field bg-gray-50 flex-1"
                    />
                    <button className="btn-secondary">
                      Tạo mới
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">CORS Settings</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed Origins
                </label>
                <textarea
                  rows={3}
                  className="input-field"
                  placeholder="http://localhost:3000&#10;https://appejv-web.vercel.app"
                  defaultValue="http://localhost:3000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mỗi domain một dòng
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">API Endpoints</h4>
              <div className="space-y-2">
                {[
                  { method: 'GET', path: '/api/users', description: 'Lấy danh sách người dùng' },
                  { method: 'GET', path: '/api/products', description: 'Lấy danh sách sản phẩm' },
                  { method: 'GET', path: '/api/sectors', description: 'Lấy danh sách lĩnh vực' },
                  { method: 'GET', path: '/api/contents', description: 'Lấy danh sách nội dung' },
                ].map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm text-gray-900">{endpoint.path}</code>
                    </div>
                    <span className="text-sm text-gray-600">{endpoint.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-gray-600 mt-1">Quản lý cấu hình và thiết lập hệ thống</p>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center">
          <Save className="w-5 h-5 mr-2" />
          Lưu cài đặt
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}