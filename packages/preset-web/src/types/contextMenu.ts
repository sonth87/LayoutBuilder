export type ContextMenuItem = {
  label?: string;
  icon?: string;
  description?: string;
  danger?: boolean;
  separator?: boolean;
  action?: (component: any, editor: any) => void;
  visible?: (component: any, editor: any) => boolean; // Điều kiện hiển thị
};

export type ContextMenuItems = ContextMenuItem | { separator: boolean };

export interface ContextMenuConfig {
  enableDefaultItems?: boolean; // Có sử dụng menu mặc định không
  customItems?: ContextMenuItem[]; // Các item tùy chỉnh
  itemOrder?: string[]; // Thứ tự hiển thị các item
  disabledItems?: string[]; // Tắt các item mặc định
}
