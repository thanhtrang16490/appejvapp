'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/useToast'
import { apiService } from '@/services/api'

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
}

interface Product {
  id: number
  name: string
  price: number
  sector_id: number
}

interface QuotationItem {
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
  product?: Product
}

export default function CreateQuotationPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { showToast } = useToast()

  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // Customer information
  const [customerCode, setCustomerCode] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerData, setCustomerData] = useState<Customer | null>(null)
  const [isNewCustomer, setIsNewCustomer] = useState(false)
  const [isCheckingCustomer, setIsCheckingCustomer] = useState(false)

  // Customer details for new customers
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [ward, setWard] = useState('')

  // Products
  const [products, setProducts] = useState<Product[]>([])
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await apiService.get('/products', { params: { limit: 100 } })
      setProducts(response.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      showToast('Không thể tải danh sách sản phẩm', 'error')
    }
  }

  const checkCustomerExists = async (code: string) => {
    if (!code.trim()) {
      setCustomerData(null)
      setIsNewCustomer(false)
      return
    }

    setIsCheckingCustomer(true)
    try {
      // Check if customer exists in contacts
      const response = await apiService.get('/contacts', { 
        params: { search: code, limit: 1 } 
      })
      
      if (response.data && response.data.length > 0) {
        const contact = response.data[0]
        setCustomerData({
          id: contact.id,
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          address: contact.address
        })
        setIsNewCustomer(false)
        setCustomerName(contact.name)
        setCustomerPhone(contact.phone)
        setCustomerEmail(contact.email || '')
        setCustomerAddress(contact.address || '')
      } else {
        setCustomerData(null)
        setIsNewCustomer(true)
      }
    } catch (error) {
      console.error('Error checking customer:', error)
      setIsNewCustomer(true)
    } finally {
      setIsCheckingCustomer(false)
    }
  }

  const addProduct = (product: Product) => {
    const existingItem = quotationItems.find(item => item.product_id === product.id)
    
    if (existingItem) {
      setQuotationItems(items =>
        items.map(item =>
          item.product_id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total_price: (item.quantity + 1) * item.unit_price
              }
            : item
        )
      )
    } else {
      setQuotationItems(items => [
        ...items,
        {
          product_id: product.id,
          quantity: 1,
          unit_price: product.price,
          total_price: product.price,
          product
        }
      ])
    }
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setQuotationItems(items => items.filter(item => item.product_id !== productId))
    } else {
      setQuotationItems(items =>
        items.map(item =>
          item.product_id === productId
            ? {
                ...item,
                quantity,
                total_price: quantity * item.unit_price
              }
            : item
        )
      )
    }
  }

  const getTotalPrice = () => {
    return quotationItems.reduce((sum, item) => sum + item.total_price, 0)
  }

  const handleSubmit = async () => {
    if (!user) {
      showToast('Vui lòng đăng nhập để tạo báo giá', 'error')
      return
    }

    if (quotationItems.length === 0) {
      showToast('Vui lòng chọn ít nhất một sản phẩm', 'error')
      return
    }

    setLoading(true)
    try {
      const quotationData = {
        customer_id: customerData?.id || null,
        agent_id: user.id,
        customer_code: customerCode,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        customer_address: customerAddress,
        province,
        district,
        ward,
        total_price: getTotalPrice(),
        status: 'draft',
        quotation_items: quotationItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        }))
      }

      const response = await apiService.post('/quotations', quotationData)
      showToast('Tạo báo giá thành công', 'success')
      router.push(`/quotation/${response.data.id}`)
    } catch (error) {
      console.error('Error creating quotation:', error)
      showToast('Không thể tạo báo giá', 'error')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-2xl font-bold text-gray-900">Tạo báo giá mới</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Bước {currentStep} / {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {/* Step 1: Customer Information */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Thông tin khách hàng</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã khách hàng
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerCode}
                      onChange={(e) => {
                        setCustomerCode(e.target.value.toUpperCase())
                        checkCustomerExists(e.target.value.toUpperCase())
                      }}
                      placeholder="Nhập mã khách hàng (VD: V001)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    {isCheckingCustomer && (
                      <div className="absolute right-3 top-2.5">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      </div>
                    )}
                  </div>
                </div>

                {isNewCustomer && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Khách hàng mới - sẽ tạo thông tin khách hàng mới</span>
                    </div>
                  </div>
                )}

                {customerData && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800 mb-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">Đã tìm thấy khách hàng</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p><strong>Tên:</strong> {customerData.name}</p>
                      <p><strong>Điện thoại:</strong> {customerData.phone}</p>
                      {customerData.email && <p><strong>Email:</strong> {customerData.email}</p>}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nhập họ và tên khách hàng"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Nhập email (tùy chọn)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <textarea
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Nhập địa chỉ khách hàng"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Product Selection */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Chọn sản phẩm</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => addProduct(product)}
                  >
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-red-600">
                      {formatPrice(product.price)}
                    </p>
                    <button className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Thêm vào báo giá
                    </button>
                  </div>
                ))}
              </div>

              {quotationItems.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Sản phẩm đã chọn</h3>
                  <div className="space-y-3">
                    {quotationItems.map((item) => (
                      <div key={item.product_id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                          <p className="text-sm text-gray-600">{formatPrice(item.unit_price)} / sản phẩm</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right min-w-[100px]">
                            <p className="font-bold text-red-600">{formatPrice(item.total_price)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Xem lại thông tin</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Thông tin khách hàng</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Mã:</strong> {customerCode}</p>
                    <p><strong>Tên:</strong> {customerName}</p>
                    <p><strong>Điện thoại:</strong> {customerPhone}</p>
                    {customerEmail && <p><strong>Email:</strong> {customerEmail}</p>}
                    {customerAddress && <p><strong>Địa chỉ:</strong> {customerAddress}</p>}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Sản phẩm</h3>
                  <div className="space-y-2">
                    {quotationItems.map((item) => (
                      <div key={item.product_id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div>
                          <p className="font-medium">{item.product?.name}</p>
                          <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-red-600">{formatPrice(item.total_price)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-red-600">{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
            <div className="text-center">
              <div className="text-green-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Báo giá đã được tạo!</h2>
              <p className="text-gray-600 mb-6">Báo giá của bạn đã được lưu thành công</p>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Hoàn tất'}
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Quay lại
              </button>
              <button
                onClick={currentStep === 3 ? handleSubmit : nextStep}
                disabled={
                  (currentStep === 1 && (!customerName || !customerPhone)) ||
                  (currentStep === 2 && quotationItems.length === 0) ||
                  loading
                }
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : currentStep === 3 ? 'Tạo báo giá' : 'Tiếp tục'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}