# Supabase Auth 集成指南

本文档说明如何在项目中使用 Supabase Auth 和 API 请求工具。

## 📋 已完成的集成

### 1. 安装的依赖
- `@supabase/supabase-js` - Supabase 客户端
- `@react-native-async-storage/async-storage` - 用于持久化 token

### 2. 创建的文件

#### `lib/supabase.ts`
Supabase 客户端配置，包含：
- 项目 URL: `https://bhybrqvhfytnvdtcmdxt.supabase.co`
- API Key (anon key)
- 自动刷新 token 和持久化 session

#### `context/AuthContext.tsx`
认证上下文，提供：
- `session` - 当前 session
- `user` - 当前用户信息
- `loading` - 加载状态
- `signIn(email, password)` - 登录
- `signUp(email, password)` - 注册
- `signOut()` - 退出登录
- `accessToken` - 当前 access token

#### `lib/api.ts`
API 请求工具，自动在请求头中添加 `Authorization: Bearer {token}`：
- `apiGet()` - GET 请求
- `apiPost()` - POST 请求
- `apiPut()` - PUT 请求
- `apiDelete()` - DELETE 请求
- `apiRequest()` - 通用请求方法

#### `app/auth.tsx`
登录/注册页面，支持：
- 邮箱密码登录
- 邮箱密码注册
- 登录/注册切换

#### `components/AuthGuard.tsx`
路由保护组件，自动：
- 未登录时跳转到登录页
- 已登录时从登录页跳转到首页

## 🚀 使用方法

### 1. 在组件中使用认证状态

```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, session, loading, signOut } = useAuth();

  if (loading) {
    return <Text>加载中...</Text>;
  }

  return (
    <View>
      <Text>用户邮箱: {user?.email}</Text>
      <Text>用户ID: {user?.id}</Text>
      <Button onPress={signOut}>退出登录</Button>
    </View>
  );
}
```

### 2. 使用 API 请求工具

所有 API 请求会自动在请求头中添加 `Authorization: Bearer {token}`：

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

// GET 请求
const data = await apiGet('/api/user/profile');

// POST 请求
const result = await apiPost('/api/generate/moments', {
  mood: '开心',
  topic: '今天天气真好',
});

// PUT 请求
await apiPut('/api/user/profile', {
  nickname: '新昵称',
});

// DELETE 请求
await apiDelete('/api/favorites/123');

// 不需要认证的请求
const publicData = await apiGet('/api/config', { requireAuth: false });
```

### 3. 配置 API 基础 URL

在项目根目录创建 `.env` 文件（如果需要）：

```env
EXPO_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

或者在 `lib/api.ts` 中直接修改 `API_BASE_URL` 常量。

### 4. 登录流程

1. 用户打开应用
2. `AuthGuard` 检查是否已登录
3. 如果未登录，自动跳转到 `/auth` 页面
4. 用户输入邮箱和密码登录
5. 登录成功后，自动跳转到 `/(tabs)` 首页
6. 后续所有 API 请求都会自动带上 token

### 5. 退出登录流程

1. 用户在 profile 页面点击"退出登录"
2. 确认后调用 `signOut()`
3. 清除 session 和 token
4. 自动跳转到登录页

## 🔐 Token 管理

- Token 自动存储在 AsyncStorage 中
- Token 自动刷新（当接近过期时）
- 每次 API 请求时自动从 Supabase 获取最新的 access_token
- 如果 token 过期，Supabase 会自动刷新

## 📝 注意事项

1. **API 基础 URL**: 需要在 `lib/api.ts` 中配置正确的 API 基础 URL，或者设置环境变量 `EXPO_PUBLIC_API_BASE_URL`

2. **路由保护**: `AuthGuard` 会自动保护需要登录的路由，但某些公开路由（如登录页）需要排除

3. **错误处理**: API 请求失败时会抛出错误，需要在调用处进行 try-catch 处理

4. **Token 刷新**: Supabase 会自动处理 token 刷新，无需手动处理

5. **环境变量**: 如果使用环境变量，需要安装 `expo-constants` 或使用 `process.env.EXPO_PUBLIC_*` 格式

## 🎯 下一步

1. 配置后端 API 基础 URL
2. 在后端验证 Supabase JWT token
3. 根据实际需求调整登录/注册流程
4. 添加更多认证方式（如第三方登录）

## 📚 相关文档

- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)
- [Supabase JS 客户端文档](https://supabase.com/docs/reference/javascript/introduction)

