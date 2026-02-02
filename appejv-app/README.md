# SLM App

Một ứng dụng di động phát triển bằng Expo và React Native.

## Giới thiệu

SLM App là một ứng dụng di động đa nền tảng được phát triển bằng công nghệ Expo và React Native, sử dụng TypeScript để đảm bảo tính an toàn cho mã nguồn. Ứng dụng tập trung vào việc quản lý sản phẩm, theo dõi hoa hồng, và tương tác với người dùng.

## Tính năng chính

- **Quản lý tài khoản**: Đăng nhập, cập nhật mật khẩu và quản lý thông tin cá nhân
- **Danh mục sản phẩm**: Duyệt và tìm kiếm sản phẩm theo danh mục và thương hiệu
- **Thống kê hoa hồng**: Theo dõi và phân tích hoa hồng
- **Thư viện ảnh**: Quản lý và xem thư viện ảnh sản phẩm
- **Báo giá**: Xem chi tiết báo giá và quản lý liên hệ

## Cài đặt

1. Cài đặt các dependencies:

   ```bash
   npm install
   ```

   hoặc

   ```bash
   yarn install
   ```

2. Khởi chạy ứng dụng:

   ```bash
   npx expo start
   ```

## Cấu trúc dự án

### Cấu trúc thư mục chính

```
slmapp/
├── app/                       # Chứa router và các trang (Expo Router)
│   ├── (auth)/                # Nhóm các trang liên quan đến xác thực
│   ├── (profile)/             # Nhóm các trang liên quan đến hồ sơ
│   ├── (products)/            # Nhóm các trang liên quan đến sản phẩm
│   ├── (brands)/              # Nhóm các trang liên quan đến thương hiệu
│   ├── (quotes)/              # Nhóm các trang liên quan đến báo giá
│   ├── (contacts)/            # Nhóm các trang liên quan đến liên hệ
│   ├── (stats)/               # Nhóm các trang liên quan đến thống kê
│   ├── (tabs)/                # Navigation tabs
│   ├── _layout.tsx            # Layout chính
│   └── +not-found.tsx         # Trang 404
├── src/                       # Mã nguồn chính của ứng dụng
│   ├── components/            # Các thành phần UI có thể tái sử dụng
│   │   ├── auth/              # Các thành phần xác thực
│   │   ├── layout/            # Các thành phần bố cục
│   │   ├── products/          # Các thành phần sản phẩm
│   │   ├── profile/           # Các thành phần hồ sơ
│   │   ├── ui/                # Các thành phần UI cơ bản
│   │   │   ├── buttons/
│   │   │   ├── cards/
│   │   │   ├── forms/
│   │   │   ├── modals/
│   │   │   └── typography/
│   │   └── shared/            # Các thành phần dùng chung
│   ├── hooks/                 # Các custom hooks
│   ├── context/               # Các context React
│   ├── services/              # Các dịch vụ API, xác thực và tích hợp bên thứ ba
│   ├── utils/                 # Các tiện ích
│   │   ├── helpers/           # Các hàm helper
│   │   ├── formatters/        # Các hàm định dạng
│   │   └── validation/        # Các hàm xác thực
│   ├── constants/             # Các hằng số và cấu hình
│   ├── models/                # Các kiểu TypeScript và interfaces
│   └── styles/                # Các styles, themes
├── assets/                    # Tài nguyên tĩnh
│   ├── images/
│   ├── fonts/
│   └── icons/
└── các file cấu hình
```

### Quy ước đặt tên

- **Thành phần**: PascalCase (ví dụ: `ProductCard.tsx`)
- **Hook**: camelCase với tiền tố "use" (ví dụ: `useAuth.ts`)
- **Context**: PascalCase với hậu tố "Context" (ví dụ: `AuthContext.tsx`)
- **Utilities**: camelCase (ví dụ: `formatDate.ts`)

## Công nghệ sử dụng

- **Expo**: Framework phát triển ứng dụng React Native
- **Expo Router**: Hệ thống định tuyến file-based
- **React Native**: Framework phát triển ứng dụng di động
- **TypeScript**: Ngôn ngữ lập trình an toàn kiểu dữ liệu
- **AsyncStorage**: Lưu trữ dữ liệu cục bộ
- **Reanimated**: Animations mượt mà
- **Ant Design React Native**: Thư viện UI components

## Các lệnh hữu ích

```bash
# Khởi chạy ứng dụng
npx expo start

# Khởi chạy trên Android
npm run android

# Khởi chạy trên iOS
npm run ios

# Khởi chạy trên web
npm run web

# Chạy tests
npm run test

# Kiểm tra lỗi linting
npm run lint

# Cấu trúc lại dự án
npm run setup-structure

# Tạo lại symbolic links
npm run create-symlinks

# Cập nhật các import paths
npm run update-imports
```

## Build và Triển khai ứng dụng

### Build cho Web

Để export ứng dụng sang web, thực hiện các bước sau:

```bash
# Build ứng dụng web
npx expo export --platform web

# Chạy thử ứng dụng web đã build
npx serve dist
```

Sau khi build thành công, thư mục `dist` sẽ chứa tất cả các file cần thiết để triển khai ứng dụng web. Bạn có thể triển khai thư mục này lên các dịch vụ hosting như Vercel, Netlify, Firebase Hosting, hoặc GitHub Pages.

### Build cho iOS với EAS Build

EAS Build là dịch vụ build từ xa của Expo cho phép bạn build ứng dụng iOS mà không cần môi trường macOS cục bộ.

#### Chuẩn bị

Đảm bảo bạn đã cài đặt EAS CLI:

```bash
npm install -g eas-cli
```

#### Đăng nhập vào Expo

```bash
eas login
```

#### Build ứng dụng iOS

```bash
# Build cho Simulator (phát triển)
eas build --platform ios --profile development

# Build phiên bản Preview (phân phối nội bộ)
eas build --platform ios --profile preview

# Build phiên bản Production (phát hành chính thức)
eas build --platform ios --profile production
```

#### Quản lý và theo dõi builds

```bash
# Xem danh sách các builds đã thực hiện
eas build:list

# Kiểm tra trạng thái của một build cụ thể
eas build:show <build-id>
```

#### Gửi ứng dụng lên App Store

```bash
eas submit --platform ios --profile production
```

#### Cấu hình chứng chỉ

```bash
# Quản lý chứng chỉ iOS
eas credentials --platform ios
```

### Build cho Android với EAS Build

```bash
# Build cho thiết bị phát triển
eas build --platform android --profile development

# Build phiên bản Preview (phân phối nội bộ)
eas build --platform android --profile preview

# Build phiên bản Production (phát hành chính thức)
eas build --platform android --profile production
```

#### Build file APK cho Android

Để build file APK (thay vì file AAB mặc định), bạn có thể sử dụng profile đã được cấu hình sẵn trong `eas.json`:

```bash
# Build APK phiên bản Preview
eas build --platform android --profile preview-apk

# Build APK phiên bản Production
eas build --platform android --profile production-apk
```

Sau khi lệnh build được thực thi:

1. Theo dõi tiến trình build trong terminal
2. Sau khi build hoàn tất, EAS sẽ cung cấp URL để tải xuống file

**Lưu ý về file APK:**

- File APK có thể cài đặt trực tiếp trên thiết bị Android mà không cần thông qua Google Play Store
- Kích thước file APK thường lớn hơn file AAB (Android App Bundle)
- Phù hợp cho việc phân phối trực tiếp hoặc kiểm thử ứng dụng

**Cấu hình trong eas.json:**

```json
"preview-apk": {
  "extends": "preview",
  "android": {
    "buildType": "apk",
    "gradleCommand": ":app:assembleRelease"
  },
  "env": {
    "APP_ENV": "staging"
  }
},
"production-apk": {
  "extends": "production",
  "android": {
    "buildType": "apk",
    "gradleCommand": ":app:assembleRelease"
  }
}
```

#### Gửi ứng dụng lên Google Play

```bash
eas submit --platform android --profile production
```

## Tìm hiểu thêm

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
