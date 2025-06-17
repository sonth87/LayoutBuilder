# Template Management Features

Đã thêm 3 trang mới để quản lý templates trong ứng dụng layout-builder:

## 1. Trang Danh Sách Templates (`/templates`)

- **Đường dẫn**: `/templates`
- **Component**: `TemplateList.tsx`
- **Chức năng**:
  - Hiển thị danh sách tất cả templates
  - Tìm kiếm templates theo tên và mô tả
  - Xem, chỉnh sửa, và xóa templates
  - Tạo template mới
  - Loading state và error handling
  - Responsive grid layout

## 2. Trang Chi Tiết Template (`/templates/:id`)

- **Đường dẫn**: `/templates/:id`
- **Component**: `TemplateDetail.tsx`
- **Chức năng**:
  - Hiển thị thông tin chi tiết của template
  - Preview HTML content trong tab mới
  - Chỉnh sửa template
  - Xóa template với xác nhận
  - Sao chép slug
  - Tải xuống HTML file
  - Hiển thị metadata (ngày tạo, cập nhật, tác giả)

## 3. Trang Chỉnh Sửa/Tạo Template (`/templates/:id/edit` và `/templates/new`)

- **Đường dẫn**:
  - `/templates/:id/edit` (chỉnh sửa)
  - `/templates/new` (tạo mới)
- **Component**: `TemplateEdit.tsx`
- **Chức năng**:
  - 3 tabs chính:
    - **Thông tin cơ bản**: Tên, slug, mô tả
    - **Visual Builder**: Sử dụng WebBuilder component
    - **HTML Code**: Chỉnh sửa trực tiếp HTML
  - Auto-generate slug từ tên template
  - Preview template trong tab mới
  - Validation form đầu vào
  - Save template với loading state

## API Integration

Các trang sử dụng TanStack Query để tích hợp với API:

- `getTemplates()` - Lấy danh sách templates
- `getTemplateById()` - Lấy chi tiết template
- `saveTemplate()` - Tạo template mới
- `updateTemplate()` - Cập nhật template
- `deleteTemplate()` - Xóa template

## Navigation

- **Header**: Thêm link "Templates" vào header
- **Home Page**: Thêm button "Quản lý Templates"
- **Breadcrumb**: Navigation giữa các trang template

## UI/UX Features

- **Modern Design**: Sử dụng shadcn/ui components
- **Vietnamese Language**: Toàn bộ interface bằng tiếng Việt
- **Responsive**: Hoạt động tốt trên mobile và desktop
- **Loading States**: Skeleton loading cho tất cả trang
- **Error Handling**: Xử lý lỗi và hiển thị thông báo
- **Toast Notifications**: Thông báo thành công/lỗi
- **Confirmation Dialogs**: Xác nhận trước khi xóa

## Usage

1. **Xem danh sách templates**: Truy cập `/templates`
2. **Tạo template mới**: Click "Tạo Template Mới" hoặc truy cập `/templates/new`
3. **Xem chi tiết**: Click "Xem" trên template trong danh sách
4. **Chỉnh sửa**: Click "Edit" hoặc truy cập `/templates/:id/edit`
5. **Xóa**: Click icon thùng rác và xác nhận

## Technical Details

- **React Router**: Sử dụng React Router v6 cho navigation
- **TanStack Query**: Quản lý state và caching API calls
- **shadcn/ui**: Component library cho UI
- **TypeScript**: Type safety cho tất cả components
- **Responsive Design**: Sử dụng Tailwind CSS grid system
