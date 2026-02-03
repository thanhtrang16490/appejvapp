# APPE JV Admin Panel - Setup Guide

## Tổng quan
Hệ thống admin panel cho APPE JV Vietnam được xây dựng với Next.js 14 và Supabase. Hướng dẫn này sẽ giúp bạn thiết lập hoàn chỉnh hệ thống.

## Bước 1: Cài đặt Dependencies

```bash
cd appejv-api
npm install
```

## Bước 2: Cấu hình Environment Variables

File `.env.local` đã được cấu hình với thông tin Supabase:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hcwrvedgeskddfhecxpe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin Configuration
ADMIN_EMAIL=admin@appejv.vn
ADMIN_PASSWORD=appejv2024
```

## Bước 3: Tạo Database Tables trong Supabase

### Cách 1: Sử dụng Supabase Dashboard (Khuyến nghị)

1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project: `hcwrvedgeskddfhecxpe`
3. Vào **SQL Editor**
4. Copy toàn bộ nội dung file `database/setup-manual.sql`
5. Paste vào SQL Editor và click **Run**

### Cách 2: Sử dụng script tự động (nếu có lỗi, dùng cách 1)

```bash
npm run create-tables
```

## Bước 4: Seed Dữ liệu Mẫu

Sau khi tạo tables thành công, bạn có thể chọn một trong hai cách để thêm dữ liệu:

### Cách 1: Import dữ liệu mock từ appejv-web (Khuyến nghị)

```bash
npm run import-mock
```

Script này sẽ import:
- ✅ 2 sectors (Thức ăn gia súc, Thức ăn gia cầm)
- ✅ 41 sản phẩm thực từ bảng giá APPE JV
- ✅ 10 bài viết hướng dẫn và tin tức
- ✅ 5 người dùng mẫu (agents và customers)

### Cách 2: Seed dữ liệu cơ bản

```bash
npm run setup-db
```

### Reset dữ liệu (nếu cần)

```bash
npm run reset-data
```

## Bước 5: Tạo Admin User trong Supabase Auth

1. Vào **Authentication** → **Users** trong Supabase Dashboard
2. Click **Add user**
3. Nhập thông tin:
   - **Email**: `admin@appejv.vn`
   - **Password**: `appejv2024`
   - **Email Confirm**: ✅ (checked)
4. Click **Create user**

## Bước 6: Chạy Development Server

```bash
npm run dev
```

Server sẽ chạy tại: http://localhost:3001

## Bước 7: Đăng nhập Admin Panel

1. Truy cập http://localhost:3001
2. Đăng nhập với:
   - **Email**: admin@appejv.vn
   - **Password**: appejv2024

## Kiểm tra Setup

### 1. Database Tables
Kiểm tra các tables đã được tạo trong Supabase:
- ✅ `roles` (4 records)
- ✅ `users` (1 admin user)
- ✅ `sectors` (2 sectors: Gia súc, Gia cầm)
- ✅ `products` (12+ sản phẩm APPE JV)
- ✅ `contents` (4+ bài viết)

### 2. Admin Panel Features
- ✅ Dashboard với thống kê
- ✅ Quản lý người dùng
- ✅ Quản lý sản phẩm
- ✅ Quản lý lĩnh vực
- ✅ Quản lý nội dung
- ✅ Analytics với biểu đồ
- ✅ Cài đặt hệ thống

### 3. API Endpoints
Test các API endpoints:
- GET http://localhost:3001/api/users
- GET http://localhost:3001/api/products
- GET http://localhost:3001/api/sectors
- GET http://localhost:3001/api/contents

## Troubleshooting

### Lỗi: "Could not find the table"
- **Nguyên nhân**: Database tables chưa được tạo
- **Giải pháp**: Chạy lại SQL script trong Supabase Dashboard

### Lỗi: "Invalid login credentials"
- **Nguyên nhân**: Admin user chưa được tạo trong Supabase Auth
- **Giải pháp**: Tạo user trong Authentication → Users

### Lỗi: "Row Level Security"
- **Nguyên nhân**: RLS policies chưa được setup
- **Giải pháp**: Chạy lại toàn bộ SQL script

### Lỗi: "CORS"
- **Nguyên nhân**: API không cho phép truy cập từ domain khác
- **Giải pháp**: Kiểm tra CORS_ORIGIN trong .env.local

## Cấu trúc Project

```
appejv-api/
├── src/
│   ├── app/
│   │   ├── dashboard/          # Admin pages
│   │   ├── api/               # API routes
│   │   └── login/             # Login page
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities (Supabase client)
│   └── types/                 # TypeScript types
├── database/
│   ├── schema.sql             # Complete database schema
│   └── setup-manual.sql       # Manual setup script
├── scripts/
│   ├── setup-database.js      # Data seeding script
│   └── create-tables.js       # Table creation script
└── public/                    # Static assets
```

## Tính năng chính

### Dashboard
- Thống kê tổng quan: Users, Products, Sectors, Contents
- Biểu đồ tương tác với Recharts
- Danh sách hoạt động gần đây

### Quản lý dữ liệu
- **Users**: CRUD với phân quyền, hoa hồng
- **Products**: Quản lý sản phẩm thức ăn chăn nuôi
- **Sectors**: Quản lý lĩnh vực (Gia súc, Gia cầm)
- **Contents**: Quản lý bài viết, tin tức

### API
- RESTful API với pagination
- Authentication với Supabase
- CORS support cho appejv-web

## Bảo mật

- ✅ Supabase Authentication
- ✅ Row Level Security (RLS)
- ✅ Environment variables
- ✅ Role-based access control
- ✅ CORS configuration

## Deployment

### Vercel (Khuyến nghị)
1. Push code lên GitHub
2. Connect với Vercel
3. Cấu hình environment variables
4. Deploy tự động

### Manual
```bash
npm run build
npm start
```

## Liên hệ hỗ trợ

- **Company**: CÔNG TY CỔ PHẦN APPE JV VIỆT NAM
- **Address**: Km 50, Quốc lộ 1A, xã Tiên Tân, Tp Phủ Lý, tỉnh Hà Nam
- **Phone**: 03513 595 030
- **Website**: www.appe.vn