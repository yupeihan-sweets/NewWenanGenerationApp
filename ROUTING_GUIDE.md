# Expo Router 路由机制和数据渲染指南

## 📍 路由机制：`/templates/1` 如何跳转到 `app/templates/[id].tsx`

### Expo Router 文件式路由规则

Expo Router 使用**文件系统作为路由系统**，文件名和目录结构直接对应 URL 路径：

```
文件路径                          → URL 路径
─────────────────────────────────────────────────
app/templates/[id].tsx           → /templates/:id
app/templates/1.tsx              → /templates/1 (静态路由，优先级更高)
app/templates/index.tsx          → /templates
app/(tabs)/index.tsx             → / (Tab 导航)
app/(tabs)/templates.tsx         → /templates (Tab 导航)
```

### 动态路由 `[id].tsx` 的工作原理

1. **文件名规则**：
   - `[id].tsx` 中的方括号 `[]` 表示这是一个**动态路由参数**
   - `id` 是参数名，可以在组件中通过 `useLocalSearchParams()` 获取

2. **URL 匹配规则**：
   - `/templates/1` → 匹配 `app/templates/[id].tsx`，`id = "1"`
   - `/templates/2` → 匹配 `app/templates/[id].tsx`，`id = "2"`
   - `/templates/abc` → 匹配 `app/templates/[id].tsx`，`id = "abc"`

3. **参数获取**：
   ```typescript
   import { useLocalSearchParams } from 'expo-router';
   
   const { id } = useLocalSearchParams<{ id: string }>();
   // id 的值就是 URL 中的动态部分
   ```

### 路由优先级

1. **静态路由** > **动态路由**
   - `app/templates/1.tsx` 会优先匹配 `/templates/1`
   - 如果没有静态路由，才会匹配 `app/templates/[id].tsx`

2. **具体路径** > **通配符路径**
   - `app/templates/[id].tsx` 优先于 `app/templates/[...slug].tsx`

---

## 📊 多 ID 数据渲染方案

### 方案 1：本地数据源（当前实现）

**文件位置**：`lib/templates.ts`

**数据结构**：
```typescript
interface Template {
  id: number;
  title: string;
  category: string;
  description: string;
  introduction: string;
  features: string[];
  generatorPath: string;
  emoji: string;
}
```

**使用方式**：
```typescript
import { getTemplateById } from '@/lib/templates';

const template = getTemplateById(id);
if (!template) {
  // 处理模板不存在的情况
}
```

**优点**：
- ✅ 简单快速，无需 API
- ✅ 适合静态数据
- ✅ 离线可用

**缺点**：
- ❌ 数据更新需要重新发布
- ❌ 不适合大量数据

### 方案 2：API 数据源（推荐用于生产环境）

**实现示例**：

```typescript
// lib/api/templates.ts
export async function fetchTemplateById(id: string): Promise<Template | null> {
  try {
    const response = await fetch(`https://api.example.com/templates/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch template:', error);
    return null;
  }
}

// app/templates/[id].tsx
import { useEffect, useState } from 'react';
import { fetchTemplateById } from '@/lib/api/templates';

export default function TemplateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTemplate() {
      setLoading(true);
      const data = await fetchTemplateById(id);
      setTemplate(data);
      setLoading(false);
    }
    loadTemplate();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!template) return <NotFoundScreen />;
  
  // 渲染模板数据...
}
```

**使用 React Query（推荐）**：

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchTemplateById } from '@/lib/api/templates';

export default function TemplateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { data: template, isLoading, error } = useQuery({
    queryKey: ['template', id],
    queryFn: () => fetchTemplateById(id!),
    enabled: !!id,
  });

  if (isLoading) return <LoadingScreen />;
  if (error || !template) return <NotFoundScreen />;
  
  // 渲染模板数据...
}
```

### 方案 3：本地存储（AsyncStorage/SQLite）

适合需要离线缓存和本地搜索的场景。

---

## 🔄 当前实现的数据流

### 1. 模板列表页 (`app/(tabs)/templates.tsx`)

```typescript
const templates = [
  { id: 1, title: '节日祝福', icon: '🎉', category: '生活' },
  { id: 2, title: '请假理由', icon: '📝', category: '职场' },
  // ...
];

// 点击模板卡片
onPress={() => router.push(`/templates/${item.id}`)}
// 跳转到: /templates/1, /templates/2, ...
```

### 2. 模板详情页 (`app/templates/[id].tsx`)

```typescript
// 1. 从 URL 获取 id 参数
const { id } = useLocalSearchParams<{ id: string }>();
// id = "1", "2", "3", ...

// 2. 根据 id 获取模板数据
const template = getTemplateById(id);

// 3. 渲染模板数据
<Text>{template.title}</Text>
<Text>{template.description}</Text>
// ...
```

### 3. 数据源 (`lib/templates.ts`)

```typescript
// 所有模板数据存储在这里
export const templatesData: Template[] = [
  { id: 1, title: '节日祝福', ... },
  { id: 2, title: '请假理由', ... },
  // ...
];

// 根据 id 查找模板
export function getTemplateById(id: string): Template | null {
  const templateId = parseInt(id);
  return templatesData.find(t => t.id === templateId) || null;
}
```

---

## 📝 添加新模板的步骤

### 方法 1：在 `lib/templates.ts` 中添加

```typescript
export const templatesData: Template[] = [
  // ... 现有模板
  {
    id: 7,  // 新的 ID
    title: '新模板名称',
    icon: '🎨',
    category: '生活',
    description: '模板描述',
    introduction: '模板详细介绍...',
    features: ['功能1', '功能2', '功能3'],
    generatorPath: '/generate/moments',
    emoji: '🎨',
  },
];
```

### 方法 2：从 API 获取（如果使用 API）

只需要确保 API 返回的数据格式符合 `Template` 接口即可。

---

## 🎯 路由示例

| URL | 匹配的文件 | 获取的参数 |
|-----|----------|----------|
| `/templates/1` | `app/templates/[id].tsx` | `{ id: "1" }` |
| `/templates/2` | `app/templates/[id].tsx` | `{ id: "2" }` |
| `/templates/999` | `app/templates/[id].tsx` | `{ id: "999" }` |
| `/records/1` | `app/records/[id].tsx` | `{ id: "1" }` |

---

## ⚠️ 注意事项

1. **参数类型**：`useLocalSearchParams()` 返回的 `id` 是 `string` 类型，需要转换为 `number` 时使用 `parseInt()`

2. **参数可能是数组**：如果 URL 是 `/templates/1/2`，`id` 可能是 `["1", "2"]`，需要处理数组情况

3. **参数可能不存在**：如果 URL 是 `/templates`（没有 id），`id` 会是 `undefined`，需要做空值检查

4. **错误处理**：如果模板不存在，应该显示友好的错误页面

---

## 🔍 调试技巧

1. **查看当前路由参数**：
   ```typescript
   const params = useLocalSearchParams();
   console.log('Route params:', params);
   ```

2. **查看完整路由信息**：
   ```typescript
   import { useSegments } from 'expo-router';
   const segments = useSegments();
   console.log('Route segments:', segments);
   ```

3. **测试不同 ID**：
   - 在浏览器中直接访问：`http://localhost:8082/templates/1`
   - 在代码中跳转：`router.push('/templates/2')`

---

## 📚 相关资源

- [Expo Router 官方文档](https://docs.expo.dev/router/introduction/)
- [动态路由文档](https://docs.expo.dev/router/advanced/routes/)
- [useLocalSearchParams Hook](https://docs.expo.dev/router/advanced/routes/#uselocalsearchparams)

