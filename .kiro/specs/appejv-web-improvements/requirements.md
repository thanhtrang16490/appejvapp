# Requirements Document

## Introduction

This specification outlines improvements to APPEJV-Web, a Next.js React application for livestock feed sales. The improvements focus on homepage optimization, content management restructuring, inventory visibility, and enhanced order validation to provide a better user experience and more robust business operations.

## Glossary

- **APPEJV_Web**: The Next.js React application for livestock feed sales
- **Homepage**: The main landing page of the application
- **ContentGallery**: Component displaying content articles on the homepage
- **Gallery_Page**: The current /gallery page showing content articles
- **Order_Management_Page**: New page to replace the gallery page for managing orders
- **Inventory_System**: Stock management system tracking product quantities
- **Stock_Quantity**: Current available inventory for a product
- **Order_Validator**: System component that validates orders against inventory

## Requirements

### Requirement 1: Homepage Content Optimization

**User Story:** As a user visiting the homepage, I want to see only relevant business content without distracting articles, so that I can focus on products and core business information.

#### Acceptance Criteria

1. WHEN a user visits the homepage, THE APPEJV_Web SHALL display HomeHeader, PromoBanners, and ProductSection components
2. WHEN the homepage loads, THE APPEJV_Web SHALL NOT display the ContentGallery component
3. WHEN the homepage renders, THE APPEJV_Web SHALL maintain all existing functionality except content gallery display
4. WHEN the ContentGallery component is removed, THE APPEJV_Web SHALL preserve the layout integrity of remaining components

### Requirement 2: Revenue Text Correction

**User Story:** As a Vietnamese user, I want to see correct business terminology in the revenue display, so that the application uses proper Vietnamese business language.

#### Acceptance Criteria

1. WHEN the HomeHeader component displays revenue information, THE APPEJV_Web SHALL show "Doanh thu dự kiến" instead of "Thu nhập dự kiến"
2. WHEN the revenue text is updated, THE APPEJV_Web SHALL maintain the existing month variable formatting "T{month}"
3. WHEN the text change is applied, THE APPEJV_Web SHALL preserve all other HomeHeader functionality and styling

### Requirement 3: Gallery Page Replacement

**User Story:** As a business user, I want to access order management functionality instead of content articles, so that I can efficiently manage customer orders from a dedicated page.

#### Acceptance Criteria

1. WHEN a user navigates to /gallery, THE APPEJV_Web SHALL display an order management interface instead of content articles
2. WHEN the Order_Management_Page loads, THE APPEJV_Web SHALL show a list of existing orders with key information
3. WHEN displaying orders, THE APPEJV_Web SHALL include order ID, customer information, status, and total amount
4. WHEN the order list is empty, THE APPEJV_Web SHALL display an appropriate empty state message
5. WHEN a user clicks on an order, THE APPEJV_Web SHALL navigate to the order details or editing interface

### Requirement 4: Product Inventory Display

**User Story:** As a user browsing products, I want to see current stock levels, so that I can make informed purchasing decisions based on availability.

#### Acceptance Criteria

1. WHEN products are displayed, THE APPEJV_Web SHALL show the current stock_quantity for each product
2. WHEN stock_quantity is zero, THE APPEJV_Web SHALL display "Hết hàng" (Out of Stock) status
3. WHEN stock_quantity is below min_stock_level, THE APPEJV_Web SHALL display a low stock warning
4. WHEN displaying inventory information, THE APPEJV_Web SHALL format the stock quantity with appropriate Vietnamese text "Tồn kho: {quantity}"
5. WHEN inventory data is unavailable, THE APPEJV_Web SHALL display "Đang cập nhật" (Updating) status

### Requirement 5: Enhanced Order Validation

**User Story:** As a business owner, I want the system to prevent orders that exceed available inventory, so that I can maintain accurate stock levels and avoid overselling.

#### Acceptance Criteria

1. WHEN a user attempts to create an order, THE Order_Validator SHALL check each product quantity against available stock_quantity
2. WHEN an order item quantity exceeds available stock, THE Order_Validator SHALL prevent order creation and display a specific error message
3. WHEN inventory validation fails, THE APPEJV_Web SHALL show which products have insufficient stock and the available quantities
4. WHEN all order items have sufficient stock, THE Order_Validator SHALL allow order creation to proceed
5. WHEN an order is successfully validated, THE APPEJV_Web SHALL update the stock_quantity for each ordered product
6. WHEN multiple users attempt to order the same product simultaneously, THE Order_Validator SHALL handle concurrent access to prevent overselling

### Requirement 6: Data Consistency and Integration

**User Story:** As a system administrator, I want inventory data to remain consistent across all application components, so that users always see accurate stock information.

#### Acceptance Criteria

1. WHEN inventory is displayed on any page, THE APPEJV_Web SHALL use the same stock_quantity data source
2. WHEN stock levels change through order creation, THE Inventory_System SHALL update all relevant displays immediately
3. WHEN the application loads inventory data, THE APPEJV_Web SHALL handle API errors gracefully with appropriate fallback displays
4. WHEN inventory data is being fetched, THE APPEJV_Web SHALL show loading states to indicate data retrieval in progress