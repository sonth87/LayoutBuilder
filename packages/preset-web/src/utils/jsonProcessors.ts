import { Editor } from "../types/pluginOptions";

/**
 * Hàm trích xuất tất cả các trường dữ liệu có dạng {{field_name}} từ JSON của GrapesJS
 * @param editor GrapesJS Editor instance
 * @param customBrackets Tùy chọn cặp dấu ngoặc, mặc định là ["{{", "}}"]
 * @returns Promise chứa thông tin về bracket pattern, fields được trích xuất và values
 */
export const extractDataFields = async (
  editor: Editor,
  customBrackets: [string, string] = ["{{", "}}"]
): Promise<{
  brackets: [string, string];
  fields: Record<string, string>;
  values: Record<string, string>;
}> => {
  const json = editor.getProjectData();
  const fields: Record<string, string> = {};
  const brackets = customBrackets;

  // Object để theo dõi các giá trị duy nhất
  const uniqueFieldValues = new Set<string>();

  // Tạo regex động dựa trên brackets
  const openBracket = brackets[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const closeBracket = brackets[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = `${openBracket}\\s*([^${closeBracket}]+?)\\s*${closeBracket}`;
  const regex = new RegExp(pattern, "g");

  // Hàm đệ quy để duyệt qua components
  const traverseComponents = (components: any[], parentId?: string): void => {
    if (!Array.isArray(components)) return;

    components.forEach((component) => {
      const currentId = component.attributes?.id || parentId;

      // Kiểm tra content của textnode
      if (component.type === "textnode" && component.content) {
        regex.lastIndex = 0;
        let match;

        while ((match = regex.exec(component.content)) !== null) {
          const fieldValue = match[1].trim();

          if (currentId && fieldValue) {
            fields[currentId] = fieldValue;
            uniqueFieldValues.add(fieldValue);
          }
        }
      }

      // Kiểm tra attributes với data-ost-type hoặc other attributes
      if (component.attributes) {
        Object.entries(component.attributes).forEach(([key, value]) => {
          if (typeof value === "string") {
            regex.lastIndex = 0;
            let match;

            while ((match = regex.exec(value)) !== null) {
              const fieldValue = match[1].trim();

              if (currentId && fieldValue) {
                fields[currentId] = fieldValue;
                uniqueFieldValues.add(fieldValue);
              }
            }
          }
        });
      }

      // Duyệt components con
      if (component.components) {
        traverseComponents(component.components, currentId);
      }
    });
  };

  // Duyệt qua tất cả pages và frames
  if (json.pages && Array.isArray(json.pages)) {
    json.pages.forEach((page: any) => {
      if (page.frames && Array.isArray(page.frames)) {
        page.frames.forEach((frame: any) => {
          if (frame.component && frame.component.components) {
            traverseComponents(frame.component.components);
          }
        });
      }
    });
  }

  // Tạo đối tượng values với giá trị rỗng cho mỗi field duy nhất
  const values: Record<string, string> = {};
  uniqueFieldValues.forEach((fieldName) => {
    values[fieldName] = "";
  });

  return {
    brackets,
    fields,
    values,
  };
};

/**
 * Hàm loại bỏ các thuộc tính không cần thiết từ JSON của GrapesJS
 * @param editor GrapesJS Editor instance
 * @returns JSON đã được làm sạch, không còn thuộc tính style, stylable, droppable, draggable
 */
export const removeStyleProperties = (editor: Editor) => {
  const json = editor.getProjectData();

  // Danh sách thuộc tính cần loại bỏ
  const propsToRemove = [
    "style",
    "stylable",
    "droppable",
    "draggable",
    "resizable",
    "void",
    "classes", // Loại bỏ classes
  ];

  // Hàm đệ quy để xử lý loại bỏ các thuộc tính không cần thiết
  const cleanObject = (obj: any): any => {
    if (!obj || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => cleanObject(item));
    }

    const cleaned: any = {};

    Object.keys(obj).forEach((key) => {
      // Bỏ qua các thuộc tính cần loại bỏ
      if (propsToRemove.includes(key)) return;

      // Xử lý đặc biệt cho attributes - loại bỏ style attribute
      if (key === "attributes" && typeof obj[key] === "object") {
        const cleanedAttrs: any = {};
        Object.keys(obj[key]).forEach((attrKey) => {
          if (attrKey !== "style") {
            // Loại bỏ style attribute
            cleanedAttrs[attrKey] = obj[key][attrKey];
          }
        });
        if (Object.keys(cleanedAttrs).length > 0) {
          cleaned[key] = cleanedAttrs;
        }
      }
      // Xử lý đệ quy các thuộc tính là object
      else if (typeof obj[key] === "object" && obj[key] !== null) {
        cleaned[key] = cleanObject(obj[key]);
      }
      // Giữ nguyên các thuộc tính khác
      else {
        cleaned[key] = obj[key];
      }
    });

    return cleaned;
  };

  // Xử lý JSON chính
  const cleanedJson: any = {};

  // Giữ lại assets
  if (json.assets) {
    cleanedJson.assets = json.assets;
  }

  // Bỏ qua styles hoàn toàn - không thêm vào kết quả

  // Xử lý các pages
  if (json.pages && Array.isArray(json.pages)) {
    cleanedJson.pages = json.pages.map((page: any) => {
      const cleanedPage: any = { id: page.id };

      if (page.frames && Array.isArray(page.frames)) {
        cleanedPage.frames = page.frames.map((frame: any) => {
          const cleanedFrame: any = { id: frame.id };

          if (frame.component) {
            cleanedFrame.component = cleanObject(frame.component);
          }

          return cleanedFrame;
        });
      }

      return cleanedPage;
    });
  }

  // Xử lý symbols nếu có
  if (json.symbols && Array.isArray(json.symbols)) {
    cleanedJson.symbols = cleanObject(json.symbols);
  }

  // Xử lý dataSources nếu có
  if (json.dataSources) {
    cleanedJson.dataSources = json.dataSources;
  }

  return cleanedJson;
};
