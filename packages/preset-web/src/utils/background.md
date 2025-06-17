# Background Canvas API

Chức năng set background để hiển thị trong canvas. Background này chỉ dùng để hiển thị và sẽ không được lưu vào project data.

## API Reference

### `editor.setCanvasBackground(background: BackgroundType): boolean`

Set background cho canvas hiện tại.

**Parameters:**

- `background`: BackgroundOptions | string

**Returns:**

- `boolean`: `true` nếu set thành công, `false` nếu có lỗi

**Examples:**

```javascript
// Set màu nền
editor.setCanvasBackground("#ff0000");

// Set ảnh nền
editor.setCanvasBackground("https://example.com/image.jpg");

// Set gradient
editor.setCanvasBackground("linear-gradient(45deg, #ff0000, #0000ff)");

// Set với options chi tiết
editor.setCanvasBackground({
  color: "#ffffff",
  image: "https://example.com/bg.jpg",
  size: "cover",
  position: "center",
  repeat: "no-repeat",
});
```

### `editor.getCanvasBackground(): BackgroundType | null`

Lấy thông tin background hiện tại của canvas.

**Returns:**

- `BackgroundOptions`: Object chứa thông tin background hiện tại
- `null`: Nếu không tìm thấy canvas

**Example:**

```javascript
const currentBg = editor.getCanvasBackground();
console.log(currentBg);
// Output:
// {
//   color: '#ffffff',
//   image: 'url(https://example.com/bg.jpg)',
//   size: 'cover',
//   position: 'center',
//   repeat: 'no-repeat',
//   attachment: 'scroll'
// }
```

### `editor.resetCanvasBackground(): boolean`

Reset background của canvas về trạng thái mặc định (trong suốt).

**Returns:**

- `boolean`: `true` nếu reset thành công, `false` nếu có lỗi

**Example:**

```javascript
editor.resetCanvasBackground();
```

## Type Definitions

### `BackgroundOptions`

```typescript
interface BackgroundOptions {
  color?: string; // Màu nền (hex, rgb, hsl, named colors)
  image?: string; // URL ảnh nền
  size?: "auto" | "cover" | "contain" | string; // Kích thước ảnh nền
  position?: "center" | "top" | "bottom" | "left" | "right" | string; // Vị trí ảnh nền
  repeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y"; // Lặp lại ảnh nền
  attachment?: "scroll" | "fixed" | "local"; // Cách ảnh nền di chuyển khi scroll
}
```

### `BackgroundType`

```typescript
type BackgroundType = string | BackgroundOptions;
```

## Events Listeners

Plugin sẽ trigger các events sau:

### `canvas:background-change`

Được trigger khi background của canvas thay đổi.

```javascript
editor.on("canvas:background-change", (data) => {
  console.log("Canvas background changed:", data.background);
});
```

### `canvas:background-reset`

Được trigger khi background của canvas được reset.

```javascript
editor.on("canvas:background-reset", () => {
  console.log("Canvas background reset");
});
```

## Use Cases

### Theme Switching

```javascript
// Light theme
editor.setCanvasBackground("#ffffff");

// Dark theme
editor.setCanvasBackground("#1a1a1a");

// Custom theme with image
editor.setCanvasBackground({
  color: "#f5f5f5",
  image: "https://example.com/pattern.png",
  repeat: "repeat",
});
```

### Responsive Backgrounds

```javascript
// Set background dựa trên device hiện tại
editor.on("change:device", (device) => {
  const deviceName = device.get("name");

  switch (deviceName) {
    case "Desktop":
      editor.setCanvasBackground({
        image: "https://example.com/desktop-bg.jpg",
        size: "cover",
      });
      break;
    case "Mobile":
      editor.setCanvasBackground({
        image: "https://example.com/mobile-bg.jpg",
        size: "contain",
      });
      break;
    default:
      editor.resetCanvasBackground();
  }
});
```

## Notes

- Background được set chỉ ảnh hưởng đến việc hiển thị trong canvas
- Background không được lưu vào project data hoặc export JSON
- Khi reset canvas hoặc reload editor, background sẽ trở về trạng thái mặc định
- Background chỉ áp dụng cho body của iframe canvas, không ảnh hưởng đến components
