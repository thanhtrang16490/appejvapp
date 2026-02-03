'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/useToast'
import { apiService } from '@/services/api'

interface Product {
  id: number
  name: string
  price: number
  sector_id: number
}

interface Sector {
  id: number
  name: string
  products?: Product[]
}

export default function CreateContactPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { showToast } = useToast()

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    description: '',
    assumed_code: ''
  })

  // Product selection
  const [sectors, setSectors] = useState<Sector[]>([])
  const [selectedSectorId, setSelectedSectorId] = useState<number | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [isCheckingPhone, setIsCheckingPhone] = useState(false)
  const [phoneError, setPhoneError] = useState('')

  useEffect(() => {
    fetchSectors()
  }, [])

  const fetchSectors = async () => {
    try {
      const response = await apiService.get('/sectors', { 
        params: { include_products: 'true', limit: 100 } 
      })
      setSectors(response.data || [])
    } catch (error) {
      console.error('Error fetching sectors:', error)
      showToast('Không thể tải danh sách sản phẩm', 'error')
    }
  }

  const checkPhoneExists = async (phone: string) => {
    if (!phone || phone.length < 10) {
      setPhoneError('')
      return
    }

    setIsCheckingPhone(true)
    try {
      const response = await apiService.get('/contacts', { 
        params: { search: phone, limit: 1 } 
      })
      
      if (response.data && response.data.length > 0) {
        setPhoneError('Số điện thoại đã tồn tại trong hệ thống')
      } else {
        setPhoneError('')
      }
    } catch (error) {
      console.error('Error checking phone:', error)
      setPhoneError('')
    } finally {
      setIsCheckingPhone(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'phone') {
      // Debounce phone check
      setTimeout(() => checkPhoneExists(value), 500)
    }
  }

  const handleSectorSelect = (sectorId: number) => {
    setSelectedSectorId(sectorId)
    setSelectedProductId(null) // Reset product selection
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast('Vui lòng nhập họ và tên', 'error')
      return false
    }

    if (!formData.phone.trim()) {
      showToast('Vui lòng nhập số điện thoại', 'error')
      return false
    }

    if (formData.phone.length < 10) {
      showToast('Số điện thoại phải có ít nhất 10 số', 'error')
      return false
    }

    if (phoneError) {
      showToast('Số điện thoại đã tồn tại', 'error')
      return false
    }

    if (formData.email && !isValidEmail(formData.email)) {
      showToast('Email không hợp lệ', 'error')
      return false
    }

    return true
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return
    if (!user) {
      showToast('Vui lòng đăng nhập để tạo liên hệ', 'error')
      return
    }

    setLoading(true)
    try {
      const contactData = {
        ...formData,
        agent_id: user.id,
        gender: formData.gender === 'Nam' ? true : formData.gender === 'Nữ' ? false : null,
        interested_product_id: selectedProductId,
        status: 'new'
      }

      const response = await apiService.post('/contacts', contactData)
      showToast('Tạo liên hệ thành công', 'success')
      router.push('/contacts')
    } catch (error: any) {
      console.error('Error creating contact:', error)
      if (error.response?.status === 409) {
        showToast('Số điện thoại đã tồn tại trong hệ thống', 'error')
      } else {
        showToast('Không thể tạo liên hệ', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const selectedSector = sectors.find(s => s.id === selectedSectorId)
  const availableProducts = selectedSector?.products || []

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Thêm liên hệ mới</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin cá nhân</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nhập họ và tên"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value.replace(/[^0-9+]/g, ''))}
                    placeholder="Nhập số điện thoại"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      phoneError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {isCheckingPhone && (
                    <div className="absolute right-3 top-2.5">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                    </div>
                  )}
                </div>
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Nhập email (tùy chọn)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Nhập địa chỉ chi tiết"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tỉnh/Thành phố
                </label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  placeholder="Nhập tỉnh/thành phố"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quận/Huyện
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder="Nhập quận/huyện"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phường/Xã
                </label>
                <input
                  type="text"
                  value={formData.ward}
                  onChange={(e) => handleInputChange('ward', e.target.value)}
                  placeholder="Nhập phường/xã"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Product Interest */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Sản phẩm quan tâm</h2>
            
            {/* Sector Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn nhóm sản phẩm
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sectors.map((sector) => (
                  <button
                    key={sector.id}
                    type="button"
                    onClick={() => handleSectorSelect(sector.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      selectedSectorId === sector.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{sector.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sector.products?.length || 0} sản phẩm
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Selection */}
            {selectedSectorId && availableProducts.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn sản phẩm cụ thể
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableProducts.map((product) => (
                    <label
                      key={product.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="product"
                        value={product.id}
                        checked={selectedProductId === product.id}
                        onChange={() => setSelectedProductId(product.id)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-teal-600 font-semibold">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            maximumFractionDigits: 0
                          }).format(product.price)}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin bổ sung</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã khách hàng dự kiến
                </label>
                <input
                  type="text"
                  value={formData.assumed_code}
                  onChange={(e) => handleInputChange('assumed_code', e.target.value.toUpperCase())}
                  placeholder="Nhập mã khách hàng dự kiến (VD: V001)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Nhập ghi chú về khách hàng (tùy chọn)"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading || isCheckingPhone || !!phoneError}
              className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Tạo liên hệ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}