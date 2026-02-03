# APPE JV Admin Panel & API

Hệ thống quản trị và API cho ứng dụng thức ăn chăn nuôi APPE JV Vietnam.

## Tính năng

### Admin Panel
- 🏠 **Dashboard**: Tổng quan hệ thống với thống kê và biểu đồ
- 👥 **Quản lý người dùng**: CRUD người dùng, phân quyền, quản lý hoa hồng
- 🏢 **Quản lý lĩnh vực**: Quản lý các lĩnh vực kinh doanh (Gia súc, Gia cầm)
- 📦 **Quản lý sản phẩm**: CRUD sản phẩm thức ăn chăn nuôi với giá cả
- 📝 **Quản lý nội dung**: Quản lý bài viết, hướng dẫn, tin tức
- 📊 **Thống kê & Phân tích**: Báo cáo chi tiết, biểu đồ tương tác
- ⚙️ **Cài đặt hệ thống**: Cấu hình bảo mật, thông báo, API

### API Endpoints
- `GET /api/users` - Danh sách người dùng
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/sectors` - Danh sách lĩnh vực
- `GET /api/contents` - Danh sách nội dung
- Hỗ trợ pagination, search, filtering

## Công nghệ sử dụng

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI**: Tailwind CSS + Lucide Icons
- **Charts**: Recharts
- **Language**: TypeScript

## Cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd appejv-api
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Cấu hình environment variables**
```bash
cp .env.example .env.local
```

Cập nhật các biến môi trường trong `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. **Tạo database tables trong Supabase**

Truy cập Supabase Dashboard → SQL Editor và chạy script `database/schema.sql`:

```bash
# Copy nội dung file database/schema.sql và paste vào Supabase SQL Editor
# Hoặc sử dụng script tự động (nếu có quyền admin):
npm run create-tables
```

5. **Seed dữ liệu mẫu**
```bash
npm run setup-db
```

6. **Chạy development server**
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3001`

## Đăng nhập Admin

- **Email**: admin@appejv.vn
- **Password**: appejv2024

*Lưu ý: Cần tạo user admin trong Supabase Auth Dashboard với email trên.*

## Cấu trúc Database

### Tables

#### users
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `name` (String)
- `phone` (String)
- `role_id` (Integer, Foreign Key)
- `parent_id` (UUID, Foreign Key, Nullable)
- `commission_rate` (Decimal, Nullable)
- `total_commission` (Decimal, Nullable)
- `address` (Text, Nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### roles
- `id` (Integer, Primary Key)
- `name` (String)
- `description` (Text, Nullable)
- `created_at` (Timestamp)

#### sectors
- `id` (Integer, Primary Key)
- `name` (String)
- `description` (Text, Nullable)
- `image` (String, Nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### products
- `id` (Integer, Primary Key)
- `name` (String)
- `description` (Text, Nullable)
- `price` (Decimal)
- `sector_id` (Integer, Foreign Key)
- `image` (String, Nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### contents
- `id` (Integer, Primary Key)
- `title` (String)
- `content` (Text)
- `image` (String, Nullable)
- `brand` (String, Nullable)
- `category` (String, Nullable)
- `sector_id` (Integer, Foreign Key)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Deployment

### Vercel
1. Push code lên GitHub
2. Connect repository với Vercel
3. Cấu hình environment variables
4. Deploy

### Manual
```bash
npm run build
npm start
```

## API Usage

### Authentication
Sử dụng Supabase Auth để xác thực. Admin cần đăng nhập để truy cập dashboard.

### CORS
API hỗ trợ CORS cho phép truy cập từ `appejv-web` application.

### Rate Limiting
Chưa implement - có thể thêm middleware để giới hạn request.

## Bảo mật

- ✅ Authentication với Supabase
- ✅ Role-based access control
- ✅ Environment variables cho sensitive data
- ✅ CORS configuration
- ⚠️ Rate limiting (chưa implement)
- ⚠️ Input validation (cần cải thiện)

## Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## License

© 2024 APPE JV Vietnam. All rights reserved.