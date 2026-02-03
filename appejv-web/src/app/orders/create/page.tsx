'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Product } from '@/types/sector';
import { inventoryService, type OrderItem as InventoryOrderItem } from '@/services/inventory';
import { InventoryDisplay } from '@/components/ui';

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
}

// Mock products with inventory
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'HH cho lợn sữa (7 ngày tuổi - 10kg)',
    description: 'Mã SP: A1 - Đạm 20% - Bao 20kg',
    price: 27100,
    image: null,
    category_id: 1,
    sector_id: 1,
    brand_id: 1,
    stock_quantity: 150,
    min_stock_level: 20,
    max_stock_level: 500,
    unit: 'bao',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'HH cho lợn con tập ăn (10 ngày tuổi - 20kg)',
    description: 'Mã SP: A2 - Đạm 19% - Bao 25kg',
    price: 18090,
    image: null,
    category_id: 1,
    sector_id: 1,
    brand_id: 1,
    stock_quantity: 200,
    min_stock_level: 30,
    max_stock_level: 600,
    unit: 'bao',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'HH cho gà công nghiệp 01 - 12 ngày tuổi',
    description: 'Mã SP: A2010 - Đạm 21% - Bao 25kg',
    price: 13480,
    image: null,
    category_id: 2,
    sector_id: 2,
    brand_id: 1,
    stock_quantity: 5, // Low stock for testing
    min_stock_level: 40,
    max_stock_level: 700,
    unit: 'bao',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Mock customers
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Trại chăn nuôi Hòa Bình',
    phone: '0912345678',
    address: '123 Đường ABC, Quận 1, TP.HCM',
  },
  {
    id: '2',
    name: 'Trang trại gia cầm Minh Phát',
    phone: '0987654321',
    address: '456 Đường XYZ, Quận 3, TP.HCM',
  },
];

export default function CreateOrderPage() {
  const { authState } = useAuth();
  const toast = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const currentUser = authState.user;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const addProductToOrder = () => {
    if (!selectedProduct) {
      toast.error('Vui lòng chọn sản phẩm');
      return;
    }

    if (quantity <= 0) {
      toast.error('Số lượng phải lớn hơn 0');
      return;
    }

    // Check inventory
    if (selectedProduct.stock_quantity !== undefined && quantity > selectedProduct.stock_quantity) {
      toast.error(`Không đủ hàng trong kho. Tồn kho hiện tại: ${selectedProduct.stock_quantity} ${selectedProduct.unit || 'bao'}`);
      return;
    }

    // Check if product already exists in order
    const existingItemIndex = orderItems.findIndex(item => item.product.id === selectedProduct.id);
    
    if (existingItemIndex >= 0) {
      const existingItem = orderItems[existingItemIndex];
      const newTotalQuantity = existingItem.quantity + quantity;
      
      // Check total quantity against inventory
      if (selectedProduct.stock_quantity !== undefined && newTotalQuantity > selectedProduct.stock_quantity) {
        toast.error(`Tổng số lượng vượt quá tồn kho. Tồn kho: ${selectedProduct.stock_quantity}, đã chọn: ${existingItem.quantity}`);
        return;
      }
      
      // Update existing item
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: newTotalQuantity
      };
      setOrderItems(updatedItems);
      toast.success(`Đã cập nhật số lượng ${selectedProduct.name}`);
    } else {
      // Add new item
      setOrderItems([...orderItems, { product: selectedProduct, quantity }]);
      toast.success(`Đã thêm ${selectedProduct.name} vào đơn hàng`);
    }

    // Reset form
    setSelectedProduct(null);
    setQuantity(1);
  };

  const removeProductFromOrder = (productId: number) => {
    setOrderItems(orderItems.filter(item => item.product.id !== productId));
    toast.success('Đã xóa sản phẩm khỏi đơn hàng');
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProductFromOrder(productId);
      return;
    }

    const product = mockProducts.find(p => p.id === productId);
    if (product && product.stock_quantity !== undefined && newQuantity > product.stock_quantity) {
      toast.error(`Không đủ hàng trong kho. Tồn kho hiện tại: ${product.stock_quantity} ${product.unit || 'bao'}`);
      return;
    }

    setOrderItems(orderItems.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const createOrder = async () => {
    if (!selectedCustomer) {
      toast.error('Vui lòng chọn khách hàng');
      return;
    }

    if (orderItems.length === 0) {
      toast.error('Vui lòng thêm ít nhất một sản phẩm');
      return;
    }

    setLoading(true);
    try {
      // Convert order items to inventory service format
      const inventoryOrderItems: InventoryOrderItem[] = orderItems.map(item => ({
        product_id: item.product.id.toString(),
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price
      }));

      // Validate inventory using the inventory service
      const validationResult = await inventoryService.mockValidateOrderQuantities(inventoryOrderItems);
      
      if (!validationResult.isValid) {
        // Show detailed error messages
        const errorMessages = validationResult.errors.map(error => error.message).join('\n');
        toast.error(`Không thể tạo đơn hàng:\n${errorMessages}`);
        return;
      }

      // Show warnings if any
      if (validationResult.warnings.length > 0) {
        const warningMessages = validationResult.warnings.map(warning => warning.message).join('\n');
        toast.warning(`Cảnh báo:\n${warningMessages}`);
      }

      // Simulate API call for order creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update inventory after successful order (in a real app, this would be handled by the backend)
      // await inventoryService.updateInventoryAfterOrder(inventoryOrderItems);
      
      toast.success('Đơn hàng đã được tạo thành công!');
      
      // Reset form
      setSelectedCustomer(null);
      setOrderItems([]);
      
      // Redirect to orders page
      setTimeout(() => {
        window.location.href = '/orders';
      }, 1500);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Có lỗi xảy ra khi tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => window.location.href = '/orders'}
            className="p-2"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Tạo đơn hàng</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Customer Selection */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Chọn khách hàng</h2>
          <div className="space-y-2">
            {mockCustomers.map((customer) => (
              <button
                key={customer.id}
                onClick={() => setSelectedCustomer(customer)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedCustomer?.id === customer.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-gray-900">{customer.name}</div>
                <div className="text-sm text-gray-600">{customer.phone}</div>
                <div className="text-xs text-gray-500">{customer.address}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Selection */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Thêm sản phẩm</h2>
          
          {/* Product Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn sản phẩm</label>
            <select
              value={selectedProduct?.id || ''}
              onChange={(e) => {
                const product = mockProducts.find(p => p.id === parseInt(e.target.value));
                setSelectedProduct(product || null);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">-- Chọn sản phẩm --</option>
              {mockProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {formatCurrency(product.price)} 
                  {product.stock_quantity !== undefined && ` (Tồn: ${product.stock_quantity} ${product.unit || 'bao'})`}
                </option>
              ))}
            </select>
          </div>

          {/* Product Details */}
          {selectedProduct && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{selectedProduct.name}</h3>
                <span className="text-lg font-bold text-red-600">
                  {formatCurrency(selectedProduct.price)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{selectedProduct.description}</p>
              
              {/* Inventory Status */}
              {selectedProduct.stock_quantity !== undefined && (
                <div className="flex items-center justify-between">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    selectedProduct.stock_quantity <= (selectedProduct.min_stock_level || 0) 
                      ? 'bg-red-100 text-red-600' 
                      : selectedProduct.stock_quantity <= (selectedProduct.min_stock_level || 0) * 2
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    Tồn kho: {selectedProduct.stock_quantity} {selectedProduct.unit || 'bao'}
                  </span>
                  {selectedProduct.stock_quantity <= (selectedProduct.min_stock_level || 0) && (
                    <span className="text-sm text-red-600 font-medium">⚠️ Sắp hết hàng</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quantity Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                min="1"
                max={selectedProduct?.stock_quantity || 999}
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={selectedProduct?.stock_quantity !== undefined && quantity >= selectedProduct.stock_quantity}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
              {selectedProduct && (
                <span className="text-sm text-gray-600">
                  {selectedProduct.unit || 'bao'}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={addProductToOrder}
            disabled={!selectedProduct}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Thêm vào đơn hàng
          </button>
        </div>

        {/* Order Items */}
        {orderItems.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Sản phẩm đã chọn</h2>
            <div className="space-y-3">
              {orderItems.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(item.product.price)} x {item.quantity} {item.product.unit || 'bao'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.product.stock_quantity !== undefined && item.quantity >= item.product.stock_quantity}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-red-600 min-w-[80px] text-right">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeProductFromOrder(item.product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-red-600">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>
        )}

        {/* Create Order Button */}
        <button
          onClick={createOrder}
          disabled={!selectedCustomer || orderItems.length === 0 || loading}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-medium text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Đang tạo đơn hàng...
            </div>
          ) : (
            'Tạo đơn hàng'
          )}
        </button>
      </div>
    </div>
  );
}