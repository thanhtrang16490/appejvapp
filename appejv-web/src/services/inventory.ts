import apiService from './api';

export interface InventoryData {
  product_id: string;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  last_updated: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface InventoryError {
  productId: string;
  productName: string;
  requestedQuantity: number;
  availableQuantity: number;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: InventoryError[];
  warnings: InventoryWarning[];
  availableQuantities: Record<string, number>;
}

export interface InventoryWarning {
  productId: string;
  productName: string;
  message: string;
}

export interface InventoryValidationRequest {
  items: {
    product_id: string;
    quantity: number;
  }[];
  order_id?: string; // For updates
}

export interface InventoryValidationResponse {
  valid: boolean;
  errors: {
    product_id: string;
    product_name: string;
    requested: number;
    available: number;
    message: string;
  }[];
  warnings: {
    product_id: string;
    message: string;
  }[];
}

class InventoryService {
  /**
   * Get inventory data for a specific product
   */
  async getProductInventory(productId: string): Promise<InventoryData> {
    try {
      const response = await apiService.get<{ data: InventoryData }>(`/products/${productId}/inventory`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product inventory:', error);
      throw new Error('Không thể tải thông tin tồn kho');
    }
  }

  /**
   * Validate order quantities against available inventory
   */
  async validateOrderQuantities(orderItems: OrderItem[]): Promise<ValidationResult> {
    try {
      const validationRequest: InventoryValidationRequest = {
        items: orderItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      };

      const response = await apiService.post<InventoryValidationResponse>('/inventory/validate', validationRequest);
      const validationResponse: InventoryValidationResponse = response;

      // Transform API response to our ValidationResult format
      const result: ValidationResult = {
        isValid: validationResponse.valid,
        errors: validationResponse.errors.map(error => ({
          productId: error.product_id,
          productName: error.product_name,
          requestedQuantity: error.requested,
          availableQuantity: error.available,
          message: error.message
        })),
        warnings: validationResponse.warnings.map(warning => ({
          productId: warning.product_id,
          productName: '', // API doesn't provide product name in warnings
          message: warning.message
        })),
        availableQuantities: {}
      };

      // Build available quantities map
      validationResponse.errors.forEach(error => {
        result.availableQuantities[error.product_id] = error.available;
      });

      return result;
    } catch (error) {
      console.error('Error validating order quantities:', error);
      
      // Return a fallback validation result
      return {
        isValid: false,
        errors: [{
          productId: 'unknown',
          productName: 'Không xác định',
          requestedQuantity: 0,
          availableQuantity: 0,
          message: 'Không thể kiểm tra tồn kho. Vui lòng thử lại.'
        }],
        warnings: [],
        availableQuantities: {}
      };
    }
  }

  /**
   * Update inventory after successful order
   */
  async updateInventoryAfterOrder(orderItems: OrderItem[]): Promise<void> {
    try {
      const updatePromises = orderItems.map(item => 
        apiService.put(`/products/${item.product_id}/inventory`, {
          quantity_change: -item.quantity,
          reason: 'order_fulfillment'
        })
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating inventory after order:', error);
      throw new Error('Không thể cập nhật tồn kho sau khi tạo đơn hàng');
    }
  }

  /**
   * Check for concurrent access conflicts (basic implementation)
   */
  async checkConcurrentAccess(productId: string, quantity: number): Promise<boolean> {
    try {
      const inventory = await this.getProductInventory(productId);
      return inventory.stock_quantity >= quantity;
    } catch (error) {
      console.error('Error checking concurrent access:', error);
      return false;
    }
  }

  /**
   * Get inventory status for multiple products
   */
  async getMultipleProductInventory(productIds: string[]): Promise<Record<string, InventoryData>> {
    try {
      const response = await apiService.post<Record<string, InventoryData>>('/inventory/bulk', { product_ids: productIds });
      return response;
    } catch (error) {
      console.error('Error fetching multiple product inventory:', error);
      throw new Error('Không thể tải thông tin tồn kho cho nhiều sản phẩm');
    }
  }

  /**
   * Mock validation for development/testing
   */
  async mockValidateOrderQuantities(orderItems: OrderItem[]): Promise<ValidationResult> {
    // Mock inventory data for testing
    const mockInventory: Record<string, { stock: number; name: string; minLevel: number }> = {
      '1': { stock: 150, name: 'HH cho lợn sữa (7 ngày tuổi - 10kg)', minLevel: 20 },
      '2': { stock: 200, name: 'HH cho lợn con tập ăn (10 ngày tuổi - 20kg)', minLevel: 30 },
      '3': { stock: 5, name: 'HH cho gà công nghiệp 01 - 12 ngày tuổi', minLevel: 40 },
    };

    const errors: InventoryError[] = [];
    const warnings: InventoryWarning[] = [];
    const availableQuantities: Record<string, number> = {};

    for (const item of orderItems) {
      const inventory = mockInventory[item.product_id];
      
      if (!inventory) {
        errors.push({
          productId: item.product_id,
          productName: item.product_name,
          requestedQuantity: item.quantity,
          availableQuantity: 0,
          message: 'Sản phẩm không tồn tại trong kho'
        });
        availableQuantities[item.product_id] = 0;
        continue;
      }

      availableQuantities[item.product_id] = inventory.stock;

      if (item.quantity > inventory.stock) {
        errors.push({
          productId: item.product_id,
          productName: inventory.name,
          requestedQuantity: item.quantity,
          availableQuantity: inventory.stock,
          message: `Không đủ hàng trong kho. Tồn kho hiện tại: ${inventory.stock} bao`
        });
      } else if (inventory.stock - item.quantity <= inventory.minLevel) {
        warnings.push({
          productId: item.product_id,
          productName: inventory.name,
          message: `Sau khi đặt hàng, sản phẩm sẽ dưới mức tồn kho tối thiểu`
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      availableQuantities
    };
  }
}

export const inventoryService = new InventoryService();