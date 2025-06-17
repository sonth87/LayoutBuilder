# preset-web

Preset cho layout builder của GrapesJS


## Usage

```javascript
const editor = grapesjs.init({
  container: '#gjs',
  plugins: [preset-web],
  pluginsOpts: {
    'preset-web': {
      // Plugin options
      brackets: ['{{', '}}'], // Variable brackets
      keyboardMoveStep: 1,    // Keyboard navigation step
    }
  }
});
```

## API Reference

### 1. Extract Variables

Extract variables from the editor content based on bracket patterns.

```javascript
// Extract all variables from the editor
const result = await editor.extractVariables();

console.log(result);
// Output:
// {
//   brackets: ['{{', '}}'],
//   fields: {
//     'component-id-1': 'user_name',
//     'component-id-2': 'product_title'
//   },
//   values: {
//     'user_name': '',
//     'product_title': ''
//   }
// }
```

**Returns:**
- `brackets`: Pattern nhận biết 1 biến
- `fields`: Map các ID component với tên biến  
- `values`: Map các tên biến và giá trị


### 2. Dynamic Block Management

Thêm block động vào Block Manager.

```javascript
// Add a custom text block
editor.BlockManager.add('custom-text-block', {
  label: 'Custom Text',
  category: 'Basic',
  content: {
    type: 'text',
    content: 'Custom text content',
    style: {
      padding: '10px',
      'font-size': '16px'
    }
  },
  attributes: {
    title: 'Add custom text block'
  }
});

// Add a complex component block
editor.BlockManager.add('hero-section', {
  label: 'Hero Section',
  category: 'Sections',
  content: `
    <div class="hero-section">
      <h1>{{hero_title}}</h1>
      <p>{{hero_description}}</p>
      <button>{{cta_text}}</button>
    </div>
  `,
  attributes: {
    title: 'Add hero section with variables'
  }
});

// Add a variable block
editor.BlockManager.add('variable-block', {
  label: 'Variable',
  category: 'Dynamic',
  content: {
    type: 'variable',
    components: [
      {
        type: 'textnode',
        content: '{{new_variable}}'
      }
    ]
  }
});
```

**Block Properties:**
- `label`: Tên hiển thị trong panel block
- `category`: Nhóm block theo danh mục
- `content`: Chuỗi HTML hoặc định nghĩa component
- `attributes`: Thuộc tính bổ sung như tooltip


## Features

### Variable
- **Pattern Detection**: Tự động tìm pattern `{{variable_name}}`
- **Component Tracking**: Map biến với component cụ thể
- **Unique Collection**: Thu thập tất cả tên biến duy nhất
- **Custom Brackets**: Pattern ký hiệu có thể cấu hình

### Block Management
- **Dynamic Addition**: Thêm block bằng code
- **Categories**: Tổ chức block theo nhóm
- **Template Support**: Chuỗi HTML hoặc object component
- **Variable Integration**: Block có thể chứa biến

### [Keyboard Feature](src/utils/keyboard-feature.md)

### [Zoom Feature](src/utils/zoom-feature.md)

### [Context Menu Feature](src/utils/contextMenu/contextMenu.md)

## Plugin Options

```javascript
{
  brackets: ['{{', '}}'],           // Variable bracket pattern
  keyboardMoveStep: 1,              // Pixels per arrow key press
  zoomStep: 5,                      // Zoom percentage per step
  minZoom: 25,                      // Minimum zoom level
  maxZoom: 200,                     // Maximum zoom level
  panelCategory: 'Custom Category'   // Panel button category
}
```
