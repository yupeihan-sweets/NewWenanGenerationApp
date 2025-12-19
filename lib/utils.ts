import { clsx, type ClassValue } from "clsx";

/**
 * 合并类名的工具函数（适配 React Native）
 * 注意：React Native 不使用 Tailwind，所以移除了 twMerge
 * 如果需要样式合并，可以使用 StyleSheet.flatten 或其他方式
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

