/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// 新增：从 Web 应用迁移的主题颜色
export const AppColors = {
  // 主色调
  primary: '#F1B1DF', // 柔和粉色
  primaryDark: '#E090C8',
  primaryForeground: '#1E0517', // 深紫色文字
  secondary: '#1E0517', // 深紫色
  secondaryForeground: '#FFFFFF',
  muted: '#FDF2F8', // 极浅粉背景
  mutedForeground: '#8B5E83',
  accent: '#FFF0F5',
  accentForeground: '#1E0517',
  
  // 基础颜色
  white: '#FFFFFF',
  background: '#FFFFFF',
  foreground: '#1E0517',
  
  // 灰色系
  gray: '#9CA3AF', // 常用灰色文字
  grayLight: '#F9FAFB', // 浅灰背景
  grayLighter: '#D1D5DB', // 更浅灰色（图标、占位符）
  grayMedium: '#6B7280', // 中等灰色文字
  grayDark: '#4B5563', // 深灰色文字
  grayBorder: '#F3F4F6', // 边框/背景色
  
  // 边框和输入框
  border: '#E5E7EB',
  input: '#F3F4F6',
  
  // 状态颜色
  error: '#F87171', // 错误/删除色
  errorBackground: '#FEF2F2', // 错误背景色
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
