# Context Menu Documentation

Context Menu khi nhấp chuột phải trên từng component

## Tính năng chính

- ✅ Menu ngữ cảnh khi nhấp chuột phải vào component
- ✅ Các chức năng mặc định: Styling, Settings, Layer View, Properties, Delete
- ✅ Hỗ trợ tùy chỉnh menu items
- ✅ Điều kiện hiển thị item dựa trên component
- ✅ Sắp xếp thứ tự hiển thị
- ✅ Tắt/bật các chức năng mặc định
- ✅ Auto-hide khi click bên ngoài hoặc nhấn Escape

## Cấu hình cơ bản

```typescript
const editor = grapesjs.init({
  plugins: ["preset-web"],
  pluginsOpts: {
    "preset-web": {
      contextMenu: {
        enableDefaultItems: true, // Bật/tắt items mặc định
        disabledItems: [], // Tắt items mặc định theo tên
        customItems: [], // Thêm items tùy chỉnh
        itemOrder: [], // Sắp xếp thứ tự hiển thị
      },
    },
  },
});
```

## Interface và Types

### ContextMenuItem

```typescript
type ContextMenuItem = {
  label: string; // Tên hiển thị
  icon: string; // CSS class cho icon (VD: "fa fa-copy")
  description: string; // Mô tả chi tiết
  danger?: boolean; // Hiển thị màu đỏ cho action nguy hiểm
  action: (component: any, editor: any) => void; // Hàm thực thi khi click
  visible?: (component: any, editor: any) => boolean; // Điều kiện hiển thị
};
```

### ContextMenuConfig

```typescript
interface ContextMenuConfig {
  enableDefaultItems?: boolean; // Có sử dụng menu mặc định không
  customItems?: ContextMenuItem[]; // Các item tùy chỉnh
  itemOrder?: string[]; // Thứ tự hiển thị các item
  disabledItems?: string[]; // Tắt các item mặc định
}
```

## Items mặc định

Context menu cung cấp các chức năng mặc định sau:

| Item            | Icon                | Mô tả               | Command              |
| --------------- | ------------------- | ------------------- | -------------------- |
| **Styling**     | `fa fa-paint-brush` | Mở Style Manager    | `open-sm`            |
| **Settings**    | `fa fa-cog`         | Mở Settings Manager | `open-tm`            |
| **Layout View** | `fa fa-sitemap`     | Mở Layer Manager    | `open-layers`        |
| **Properties**  | `fa fa-list-ul`     | Cấu hình Attributes | Modal dialog         |
| **Delete**      | `fa fa-trash`       | Xóa Component       | `component.remove()` |

## Custom Items

### Thêm item đơn giản

```typescript
pluginsOpts: {
  "preset-web": {
    contextMenu: {
      customItems: [
        {
          label: "Copy HTML",
          icon: "fa fa-code",
          description: "Copy component HTML to clipboard",
          action: (component, editor) => {
            const html = component.toHTML();
            navigator.clipboard.writeText(html);
            alert("HTML copied to clipboard!!!!!!");
          },
        },
      ],
    },
  },
},
```

## Sắp xếp thứ tự

```typescript
contextMenu: {
  enableDefaultItems: true,
  customItems: [
    { label: "Duplicate", /* ... */ },
    { label: "Move Up", /* ... */ },
    { label: "Move Down", /* ... */ }
  ],
  itemOrder: [
    'styling',      // Items mặc định
    'settings',
    'duplicate',    // Custom items
    'move up',
    'move down',
    'properties',
    'delete'
  ]
}
```
