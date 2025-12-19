# React Native 项目测试指南

本文档详细说明如何测试这个基于 Expo 的 React Native 项目。

## 📋 目录

1. [环境准备](#环境准备)
2. [启动项目](#启动项目)
3. [不同平台测试](#不同平台测试)
4. [开发工具使用](#开发工具使用)
5. [调试技巧](#调试技巧)
6. [常见问题排查](#常见问题排查)

---

## 🔧 环境准备

### 1. 检查 Node.js 版本

```bash
node --version
# 推荐使用 Node.js 18.x 或更高版本
```

### 2. 安装依赖

```bash
npm install
```

### 3. 安装 Expo CLI（如果还没有）

```bash
npm install -g expo-cli
# 或者使用 npx（推荐，无需全局安装）
```

### 4. 平台特定准备

#### iOS（仅 macOS）
- 安装 Xcode（从 App Store）
- 安装 Xcode Command Line Tools：
  ```bash
  xcode-select --install
  ```
- 安装 CocoaPods（如果需要原生模块）：
  ```bash
  sudo gem install cocoapods
  ```

#### Android
- 安装 Android Studio
- 配置 Android SDK
- 创建 Android 模拟器（AVD）
- 或连接真实 Android 设备并启用 USB 调试

#### Web
- 无需额外配置，直接可用

---

## 🚀 启动项目

### 方法 1：使用 npm scripts（推荐）

```bash
# 启动开发服务器（会显示二维码和选项菜单）
npm start

# 或者直接指定平台
npm run ios      # 启动 iOS 模拟器
npm run android  # 启动 Android 模拟器
npm run web      # 在浏览器中打开
```

### 方法 2：使用 Expo CLI

```bash
# 启动开发服务器
npx expo start

# 指定平台
npx expo start --ios
npx expo start --android
npx expo start --web

# 清除缓存（如果遇到问题）
npx expo start --clear
```

### 方法 3：使用 Expo Go 应用（快速测试）

1. 在手机上安装 **Expo Go** 应用
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. 启动开发服务器：
   ```bash
   npm start
   ```

3. 扫描终端中显示的二维码，应用会在手机上打开

**注意**：Expo Go 有一些限制，某些原生模块可能无法使用。对于完整功能测试，建议使用开发构建（Development Build）。

---

## 📱 不同平台测试

### iOS 测试

#### 使用 iOS 模拟器（macOS 专用）

```bash
npm run ios
# 或
npx expo start --ios
```

**快捷键**：
- `Cmd + D`：打开开发者菜单
- `Cmd + R`：重新加载应用
- `Cmd + M`：打开菜单（Android）

#### 使用真实设备

1. 确保 Mac 和 iPhone 在同一 Wi-Fi 网络
2. 启动开发服务器：`npm start`
3. 在 iPhone 上打开 Expo Go，扫描二维码
4. 或使用 `npm run ios` 并选择设备

### Android 测试

#### 使用 Android 模拟器

1. 启动 Android Studio
2. 打开 AVD Manager，启动一个模拟器
3. 运行：
   ```bash
   npm run android
   # 或
   npx expo start --android
   ```

#### 使用真实设备

1. 在 Android 设备上启用 USB 调试
2. 连接设备到电脑
3. 运行：
   ```bash
   npm run android
   ```
4. 或使用 Expo Go 扫描二维码

### Web 测试

```bash
npm run web
# 或
npx expo start --web
```

应用会在默认浏览器中打开（通常是 `http://localhost:8081`）

**Web 平台特点**：
- 快速迭代
- 易于调试（使用浏览器 DevTools）
- 但某些原生功能可能不可用

---

## 🛠️ 开发工具使用

### 1. Expo DevTools

启动项目后，会自动打开 Expo DevTools（通常在浏览器中），提供：
- 日志查看
- 设备管理
- 性能监控
- 网络请求查看

### 2. React Native Debugger

#### 启用远程调试

1. 在应用中按 `Cmd + D`（iOS）或 `Cmd + M`（Android）
2. 选择 "Debug" 或 "Open Debugger"
3. 浏览器会打开 Chrome DevTools

#### 使用 React DevTools

```bash
# 安装 React DevTools
npm install -g react-devtools

# 启动
react-devtools
```

### 3. 终端快捷键

在 Expo 开发服务器运行时，可以使用以下快捷键：

- `i`：在 iOS 模拟器中打开
- `a`：在 Android 模拟器中打开
- `w`：在 Web 浏览器中打开
- `r`：重新加载应用
- `m`：切换菜单
- `c`：清除缓存并重新启动
- `?`：显示所有快捷键

---

## 🐛 调试技巧

### 1. 使用 console.log

```typescript
console.log('调试信息', variable);
console.warn('警告信息');
console.error('错误信息');
```

在 Expo DevTools 或终端中查看输出。

### 2. 使用断点调试（VS Code）

1. 安装 "React Native Tools" 扩展
2. 创建 `.vscode/launch.json`：
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Debug iOS",
         "type": "reactnative",
         "request": "launch",
         "platform": "ios"
       },
       {
         "name": "Debug Android",
         "type": "reactnative",
         "request": "launch",
         "platform": "android"
       }
     ]
   }
   ```
3. 设置断点，按 F5 开始调试

### 3. 网络调试

使用 Flipper 或 React Native Debugger 的网络面板查看 API 请求。

### 4. 性能监控

```typescript
// 使用 Performance API
import { PerformanceObserver } from 'react-native';

// 或使用 React DevTools Profiler
```

### 5. 错误边界

在关键组件中添加错误边界：

```typescript
import React from 'react';
import { View, Text } from 'react-native';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View>
          <Text>出错了！</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
```

---

## 🔍 常见问题排查

### 1. 依赖问题

```bash
# 清除 node_modules 和重新安装
rm -rf node_modules
npm install

# 清除 Expo 缓存
npx expo start --clear
```

### 2. Metro 打包器问题

```bash
# 重置 Metro 缓存
npx expo start --clear

# 或手动清除
rm -rf .expo
rm -rf node_modules/.cache
```

### 3. iOS 构建问题

```bash
# 清除 iOS 构建缓存
cd ios
rm -rf build
pod deintegrate
pod install
cd ..
```

### 4. Android 构建问题

```bash
# 清除 Android 构建缓存
cd android
./gradlew clean
cd ..
```

### 5. 端口被占用

```bash
# 查找占用 8081 端口的进程（Expo 默认端口）
lsof -ti:8081 | xargs kill -9

# 或使用其他端口
npx expo start --port 8082
```

### 6. 热重载不工作

- 检查是否启用了 Fast Refresh
- 尝试手动重载：`Cmd + R`（iOS）或双击 R（Android）
- 重启开发服务器

### 7. 样式问题

- 检查 StyleSheet 语法
- 确保使用 React Native 支持的样式属性
- 使用 `flex: 1` 而不是 `height: '100%'`

### 8. 路由问题

```bash
# 检查路由配置
# 确保文件路径正确
# 使用 expo-router 的 useRouter 和 useLocalSearchParams
```

---

## 📊 测试清单

### 功能测试

- [ ] 首页加载正常
- [ ] Tab 导航切换正常
- [ ] 页面路由跳转正常
- [ ] 表单输入和提交
- [ ] 按钮点击响应
- [ ] 数据展示
- [ ] 错误处理

### 平台测试

- [ ] iOS 模拟器
- [ ] iOS 真机
- [ ] Android 模拟器
- [ ] Android 真机
- [ ] Web 浏览器

### 性能测试

- [ ] 应用启动时间
- [ ] 页面切换流畅度
- [ ] 列表滚动性能
- [ ] 内存使用情况

### UI/UX 测试

- [ ] 不同屏幕尺寸适配
- [ ] 深色/浅色主题
- [ ] 横屏/竖屏切换
- [ ] 安全区域适配（刘海屏等）

---

## 🎯 快速测试命令总结

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm start

# 3. 在 iOS 模拟器中打开
npm run ios

# 4. 在 Android 模拟器中打开
npm run android

# 5. 在 Web 浏览器中打开
npm run web

# 6. 清除缓存并重启
npx expo start --clear

# 7. 代码检查
npm run lint
```

---

## 📚 相关资源

- [Expo 官方文档](https://docs.expo.dev/)
- [React Native 文档](https://reactnative.dev/)
- [Expo Router 文档](https://docs.expo.dev/router/introduction/)
- [Expo 社区 Discord](https://chat.expo.dev/)

---

## 💡 提示

1. **开发时优先使用 Web 平台**：迭代速度快，调试方便
2. **定期测试真机**：模拟器和真机可能有差异
3. **使用 TypeScript**：提前发现类型错误
4. **启用 Fast Refresh**：代码修改后自动更新
5. **使用 Git**：及时提交代码，方便回滚

---

祝测试顺利！🚀

