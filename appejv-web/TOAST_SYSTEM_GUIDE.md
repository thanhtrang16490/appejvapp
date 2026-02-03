# Toast Notification System Guide

## Tổng quan

Hệ thống toast notification đã được tích hợp vào appejv-web sử dụng `react-hot-toast` với các tùy chỉnh UI phù hợp với thiết kế của ứng dụng.

## Cài đặt và Cấu hình

### Dependencies
```bash
npm install react-hot-toast
```

### Cấu hình trong Layout
Toast system đã được cấu hình trong `src/app/layout.tsx` với:
- Vị trí: `top-center`
- Thời gian hiển thị mặc định: 4 giây
- Styling tùy chỉnh cho từng loại toast

## Cách sử dụng

### 1. Import useToast Hook

```typescript
import { useToast } from '@/hooks/useToast';

export default function MyComponent() {
  const toast = useToast();
  
  // Sử dụng toast...
}
```

### 2. Basic Toast Types

#### Success Toast
```typescript
toast.success('Đăng nhập thành công!');
```

#### Error Toast
```typescript
toast.error('Có lỗi xảy ra khi đăng nhập');
```

#### Warning Toast
```typescript
toast.warning('Mật khẩu sắp hết hạn');
```

#### Info Toast
```typescript
toast.info('Đã tải 41 sản phẩm');
```

### 3. Loading Toast

#### Basic Loading
```typescript
const loadingToast = toast.loading('Đang xử lý...');

// Sau khi hoàn thành
toast.dismiss(loadingToast);
toast.success('Hoàn thành!');
```

#### Promise-based Loading
```typescript
const myPromise = fetch('/api/data');

toast.promise(myPromise, {
  loading: 'Đang tải dữ liệu...',
  success: 'Tải dữ liệu thành công!',
  error: 'Không thể tải dữ liệu'
});
```

### 4. Advanced Features

#### Dismiss Toasts
```typescript
// Dismiss một toast cụ thể
toast.dismiss(toastId);

// Dismiss tất cả toasts
toast.dismissAll();
```

#### Custom Toast với UI đẹp hơn
```typescript
import { showCustomToast } from '@/components/ui/Toast';

showCustomToast.success('Custom success message');
showCustomToast.error('Custom error message');
showCustomToast.warning('Custom warning message');
showCustomToast.info('Custom info message');
```

## Ví dụ thực tế

### 1. Login Flow
```typescript
const handleLogin = async (credentials) => {
  const loadingToast = toast.loading('Đang đăng nhập...');
  
  try {
    const user = await login(credentials);
    toast.dismiss(loadingToast);
    toast.success(`Chào mừng ${user.name}! Đăng nhập thành công.`);
    router.push('/');
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error('Số điện thoại hoặc mật khẩu không đúng');
  }
};
```

### 2. Data Loading
```typescript
const loadData = async () => {
  try {
    toast.info('Đang tải danh sách sản phẩm...');
    const products = await fetchProducts();
    toast.success(`Đã tải ${products.length} sản phẩm thành công`);
  } catch (error) {
    toast.warning('Không thể tải dữ liệu từ server, sử dụng dữ liệu mẫu');
  }
};
```

### 3. Form Validation
```typescript
const handleSubmit = (formData) => {
  if (!formData.phone) {
    toast.error('Vui lòng nhập số điện thoại');
    return;
  }
  
  if (!formData.password) {
    toast.error('Vui lòng nhập mật khẩu');
    return;
  }
  
  // Process form...
};
```

### 4. Network Error Handling
```typescript
const handleApiCall = async () => {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      toast.error('Không thể kết nối đến server');
      setTimeout(() => {
        toast.warning('Đang sử dụng dữ liệu offline');
      }, 1000);
    } else {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  }
};
```

## Styling và Tùy chỉnh

### Default Styles
- **Success**: Màu xanh lá (#10B981)
- **Error**: Màu đỏ (#EF4444)
- **Warning**: Màu vàng (#F59E0B)
- **Info**: Màu xanh dương (#3B82F6)
- **Loading**: Màu xanh dương (#3B82F6)

### Custom Toast Component
Sử dụng `CustomToast` component trong `src/components/ui/Toast.tsx` để có UI đẹp hơn với:
- Icon phù hợp cho từng loại
- Nút đóng (X)
- Border và background color tùy chỉnh
- Animation mượt mà

## Best Practices

### 1. Thời gian hiển thị
- **Success**: 3 giây
- **Error**: 5 giây (để user có thời gian đọc)
- **Warning**: 4 giây
- **Info**: 4 giây
- **Loading**: Không tự động đóng

### 2. Nội dung thông báo
- Sử dụng tiếng Việt
- Ngắn gọn, rõ ràng
- Tích cực với success, cụ thể với error
- Đưa ra hướng dẫn khi có thể

### 3. UX Guidelines
- Không spam quá nhiều toast cùng lúc
- Sử dụng `dismissAll()` trước khi hiển thị toast mới quan trọng
- Với loading dài, cung cấp thông tin tiến độ
- Luôn dismiss loading toast khi hoàn thành

## Test Page

Truy cập `/test-toast` để xem demo tất cả các loại toast và tính năng.

## Files liên quan

- `src/app/layout.tsx` - Cấu hình Toaster
- `src/hooks/useToast.ts` - Hook chính
- `src/components/ui/Toast.tsx` - Custom toast component
- `src/context/AuthContext.tsx` - Ví dụ sử dụng trong auth
- `src/app/login/page.tsx` - Ví dụ sử dụng trong login
- `src/components/dashboard/HomeHeader.tsx` - Ví dụ logout toast

## Migration từ Alert

### Trước (Alert)
```typescript
alert('Đăng nhập thành công!');
```

### Sau (Toast)
```typescript
toast.success('Đăng nhập thành công!');
```

### Lợi ích
- UX tốt hơn (không block UI)
- Styling đẹp và nhất quán
- Nhiều loại thông báo khác nhau
- Tự động đóng
- Responsive và mobile-friendly
- Có thể dismiss thủ công