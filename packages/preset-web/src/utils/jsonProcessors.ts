import type { Editor } from "grapesjs";

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

  // Object để theo dõi các giá trị duy nhất (sẽ được chuyển thành values)
  const uniqueFieldValues = new Set<string>();

  // Tạo regex động dựa trên brackets
  const openBracket = brackets[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape các ký tự đặc biệt
  const closeBracket = brackets[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = `${openBracket}\\s*([^${closeBracket}]+?)\\s*${closeBracket}`;
  const regex = new RegExp(pattern, "g");

  // Hàm đệ quy để duyệt qua toàn bộ cây JSON
  const traverse = async (obj: any, parentId?: string) => {
    // Xử lý bất đồng bộ để không block main thread
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!obj || typeof obj !== "object") {
          resolve();
          return;
        }

        const promises: Promise<void>[] = [];

        // Xử lý nội dung text
        if (obj.content && typeof obj.content === "string") {
          // Reset lastIndex để đảm bảo regex bắt đầu từ đầu chuỗi
          regex.lastIndex = 0;
          let match;

          // Tìm tất cả các pattern trong chuỗi
          while ((match = regex.exec(obj.content)) !== null) {
            const fieldValue = match[1].trim();
            const elementId = obj.attributes?.id || parentId;

            if (elementId && fieldValue) {
              fields[elementId] = fieldValue;

              // Thêm fieldValue vào tập hợp các giá trị duy nhất
              uniqueFieldValues.add(fieldValue);
            }
          }
        }

        // Nếu có attributes.id, lưu lại để sử dụng cho các phần tử con
        const currentId = obj.attributes?.id || parentId;

        // Duyệt qua các components con
        if (Array.isArray(obj.components)) {
          obj.components.forEach((comp: any) => {
            promises.push(traverse(comp, currentId));
          });
        }

        // Duyệt qua các thuộc tính khác trong object
        Object.keys(obj).forEach((key) => {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            promises.push(traverse(obj[key], currentId));
          }
        });

        // Chờ tất cả các promise hoàn thành
        Promise.all(promises).then(() => resolve());
      }, 0);
    });
  };

  // Bắt đầu duyệt từ root
  await traverse(json);

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
  ];

  // Hàm đệ quy để xử lý loại bỏ các thuộc tính không cần thiết
  const cleanObject = (obj: any): any => {
    // Nếu không phải object hoặc là null, trả về nguyên giá trị
    if (!obj || typeof obj !== "object") return obj;

    // Nếu là array, xử lý từng phần tử
    if (Array.isArray(obj)) {
      return obj.map((item) => cleanObject(item));
    }

    // Tạo object mới để lưu kết quả
    const cleaned: any = {};

    // Duyệt qua các thuộc tính
    Object.keys(obj).forEach((key) => {
      // Bỏ qua các thuộc tính cần loại bỏ
      if (propsToRemove.includes(key)) return;

      // Xử lý đệ quy các thuộc tính là object
      if (typeof obj[key] === "object" && obj[key] !== null) {
        cleaned[key] = cleanObject(obj[key]);
      }
      // Giữ nguyên các thuộc tính khác
      else {
        cleaned[key] = obj[key];
      }
    });

    return cleaned;
  };

  // Xử lý từng phần chính của JSON
  const cleanedJson: any = {};

  // Loại bỏ hoàn toàn phần styles
  if (json.assets) {
    cleanedJson.assets = cleanObject(json.assets);
  }

  // Loại bỏ hoàn toàn phần styles
  if (json.dataSources) {
    cleanedJson.dataSources = cleanObject(json.dataSources);
  }

  // Xử lý các pages
  if (json.pages) {
    cleanedJson.pages = cleanObject(json.pages);
  }

  // Xử lý symbols nếu có
  if (json.symbols) {
    cleanedJson.symbols = cleanObject(json.symbols);
  }

  return cleanedJson;
};
