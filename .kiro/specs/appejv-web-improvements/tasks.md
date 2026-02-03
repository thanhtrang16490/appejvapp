# Implementation Plan: APPEJV-Web Improvements

## Overview

This implementation plan breaks down the APPEJV-Web improvements into discrete coding tasks that build incrementally. The approach focuses on component modifications, new component creation, service enhancements, and comprehensive testing to ensure all requirements are met.

## Tasks

- [x] 1. Update HomeHeader component with corrected revenue text
  - Modify the revenue text from "Thu nhập dự kiến" to "Doanh thu dự kiến"
  - Ensure month formatting "T{month}" is preserved
  - Test the text change with various month values
  - _Requirements: 2.1, 2.2_

- [x] 1.1 Write unit tests for HomeHeader text changes
  - Test correct Vietnamese text display
  - Test month variable formatting
  - Test component rendering with different props
  - _Requirements: 2.1, 2.2_

- [x] 2. Remove ContentGallery from homepage
  - Remove ContentGallery component import and usage from homepage
  - Verify layout integrity of remaining components
  - Test homepage rendering without ContentGallery
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 2.1 Write unit tests for homepage layout changes
  - Test that ContentGallery is not rendered
  - Test that other components (HomeHeader, PromoBanners, ProductSection) are still present
  - Test layout integrity
  - _Requirements: 1.1, 1.2_

- [x] 3. Create InventoryDisplay component
  - Create reusable component for showing inventory status
  - Implement stock quantity formatting with Vietnamese text "Tồn kho: {quantity}"
  - Add support for different inventory states (in stock, low stock, out of stock, updating)
  - Include low stock warning when stock_quantity < min_stock_level
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 3.1 Write property test for inventory display formatting
  - **Property 2: Product Inventory Display Consistency**
  - **Validates: Requirements 4.1, 4.4**

- [x] 3.2 Write property test for low stock warnings
  - **Property 3: Low Stock Warning Display**
  - **Validates: Requirements 4.3**

- [x] 3.3 Write unit tests for InventoryDisplay edge cases
  - Test zero stock display ("Hết hàng")
  - Test unavailable data display ("Đang cập nhật")
  - Test various stock levels and warning states
  - _Requirements: 4.2, 4.5_

- [x] 4. Enhance ProductSection with inventory display
  - Integrate InventoryDisplay component into product cards
  - Update ProductSection to accept and display inventory data
  - Modify product data interface to include inventory fields
  - Handle loading and error states for inventory data
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4.1 Write unit tests for ProductSection inventory integration
  - Test product cards display inventory information
  - Test loading states during inventory fetching
  - Test error handling when inventory data fails
  - _Requirements: 4.1, 4.5_

- [x] 5. Create OrderManagement component
  - Create new component to replace gallery content
  - Implement order list display with key information (ID, customer, status, total)
  - Add empty state handling for when no orders exist
  - Implement order selection/navigation functionality
  - Style component using existing Tailwind CSS patterns
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5.1 Write property test for order information display
  - **Property 1: Order Information Display Completeness**
  - **Validates: Requirements 3.3**

- [x] 5.2 Write unit tests for OrderManagement component
  - Test order list rendering with mock data
  - Test empty state display
  - Test order selection functionality
  - Test loading states
  - _Requirements: 3.2, 3.4, 3.5_

- [x] 6. Replace gallery page with order management
  - Replace content in /gallery page with OrderManagement component
  - Update page routing and navigation
  - Integrate with order API endpoints
  - Handle loading and error states for order data
  - _Requirements: 3.1, 3.2_

- [x] 6.1 Write unit tests for gallery page replacement
  - Test that gallery page renders OrderManagement component
  - Test navigation to gallery page
  - Test API integration for order data
  - _Requirements: 3.1, 3.2_

- [x] 7. Create inventory service
  - Create centralized inventory management service
  - Implement inventory validation functions
  - Add methods for checking stock availability
  - Include concurrent access handling where possible
  - Add error handling and logging
  - _Requirements: 5.1, 5.2, 5.4, 5.6, 6.1_

- [x] 7.1 Write property test for order validation logic
  - **Property 4: Order Validation Completeness**
  - **Validates: Requirements 5.1, 5.2, 5.4**

- [x] 7.2 Write property test for validation error messages
  - **Property 5: Inventory Validation Error Messages**
  - **Validates: Requirements 5.3**

- [x] 7.3 Write unit tests for inventory service
  - Test individual validation functions
  - Test error handling and edge cases
  - Test API integration methods
  - _Requirements: 5.1, 5.2, 5.6_

- [x] 8. Enhance order creation with inventory validation
  - Integrate inventory service into order creation flow
  - Add pre-submission validation checks
  - Implement detailed error messaging for validation failures
  - Add stock quantity updates after successful orders
  - Handle validation errors with user-friendly messages
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8.1 Write property test for stock updates after orders
  - **Property 6: Stock Update After Order**
  - **Validates: Requirements 5.5**

- [x] 8.2 Write unit tests for enhanced order creation
  - Test validation integration in order form
  - Test error message display
  - Test successful order submission flow
  - _Requirements: 5.2, 5.3, 5.4_

- [x] 9. Enhance API service with inventory endpoints
  - Add inventory-related API methods to existing api.ts
  - Implement order management API calls
  - Add error handling and retry logic
  - Ensure consistent data source usage across components
  - _Requirements: 6.1, 6.3_

- [x] 9.1 Write property test for consistent data source usage
  - **Property 7: Consistent Inventory Data Source**
  - **Validates: Requirements 6.1**

- [x] 9.2 Write property test for error handling
  - **Property 8: Graceful Error Handling for Inventory**
  - **Validates: Requirements 6.3, 6.4**

- [x] 9.3 Write unit tests for API service enhancements
  - Test new inventory API methods
  - Test error handling and retry logic
  - Test API response parsing and validation
  - _Requirements: 6.1, 6.3_

- [x] 10. Checkpoint - Ensure all tests pass and components integrate properly
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all components work together correctly
  - Test complete user flows from homepage to order creation

- [x] 11. Final integration and testing
  - Test complete application flow with all changes
  - Verify homepage displays correctly without ContentGallery
  - Test gallery page shows order management interface
  - Verify inventory displays correctly on product pages
  - Test order creation with inventory validation
  - _Requirements: All requirements_

- [x] 11.1 Write integration tests for complete flows
  - Test homepage to product browsing flow
  - Test gallery page order management flow
  - Test complete order creation with inventory validation
  - _Requirements: All requirements_

- [x] 12. Final checkpoint - Comprehensive testing and validation
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all requirements are met
  - Test application stability and performance

## Notes

- Tasks were all made required for comprehensive development from start
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples, edge cases, and component integration
- Checkpoints ensure incremental validation throughout development
- All Vietnamese text should be tested for correct display and formatting