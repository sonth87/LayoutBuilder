# Chức năng Zoom và Pan

## Usage

### Zoom & Pan

- **Zoom In/Out**: Cho phép zoom in, out để dễ theo dõi layout. Sử dụng phím tắt hoặc chuột để zoom
- **Mouse Wheel**: Ctrl/Cmd + scroll để zoom
- **Middle Click**: Giữ phím giữa chuột để di chuyển canvas
- **Reset Functions**: Reset zoom và vị trí

## Event Listeners

```javascript
editor.on("zoom:level-change", (data) => {
  console.log("Zoom changed from", data.oldZoom, "to", data.newZoom);
});
```
