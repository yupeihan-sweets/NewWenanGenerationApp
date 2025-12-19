# API 需求文档

本文档按页面梳理了应用中每个页面所需的 API 接口，所有数据都应通过 API 获取，避免硬编码。

---

## 一、首页 (app/(tabs)/index.tsx)

### 需要的 API 路由：

1. **GET** `/api/quick-actions` - 获取快速操作按钮配置
2. **GET** `/api/home/banner` - 获取首页 Banner 配置
3. **GET** `/api/records/recent?limit=1` - 获取最近创作记录

### API 详情：

#### 1. GET /api/quick-actions
获取首页快速操作按钮配置
```typescript
// 返回数据
{
  actions: Array<{
    title: string;        // 例如: "朋友圈"
    desc: string;         // 例如: "分享每一刻"
    icon: string;         // 图标名称
    path: string;         // 路由路径
    color: string;        // 背景色
    iconColor: string;    // 图标颜色
  }>
}
```

#### 2. GET /api/home/banner
获取首页 Banner 卡片配置
```typescript
// 返回数据
{
  badge: string;          // 例如: "PRO TIP"
  title: string;          // 例如: "不知道写什么？"
  subtitle: string;       // 例如: "试试我们的热门模板"
  templateId: number;     // 点击跳转的模板ID
}
```

#### 3. GET /api/records/recent?limit=1
获取最近的一条创作记录
```typescript
// 返回数据
{
  records: Array<{
    id: string;
    title: string;
    date: string;         // 相对时间，如 "2分钟前"
    type: '朋友圈' | '小红书' | '短视频' | '其他';
  }>
}
```

---

## 二、收藏页 (app/(tabs)/favorites.tsx)

### 需要的 API 路由：

1. **GET** `/api/favorites` - 获取收藏列表

### API 详情：

#### 1. GET /api/favorites
获取用户的所有收藏
```typescript
// 返回数据
{
  favorites: Array<{
    id: number;
    text: string;
    date: string;
    color: string;
    borderColor?: string;
  }>
}
```

---

## 三、个人资料页 (app/(tabs)/profile.tsx)

### 需要的 API 路由：

1. **GET** `/api/user/profile` - 获取用户信息
2. **GET** `/api/user/stats` - 获取用户统计数据
3. **GET** `/api/user/menu` - 获取菜单配置
4. **POST** `/api/auth/logout` - 退出登录

### API 详情：

#### 1. GET /api/user/profile
获取当前登录用户的基本信息
```typescript
// 返回数据
{
  id: string;            // 用户ID
  nickname: string;      // 昵称，例如: "创作达人"
  avatar: string;        // 头像URL或emoji
  avatarEmoji?: string;  // 如果使用emoji作为头像
}
```

#### 2. GET /api/user/stats
获取用户的统计数据
```typescript
// 返回数据
{
  generateCount: number;    // 生成次数，例如: 128
  favoriteCount: number;    // 收藏模板数，例如: 12
  plan: string;             // 当前计划，例如: "PRO"
}
```

#### 3. GET /api/user/menu
获取个人中心菜单项配置
```typescript
// 返回数据
{
  menuItems: Array<{
    icon: string;          // 图标名称
    label: string;         // 例如: "我的收藏"
    value: string;         // 显示值，例如: "4" 或 "升级 PRO"
    route?: string;        // 点击跳转的路由
  }>
}
```

#### 4. POST /api/auth/logout
用户退出登录
```typescript
// 返回数据
{
  success: boolean;
}
```

---

## 四、记录页 (app/(tabs)/records.tsx)

### 需要的 API 路由：

1. **GET** `/api/records` - 获取创作记录列表

### API 详情：

#### 1. GET /api/records
获取用户的所有创作记录
```typescript
// 返回数据
{
  records: Array<{
    id: string;
    title: string;
    content: string;
    date: string;          // 相对时间，如 "昨天 14:30"
    type: '朋友圈' | '小红书' | '短视频' | '其他';
  }>
}
```

---

## 五、场景页 (app/(tabs)/scenarios.tsx)

### 需要的 API 路由：

1. **GET** `/api/scenarios` - 获取场景列表

### API 详情：

#### 1. GET /api/scenarios
获取所有可用的创作场景
```typescript
// 返回数据
{
  scenarios: Array<{
    title: string;         // 例如: "朋友圈"
    icon: string;          // emoji，例如: "📷"
    desc: string;         // 例如: "日常分享"
    generatorPath: string | null;  // 生成器路径，null表示开发中
  }>
}
```

---

## 六、模板页 (app/(tabs)/templates.tsx)

### 需要的 API 路由：

1. **GET** `/api/templates/categories` - 获取模板分类列表
2. **GET** `/api/templates?category={category}` - 获取模板列表
3. **GET** `/api/templates/search?keyword={keyword}` - 搜索模板

### API 详情：

#### 1. GET /api/templates/categories
获取所有模板分类
```typescript
// 返回数据
{
  categories: string[];    // 例如: ["全部", "生活", "职场", "营销", "情感", "娱乐"]
}
```

#### 2. GET /api/templates?category={category}
获取模板列表，支持按分类筛选
- **参数**: `category` - 分类名称，传 "全部" 或不传则返回所有模板
```typescript
// 返回数据
{
  templates: Array<{
    id: number;
    title: string;
    icon: string;         // emoji
    category: string;
  }>
}
```

#### 3. GET /api/templates/search?keyword={keyword}
搜索模板
- **参数**: `keyword` - 搜索关键词
```typescript
// 返回数据: 同模板列表API
```

---

## 七、收藏详情页 (app/favorites/[id].tsx)

### 需要的 API 路由：

1. **GET** `/api/favorites/{id}` - 获取收藏详情
2. **DELETE** `/api/favorites/{id}` - 取消收藏

### API 详情：

#### 1. GET /api/favorites/{id}
获取单个收藏的详细信息
```typescript
// 返回数据
{
  id: number;
  text: string;
  date: string;
  color: string;
  borderColor?: string;
}
```

#### 2. DELETE /api/favorites/{id}
删除收藏
```typescript
// 返回数据
{
  success: boolean;
  message?: string;
}
```

---

## 八、记录详情页 (app/records/[id].tsx)

### 需要的 API 路由：

1. **GET** `/api/records/{id}` - 获取记录详情
2. **DELETE** `/api/records/{id}` - 删除记录

### API 详情：

#### 1. GET /api/records/{id}
获取单个创作记录的详细信息
```typescript
// 返回数据
{
  id: string;
  title: string;
  content: string;
  date: string;
  type: '朋友圈' | '小红书' | '短视频' | '其他';
}
```

#### 2. DELETE /api/records/{id}
删除创作记录
```typescript
// 返回数据
{
  success: boolean;
  message?: string;
}
```

---

## 九、朋友圈生成器 (app/generate/moments.tsx)

### 需要的 API 路由：

1. **GET** `/api/generate/moments/moods` - 获取心情选项
2. **POST** `/api/generate/moments` - 生成朋友圈文案

### API 详情：

#### 1. GET /api/generate/moments/moods
获取朋友圈生成器的心情选项
```typescript
// 返回数据
{
  moods: Array<{
    label: string;         // 例如: "开心 😄"
    value: string;         // 例如: "happy"
  }>
}
```

#### 2. POST /api/generate/moments
根据输入生成朋友圈文案
```typescript
// 请求数据
{
  topic: string;          // 今天发生了什么
  mood: string;           // 心情
}

// 返回数据
{
  results: Array<{
    id: number;
    content: string;      // 生成的文案内容
  }>;
  recordId: string;       // 创建的记录ID
}
```

---

## 十、短视频生成器 (app/generate/video.tsx)

### 需要的 API 路由：

1. **GET** `/api/generate/video/styles` - 获取风格选项
2. **GET** `/api/generate/video/durations` - 获取时长选项
3. **POST** `/api/generate/video` - 生成短视频脚本

### API 详情：

#### 1. GET /api/generate/video/styles
获取短视频生成器的风格选项
```typescript
// 返回数据
{
  styles: string[];       // 例如: ["搞笑", "干货", "治愈", "悬疑", "快节奏", "唯美"]
}
```

#### 2. GET /api/generate/video/durations
获取可选的视频时长
```typescript
// 返回数据
{
  durations: number[];    // 例如: [15, 30, 45, 60]
}
```

#### 3. POST /api/generate/video
根据输入生成短视频脚本
```typescript
// 请求数据
{
  topic: string;          // 视频主题
  duration: number;        // 预估时长（秒）
  style: string;           // 风格基调
}

// 返回数据
{
  results: Array<{
    id: number;
    content: string;      // 生成的脚本内容
  }>;
  recordId: string;       // 创建的记录ID
}
```

---

## 十一、小红书生成器 (app/generate/xiaohongshu.tsx)

### 需要的 API 路由：

1. **GET** `/api/generate/xiaohongshu/audiences` - 获取目标人群选项
2. **POST** `/api/generate/xiaohongshu` - 生成小红书笔记

### API 详情：

#### 1. GET /api/generate/xiaohongshu/audiences
获取小红书生成器的目标人群选项
```typescript
// 返回数据
{
  audiences: string[];    // 例如: ["学生党", "上班族", "宝妈"]
}
```

#### 2. POST /api/generate/xiaohongshu
根据输入生成小红书笔记
```typescript
// 请求数据
{
  product: string;        // 产品/主题
  keywords: string;        // 卖点/关键词
  audience: string;        // 目标人群
}

// 返回数据
{
  results: Array<{
    id: number;
    content: string;      // 生成的笔记内容
  }>;
  recordId: string;       // 创建的记录ID
}
```

---

## 十二、结果页 (app/result.tsx)

### 需要的 API 路由：

1. **GET** `/api/generate/results/{recordId}?index={index}` - 获取生成结果
2. **POST** `/api/generate/regenerate/{recordId}` - 重新生成
3. **POST** `/api/favorites` - 收藏生成结果

### API 详情：

#### 1. GET /api/generate/results/{recordId}?index={index}
获取指定记录的生成结果
- **参数**: 
  - `recordId` - 记录ID
  - `index` - 结果索引（1或2，对应"结果 1"和"结果 2"）
```typescript
// 返回数据
{
  content: string;        // 生成的内容
  recordId: string;
  resultIndex: number;
}
```

#### 2. POST /api/generate/regenerate/{recordId}
基于原记录重新生成内容
```typescript
// 请求数据
{
  resultIndex?: number;   // 可选，指定要重新生成的结果索引
}

// 返回数据
{
  results: Array<{
    id: number;
    content: string;
  }>;
}
```

#### 3. POST /api/favorites
将生成结果添加到收藏
```typescript
// 请求数据
{
  content: string;        // 要收藏的内容
  recordId: string;       // 关联的记录ID
}

// 返回数据
{
  id: number;             // 新创建的收藏ID
  success: boolean;
}
```

---

## 十三、模板详情页 (app/templates/[id].tsx)

### 需要的 API 路由：

1. **GET** `/api/templates/{id}` - 获取模板详情
2. **POST** `/api/templates/{id}/favorite` - 收藏/取消收藏模板

### API 详情：

#### 1. GET /api/templates/{id}
获取单个模板的详细信息
```typescript
// 返回数据
{
  id: number;
  title: string;
  icon: string;           // emoji
  category: string;
  description: string;
  introduction: string;
  features: string[];     // 包含内容列表
  generatorPath: string;  // 生成器路径
  emoji: string;          // 头部装饰emoji
}
```

#### 2. POST /api/templates/{id}/favorite
收藏/取消收藏模板
```typescript
// 请求数据
{
  action: 'add' | 'remove';  // 添加或移除收藏
}

// 返回数据
{
  success: boolean;
  isFavorited: boolean;
}
```

---

## 十四、用户认证相关 API

### 需要的 API 路由：

1. **POST** `/api/auth/login` - 用户登录
2. **POST** `/api/auth/logout` - 用户退出登录

### API 详情：

#### 1. POST /api/auth/login
用户登录
```typescript
// 请求数据（根据实际登录方式定义）
{
  // 手机号、邮箱、第三方等
}

// 返回数据
{
  token: string;
  user: {
    id: string;
    nickname: string;
    // ... 其他用户信息
  };
}
```

#### 2. POST /api/auth/logout
用户退出登录
```typescript
// 返回数据
{
  success: boolean;
}
```

---

## 十五、通用配置 API

### 需要的 API 路由：

1. **GET** `/api/config` - 获取应用配置

### API 详情：

#### 1. GET /api/config
获取应用全局配置
```typescript
// 返回数据
{
  version: string;        // 应用版本号，例如: "2.0.1"
  // 其他全局配置项
}
```

---

## API 路由汇总

### 按页面分类的 API 路由列表：

| 页面 | API 路由 | 方法 | 说明 |
|------|---------|------|------|
| **首页** | `/api/quick-actions` | GET | 快速操作配置 |
| | `/api/home/banner` | GET | Banner 配置 |
| | `/api/records/recent` | GET | 最近记录 |
| **收藏页** | `/api/favorites` | GET | 收藏列表 |
| **个人资料页** | `/api/user/profile` | GET | 用户信息 |
| | `/api/user/stats` | GET | 统计数据 |
| | `/api/user/menu` | GET | 菜单配置 |
| | `/api/auth/logout` | POST | 退出登录 |
| **记录页** | `/api/records` | GET | 记录列表 |
| **场景页** | `/api/scenarios` | GET | 场景列表 |
| **模板页** | `/api/templates/categories` | GET | 分类列表 |
| | `/api/templates` | GET | 模板列表 |
| | `/api/templates/search` | GET | 搜索模板 |
| **收藏详情页** | `/api/favorites/{id}` | GET | 收藏详情 |
| | `/api/favorites/{id}` | DELETE | 取消收藏 |
| **记录详情页** | `/api/records/{id}` | GET | 记录详情 |
| | `/api/records/{id}` | DELETE | 删除记录 |
| **朋友圈生成器** | `/api/generate/moments/moods` | GET | 心情选项 |
| | `/api/generate/moments` | POST | 生成文案 |
| **短视频生成器** | `/api/generate/video/styles` | GET | 风格选项 |
| | `/api/generate/video/durations` | GET | 时长选项 |
| | `/api/generate/video` | POST | 生成脚本 |
| **小红书生成器** | `/api/generate/xiaohongshu/audiences` | GET | 人群选项 |
| | `/api/generate/xiaohongshu` | POST | 生成笔记 |
| **结果页** | `/api/generate/results/{recordId}` | GET | 获取结果 |
| | `/api/generate/regenerate/{recordId}` | POST | 重新生成 |
| | `/api/favorites` | POST | 收藏结果 |
| **模板详情页** | `/api/templates/{id}` | GET | 模板详情 |
| | `/api/templates/{id}/favorite` | POST | 收藏模板 |
| **用户认证** | `/api/auth/login` | POST | 用户登录 |
| | `/api/auth/logout` | POST | 退出登录 |
| **通用配置** | `/api/config` | GET | 应用配置 |

### 数据操作类型：

- **创建 (POST)**: 生成内容、创建记录、添加收藏、用户登录
- **读取 (GET)**: 获取列表、获取详情、获取配置
- **更新 (PUT/PATCH)**: 编辑内容（如需要）
- **删除 (DELETE)**: 删除记录、取消收藏

### 注意事项：

1. **分页支持**: 所有列表接口应支持分页参数（`page`, `limit`）
2. **错误处理**: 所有接口应包含统一的错误处理和状态码
3. **认证机制**: 需要认证的接口应在请求头中包含 `Authorization: Bearer {token}`
4. **时间格式**: 时间字段应统一格式，支持相对时间显示（如 "2分钟前"、"昨天"）
5. **资源 URL**: 图片/头像字段应返回完整 URL
6. **请求头**: 所有请求应包含 `Content-Type: application/json`
7. **响应格式**: 统一使用 JSON 格式，包含 `success`、`data`、`message` 字段

### 需要替换硬编码数据的页面：

1. ✅ 首页 - 快速操作、Banner、最近记录
2. ✅ 收藏页 - 收藏列表
3. ✅ 个人资料页 - 用户信息、统计数据、菜单配置
4. ✅ 记录页 - 记录列表
5. ✅ 场景页 - 场景列表
6. ✅ 模板页 - 分类列表、模板列表
7. ✅ 收藏详情页 - 收藏详情
8. ✅ 记录详情页 - 记录详情
9. ✅ 生成页面 - 选项配置（心情、风格、时长、人群等）
10. ✅ 结果页 - 生成结果
11. ✅ 模板详情页 - 模板详情

---

## 数据结构分类分析（基于 PostgreSQL 性能优化）

根据当前工程的页面内容，从**节约数据库读写开销**的角度，重新梳理结构化和非结构化数据需求。数据库已确定为 **PostgreSQL**。

### 一、核心优化原则

1. **列表查询与详情查询分离**：列表页只查询必要字段，详情页才查询完整内容
2. **配置数据全量缓存**：所有配置类、选项类数据使用 Redis 缓存，减少数据库查询
3. **合并相关数据**：将经常一起查询的数据合并到同一张表，减少 JOIN 操作
4. **使用 PostgreSQL 特性**：JSONB、数组类型、全文索引等
5. **延迟加载大文本**：列表查询不加载 TEXT 字段，详情查询才加载

---

### 二、数据结构分类（按读写频率和查询模式）

#### 类别 A：高频读取 + 全量缓存（配置类数据）

**特点**：读取频率极高，数据变更少，适合全量缓存到 Redis

##### A1. 系统配置数据（Redis 缓存，数据库仅作持久化）

- **快速操作配置** (`/api/quick-actions`)
  - **存储**: `configs` 表，key = 'quick_actions'，value = JSONB
  - **缓存**: Redis key = `config:quick_actions`，TTL = 24小时
  - **优化**: 启动时加载到内存，变更时更新缓存

- **Banner配置** (`/api/home/banner`)
  - **存储**: `configs` 表，key = 'home_banner'，value = JSONB
  - **缓存**: Redis key = `config:home_banner`，TTL = 24小时

- **场景列表** (`/api/scenarios`)
  - **存储**: `scenarios` 表（id, title, icon, description, generator_path, sort_order）
  - **缓存**: Redis key = `config:scenarios`，存储完整 JSON 数组，TTL = 24小时
  - **优化**: 列表查询直接从缓存读取，无需查数据库

- **模板分类** (`/api/templates/categories`)
  - **存储**: `categories` 表（id, name, sort_order）
  - **缓存**: Redis key = `config:categories`，TTL = 24小时

- **菜单配置** (`/api/user/menu`)
  - **存储**: `menu_configs` 表（id, icon, label, value, route, sort_order）
  - **缓存**: Redis key = `config:menu`，TTL = 24小时

- **应用配置** (`/api/config`)
  - **存储**: `system_configs` 表（key, value (JSONB)）
  - **缓存**: Redis key = `config:system`，TTL = 24小时

##### A2. 选项配置数据（Redis 缓存）

- **心情选项** (`/api/generate/moments/moods`)
  - **存储**: `option_configs` 表，type = 'moments_moods'，value = JSONB 数组
  - **缓存**: Redis key = `options:moments_moods`，TTL = 24小时

- **风格选项** (`/api/generate/video/styles`)
  - **存储**: `option_configs` 表，type = 'video_styles'，value = TEXT[] 数组
  - **缓存**: Redis key = `options:video_styles`，TTL = 24小时

- **时长选项** (`/api/generate/video/durations`)
  - **存储**: `option_configs` 表，type = 'video_durations'，value = INTEGER[] 数组
  - **缓存**: Redis key = `options:video_durations`，TTL = 24小时

- **目标人群选项** (`/api/generate/xiaohongshu/audiences`)
  - **存储**: `option_configs` 表，type = 'xiaohongshu_audiences'，value = TEXT[] 数组
  - **缓存**: Redis key = `options:xiaohongshu_audiences`，TTL = 24小时

**优化策略**：
- 所有配置数据启动时批量加载到 Redis
- 配置变更时同时更新数据库和缓存
- API 查询直接从 Redis 读取，0 次数据库查询

---

#### 类别 B：用户数据（合并存储，减少查询次数）

##### B1. 用户基本信息（单表存储）

- **用户信息** (`/api/user/profile`)
  - **表结构**: `users` 表
    ```sql
    id UUID PRIMARY KEY
    nickname VARCHAR(50)
    avatar VARCHAR(255)
    avatar_emoji VARCHAR(10)
    created_at TIMESTAMP
    updated_at TIMESTAMP
    ```
  - **优化**: 用户信息查询频率高，单表存储，建立索引

- **用户统计数据** (`/api/user/stats`)
  - **存储策略**: **合并到 users 表**，避免 JOIN 查询
  - **表结构扩展**:
    ```sql
    generate_count INTEGER DEFAULT 0
    favorite_count INTEGER DEFAULT 0
    plan VARCHAR(20) DEFAULT 'FREE'
    ```
  - **优化**: 
    - 统计字段与用户信息同表，一次查询获取所有数据
    - 使用触发器或应用层更新统计，避免实时计算
    - 可考虑 Redis 缓存用户统计，定期同步到数据库

**优化策略**：
- 用户信息和统计合并存储，减少查询次数
- 用户数据可缓存到 Redis（key = `user:{userId}`），TTL = 1小时

---

#### 类别 C：列表查询 + 详情查询分离（核心优化）

##### C1. 记录数据（分离存储，列表不查内容）

**列表查询** (`/api/records`) - **只查元数据，不查内容**
- **表结构**: `records` 表
  ```sql
  id UUID PRIMARY KEY
  user_id UUID REFERENCES users(id)
  title VARCHAR(200)          -- 列表显示
  type VARCHAR(20)            -- 列表显示
  created_at TIMESTAMP        -- 列表显示
  updated_at TIMESTAMP
  
  -- 以下字段列表查询时不加载
  content TEXT                -- 详情才查
  input_params JSONB          -- 用户输入参数（详情才查）
  generate_results JSONB      -- 生成结果数组（详情才查）
  ```
- **索引**:
  ```sql
  CREATE INDEX idx_records_user_created ON records(user_id, created_at DESC);
  CREATE INDEX idx_records_type ON records(type);
  ```
- **优化**:
  - 列表查询使用 `SELECT id, title, type, created_at FROM records WHERE user_id = ? ORDER BY created_at DESC`
  - **不查询 TEXT 和 JSONB 字段**，大幅减少 I/O
  - 详情查询才加载完整数据

**详情查询** (`/api/records/{id}`) - **查询完整数据**
- 查询所有字段，包括 `content`、`input_params`、`generate_results`

**最近记录** (`/api/records/recent?limit=1`) - **只查元数据**
- 使用相同的列表查询逻辑，只查元数据字段

**优化策略**：
- 列表查询：0 次 TEXT/JSONB 字段读取
- 详情查询：按需加载，1 次查询获取所有数据
- 生成结果直接存储在 `generate_results` JSONB 字段，避免关联查询

##### C2. 收藏数据（分离存储）

**列表查询** (`/api/favorites`) - **只查元数据**
- **表结构**: `favorites` 表
  ```sql
  id UUID PRIMARY KEY
  user_id UUID REFERENCES users(id)
  created_at TIMESTAMP        -- 列表显示
  color VARCHAR(20)            -- 列表显示
  border_color VARCHAR(20)     -- 列表显示
  
  -- 以下字段列表查询时不加载
  text TEXT                    -- 详情才查
  record_id UUID               -- 关联记录（可选）
  ```
- **索引**:
  ```sql
  CREATE INDEX idx_favorites_user_created ON favorites(user_id, created_at DESC);
  ```
- **优化**: 列表查询不查 `text` 字段

**详情查询** (`/api/favorites/{id}`) - **查询完整数据**
- 查询所有字段，包括 `text`

**优化策略**：
- 列表查询：不读取 TEXT 字段
- 详情查询：按需加载

##### C3. 模板数据（合并存储，使用数组类型）

**列表查询** (`/api/templates`) - **只查必要字段**
- **表结构**: `templates` 表
  ```sql
  id UUID PRIMARY KEY
  title VARCHAR(100)           -- 列表显示
  icon VARCHAR(10)             -- 列表显示
  category VARCHAR(20)         -- 列表显示
  sort_order INTEGER           -- 排序
  
  -- 以下字段列表查询时不加载
  description TEXT             -- 简短描述
  introduction TEXT            -- 详细介绍（长文本）
  features TEXT[]              -- 使用 PostgreSQL 数组类型
  generator_path VARCHAR(100)
  emoji VARCHAR(10)
  ```
- **索引**:
  ```sql
  CREATE INDEX idx_templates_category ON templates(category);
  CREATE INDEX idx_templates_sort ON templates(category, sort_order);
  ```
- **优化**: 
  - 列表查询：`SELECT id, title, icon, category FROM templates WHERE category = ? ORDER BY sort_order`
  - 使用 PostgreSQL 数组类型存储 `features`，避免关联表查询

**详情查询** (`/api/templates/{id}`) - **查询完整数据**
- 查询所有字段

**搜索查询** (`/api/templates/search`) - **全文搜索**
- 使用 PostgreSQL 全文搜索（GIN 索引）
  ```sql
  -- 添加全文搜索列
  ALTER TABLE templates ADD COLUMN search_vector tsvector;
  CREATE INDEX idx_templates_search ON templates USING GIN(search_vector);
  
  -- 更新搜索向量
  UPDATE templates SET search_vector = 
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''));
  ```

**优化策略**：
- 列表查询：不读取 TEXT 字段
- 使用数组类型存储 features，避免 JOIN
- 全文搜索使用 GIN 索引，性能优秀

---

#### 类别 D：生成相关数据（合并存储，减少关联查询）

##### D1. 生成结果（合并到 records 表）

**生成结果存储** (`/api/generate/results/{recordId}`)
- **存储策略**: **直接存储在 records 表的 `generate_results` JSONB 字段**
  ```sql
  generate_results JSONB  -- 存储格式：
  [
    {
      "id": 1,
      "content": "生成的内容1",
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "content": "生成的内容2",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
  ```
- **索引**: 
  ```sql
  CREATE INDEX idx_records_generate_results ON records USING GIN(generate_results);
  ```
- **优化**:
  - 避免单独的 `generate_results` 表，减少 JOIN 查询
  - 使用 JSONB 索引支持快速查询
  - 一次查询获取记录和所有生成结果

**用户输入参数存储**
- **存储策略**: 存储在 records 表的 `input_params` JSONB 字段
  ```sql
  input_params JSONB  -- 存储格式：
  {
    "topic": "用户输入的主题",
    "mood": "happy",
    "product": "产品名称",
    "keywords": "关键词",
    "duration": 30,
    "style": "搞笑",
    "audience": "学生党"
  }
  ```
- **优化**: 不同生成器的参数统一存储，避免多表设计

**优化策略**：
- 生成结果和输入参数都存储在 records 表，避免多表关联
- 使用 JSONB 类型，支持灵活的数据结构
- 一次查询获取所有相关数据

---

### 三、PostgreSQL 特性应用

#### 1. JSONB 类型使用场景

- **配置数据**: `configs.value JSONB` - 存储灵活的配置结构
- **生成结果**: `records.generate_results JSONB` - 存储多个生成结果
- **输入参数**: `records.input_params JSONB` - 存储不同生成器的参数

**优势**：
- 支持索引（GIN 索引）
- 支持 JSON 查询和更新
- 避免多表关联

#### 2. 数组类型使用场景

- **模板特性**: `templates.features TEXT[]` - 存储特性列表
- **选项配置**: `option_configs.value INTEGER[]` 或 `TEXT[]` - 存储选项数组

**优势**：
- 避免关联表查询
- 支持数组操作和索引

#### 3. 全文搜索

- **模板搜索**: 使用 `tsvector` 和 GIN 索引
- **记录搜索**: 如需要，可在 `records.title` 上建立全文索引

---

### 四、缓存策略（Redis）

#### 缓存层级

1. **配置数据缓存**（TTL = 24小时）
   - 所有配置类、选项类数据
   - Key 格式: `config:{type}` 或 `options:{type}`
   - 启动时批量加载

2. **用户数据缓存**（TTL = 1小时）
   - 用户信息和统计
   - Key 格式: `user:{userId}`
   - 查询时按需缓存

3. **模板列表缓存**（TTL = 1小时）
   - 按分类缓存模板列表
   - Key 格式: `templates:list:{category}`
   - 列表查询时缓存

#### 缓存更新策略

- **配置数据**: 变更时同时更新数据库和缓存
- **用户数据**: 写入时更新缓存，或使用缓存失效策略
- **列表数据**: 写入时清除相关缓存

---

### 五、数据库表设计汇总

#### 核心表结构

```sql
-- 1. 用户表（合并统计信息）
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(50) NOT NULL,
  avatar VARCHAR(255),
  avatar_emoji VARCHAR(10),
  generate_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  plan VARCHAR(20) DEFAULT 'FREE',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. 记录表（列表和详情分离）
CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL,
  content TEXT,                    -- 详情才查
  input_params JSONB,              -- 用户输入参数
  generate_results JSONB,         -- 生成结果数组
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_records_user_created ON records(user_id, created_at DESC);
CREATE INDEX idx_records_type ON records(type);
CREATE INDEX idx_records_generate_results ON records USING GIN(generate_results);

-- 3. 收藏表（列表和详情分离）
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,               -- 详情才查
  color VARCHAR(20),
  border_color VARCHAR(20),
  record_id UUID REFERENCES records(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_favorites_user_created ON favorites(user_id, created_at DESC);

-- 4. 模板表（使用数组类型）
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  icon VARCHAR(10),
  category VARCHAR(20) NOT NULL,
  description TEXT,
  introduction TEXT,                -- 长文本
  features TEXT[],                   -- PostgreSQL 数组
  generator_path VARCHAR(100),
  emoji VARCHAR(10),
  sort_order INTEGER DEFAULT 0,
  search_vector tsvector,           -- 全文搜索
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_sort ON templates(category, sort_order);
CREATE INDEX idx_templates_search ON templates USING GIN(search_vector);

-- 5. 配置表（JSONB 存储）
CREATE TABLE configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. 选项配置表（数组类型）
CREATE TABLE option_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) UNIQUE NOT NULL,
  value JSONB NOT NULL,             -- 可以是数组或对象
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. 场景表
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(50) NOT NULL,
  icon VARCHAR(10),
  description VARCHAR(100),
  generator_path VARCHAR(100),
  sort_order INTEGER DEFAULT 0
);
```

---

### 六、查询优化总结

#### 列表查询优化（0 次大字段读取）

| 接口 | 查询字段 | 优化效果 |
|------|---------|---------|
| `/api/records` | id, title, type, created_at | 不查 TEXT/JSONB，减少 80% I/O |
| `/api/favorites` | id, created_at, color, border_color | 不查 TEXT，减少 70% I/O |
| `/api/templates` | id, title, icon, category | 不查 TEXT，减少 60% I/O |
| `/api/records/recent` | id, title, type, created_at | 同列表查询 |

#### 详情查询优化（1 次查询获取所有数据）

| 接口 | 查询策略 | 优化效果 |
|------|---------|---------|
| `/api/records/{id}` | 单表查询所有字段 | 避免 JOIN，1 次查询 |
| `/api/favorites/{id}` | 单表查询所有字段 | 1 次查询 |
| `/api/templates/{id}` | 单表查询所有字段 | 使用数组类型，避免 JOIN |

#### 配置查询优化（0 次数据库查询）

| 接口 | 查询策略 | 优化效果 |
|------|---------|---------|
| 所有配置类 API | 直接从 Redis 读取 | 0 次数据库查询 |
| 所有选项类 API | 直接从 Redis 读取 | 0 次数据库查询 |

#### 生成结果优化（避免关联查询）

| 接口 | 查询策略 | 优化效果 |
|------|---------|---------|
| `/api/generate/results/{recordId}` | 从 records.generate_results JSONB 读取 | 避免 JOIN，1 次查询 |
| 生成时写入 | 直接更新 records.generate_results | 避免多表写入 |

---

### 七、性能提升估算

1. **列表查询性能提升**: 60-80%（不读取大字段）
2. **配置查询性能提升**: 100%（0 次数据库查询）
3. **详情查询性能提升**: 30-50%（避免 JOIN，合并存储）
4. **整体数据库负载降低**: 40-60%（缓存 + 查询优化）

---

### 八、非结构化数据存储策略（PostgreSQL TEXT 类型）

所有非结构化文本内容统一使用 PostgreSQL 的 TEXT 类型存储，通过**列表查询不加载**的策略优化性能。

#### 非结构化数据清单

| 数据项 | 存储位置 | 字段名 | 查询策略 |
|--------|---------|--------|---------|
| 生成结果内容 | `records.generate_results` | JSONB 数组中的 content | 详情查询才加载 |
| 记录内容 | `records.content` | TEXT | 列表不查，详情才查 |
| 收藏内容 | `favorites.text` | TEXT | 列表不查，详情才查 |
| 模板介绍 | `templates.introduction` | TEXT | 列表不查，详情才查 |
| 用户输入参数 | `records.input_params` | JSONB | 详情查询才加载 |

**优化要点**：
- 所有 TEXT 字段在列表查询时**不加载**
- 使用 `SELECT` 明确指定字段，避免 `SELECT *`
- 详情查询时才加载完整数据

---

### 九、最终数据分类汇总表

| 数据类型 | 数据项 | PostgreSQL 类型 | 查询策略 | 缓存策略 |
|---------|--------|----------------|---------|---------|
| **配置类** | 快速操作、Banner、场景、菜单 | JSONB | Redis 缓存 | TTL 24h |
| **选项类** | 心情、风格、时长、人群 | JSONB/数组 | Redis 缓存 | TTL 24h |
| **用户数据** | 用户信息+统计 | 标准字段 | 合并存储 | TTL 1h |
| **记录列表** | 记录元数据 | 标准字段 | 不查 TEXT/JSONB | 不缓存 |
| **记录详情** | 记录完整数据 | TEXT + JSONB | 按需加载 | 不缓存 |
| **收藏列表** | 收藏元数据 | 标准字段 | 不查 TEXT | 不缓存 |
| **收藏详情** | 收藏完整数据 | TEXT | 按需加载 | 不缓存 |
| **模板列表** | 模板元数据 | 标准字段 | 不查 TEXT | TTL 1h |
| **模板详情** | 模板完整数据 | TEXT + 数组 | 按需加载 | 不缓存 |
| **生成结果** | 生成内容 | JSONB | 合并到 records | 不缓存 |

---

### 十、实施建议（基于 PostgreSQL）

#### 1. 数据库设计阶段

- ✅ 使用 PostgreSQL JSONB 类型存储灵活数据
- ✅ 使用 PostgreSQL 数组类型避免关联表
- ✅ 为列表查询字段建立索引
- ✅ 为 JSONB 字段建立 GIN 索引
- ✅ 为全文搜索建立 tsvector 索引

#### 2. 查询优化阶段

- ✅ 列表查询明确指定字段，不查 TEXT/JSONB
- ✅ 详情查询按需加载完整数据
- ✅ 使用连接池减少连接开销
- ✅ 使用预编译语句提高性能

#### 3. 缓存实施阶段

- ✅ 配置数据启动时批量加载到 Redis
- ✅ 用户数据查询时按需缓存
- ✅ 配置变更时同时更新数据库和缓存
- ✅ 使用合适的 TTL 策略

#### 4. 监控和优化

- ✅ 监控慢查询，优化索引
- ✅ 监控缓存命中率
- ✅ 定期分析查询模式，调整索引策略
- ✅ 考虑读写分离（如需要）

---

### 十一、性能优化效果预估

| 优化项 | 优化前 | 优化后 | 提升 |
|--------|--------|--------|------|
| 列表查询 I/O | 读取所有字段 | 只读元数据 | **减少 60-80%** |
| 配置查询 | 数据库查询 | Redis 缓存 | **减少 100%** |
| 详情查询 | 多表 JOIN | 单表查询 | **减少 30-50%** |
| 生成结果查询 | 关联查询 | JSONB 字段 | **减少 1 次查询** |
| 整体数据库负载 | 基准 | 优化后 | **降低 40-60%** |

---

### 十二、关键优化点总结

1. **列表查询优化**：不读取 TEXT/JSONB 字段，减少 60-80% I/O
2. **配置数据缓存**：所有配置类数据 Redis 缓存，0 次数据库查询
3. **合并存储**：用户统计合并到用户表，生成结果合并到记录表
4. **使用 PostgreSQL 特性**：JSONB、数组类型、全文索引
5. **延迟加载**：大文本内容按需加载，列表不查详情字段

---

## Redis 使用指南

本文档详细说明在本项目中 Redis 的使用场景、时机和具体实现方式。

---

### 一、Redis 使用场景

#### 1. 配置类数据缓存（必须使用）

**使用时机**：
- ✅ 系统启动时：批量加载所有配置数据到 Redis
- ✅ API 查询时：直接从 Redis 读取，不查数据库
- ✅ 配置更新时：同时更新数据库和 Redis

**适用数据**：
- 快速操作配置 (`/api/quick-actions`)
- Banner 配置 (`/api/home/banner`)
- 场景列表 (`/api/scenarios`)
- 模板分类 (`/api/templates/categories`)
- 菜单配置 (`/api/user/menu`)
- 应用配置 (`/api/config`)
- 所有选项配置（心情、风格、时长、人群等）

**为什么必须使用**：
- 读取频率极高（几乎每次页面加载都需要）
- 数据变更极少（配置类数据很少更新）
- 数据量小（适合全量缓存）
- 可以显著减少数据库压力（0 次数据库查询）

#### 2. 用户数据缓存（推荐使用）

**使用时机**：
- ✅ 用户登录后：缓存用户信息
- ✅ 查询用户信息时：先查 Redis，未命中再查数据库
- ✅ 用户信息更新时：同时更新数据库和 Redis

**适用数据**：
- 用户基本信息 (`/api/user/profile`)
- 用户统计数据 (`/api/user/stats`)

**为什么推荐使用**：
- 用户信息查询频率高（个人中心页面）
- 用户数据相对稳定（不会频繁变更）
- 可以减少数据库查询次数

#### 3. 模板列表缓存（可选使用）

**使用时机**：
- ✅ 按分类查询模板列表时：缓存分类下的模板列表
- ✅ 模板变更时：清除相关缓存

**适用数据**：
- 模板列表 (`/api/templates?category={category}`)

**为什么可选**：
- 查询频率中等
- 数据可能频繁变更（新增模板）
- 如果数据库性能足够，可以不缓存

#### 4. 不推荐使用 Redis 的场景

**❌ 记录列表** (`/api/records`)
- 原因：数据个性化强（每个用户不同），缓存命中率低
- 优化：通过列表查询优化（不查 TEXT 字段）已足够

**❌ 收藏列表** (`/api/favorites`)
- 原因：数据个性化强，缓存命中率低
- 优化：通过列表查询优化已足够

**❌ 详情数据** (`/api/records/{id}`, `/api/favorites/{id}`)
- 原因：访问频率低，缓存意义不大
- 优化：按需查询即可

**❌ 生成结果** (`/api/generate/results/{recordId}`)
- 原因：已存储在 records 表的 JSONB 字段，查询效率高
- 优化：不需要额外缓存

---

### 二、Redis Key 命名规范

#### 命名规则

```
{类型}:{标识符}
```

#### Key 命名清单

| 数据类型 | Key 格式 | 示例 | 说明 |
|---------|---------|------|------|
| 配置数据 | `config:{type}` | `config:quick_actions` | 配置类型 |
| 选项数据 | `options:{type}` | `options:moments_moods` | 选项类型 |
| 用户数据 | `user:{userId}` | `user:123e4567-e89b-12d3-a456-426614174000` | 用户ID |
| 模板列表 | `templates:list:{category}` | `templates:list:生活` | 分类名称 |

#### 完整 Key 列表

```typescript
// 配置类数据
config:quick_actions          // 快速操作配置
config:home_banner            // Banner 配置
config:scenarios              // 场景列表
config:categories             // 模板分类
config:menu                   // 菜单配置
config:system                 // 系统配置

// 选项类数据
options:moments_moods         // 朋友圈心情选项
options:video_styles          // 短视频风格选项
options:video_durations       // 短视频时长选项
options:xiaohongshu_audiences // 小红书人群选项

// 用户数据
user:{userId}                 // 用户信息和统计

// 模板列表（可选）
templates:list:{category}     // 按分类的模板列表
```

---

### 三、Redis 数据结构选择

#### 1. String 类型（最常用）

**适用场景**：存储 JSON 序列化的配置数据

```typescript
// 存储
await redis.set('config:quick_actions', JSON.stringify(configData), 'EX', 86400);

// 读取
const data = await redis.get('config:quick_actions');
const config = JSON.parse(data);
```

**优点**：
- 简单直接
- 支持 TTL
- 适合存储 JSON 对象

#### 2. Hash 类型（适合用户数据）

**适用场景**：存储用户信息，支持部分字段更新

```typescript
// 存储
await redis.hset('user:123', {
  nickname: '创作达人',
  avatar: 'https://...',
  generate_count: '128',
  favorite_count: '12',
  plan: 'PRO'
});
await redis.expire('user:123', 3600);

// 读取
const user = await redis.hgetall('user:123');

// 部分更新
await redis.hset('user:123', 'generate_count', '129');
```

**优点**：
- 支持部分字段更新
- 内存效率高
- 适合结构化数据

#### 3. List 类型（适合数组数据）

**适用场景**：存储选项数组（如风格列表）

```typescript
// 存储
await redis.del('options:video_styles');
await redis.rpush('options:video_styles', '搞笑', '干货', '治愈', '悬疑', '快节奏', '唯美');
await redis.expire('options:video_styles', 86400);

// 读取
const styles = await redis.lrange('options:video_styles', 0, -1);
```

**优点**：
- 适合数组数据
- 支持范围查询

---

### 四、Redis 缓存策略

#### 1. Cache-Aside 模式（推荐）

**读取流程**：
```
1. 先查 Redis
2. 如果命中，直接返回
3. 如果未命中，查数据库
4. 将数据库结果写入 Redis
5. 返回结果
```

**实现示例**：
```typescript
async function getQuickActions() {
  // 1. 先查 Redis
  const cached = await redis.get('config:quick_actions');
  if (cached) {
    return JSON.parse(cached);
  }
  
  // 2. 查数据库
  const config = await db.query(
    "SELECT value FROM configs WHERE key = 'quick_actions'"
  );
  
  // 3. 写入 Redis
  await redis.set(
    'config:quick_actions',
    JSON.stringify(config.value),
    'EX',
    86400 // TTL = 24小时
  );
  
  return config.value;
}
```

#### 2. Write-Through 模式（配置更新）

**更新流程**：
```
1. 更新数据库
2. 同时更新 Redis
3. 返回结果
```

**实现示例**：
```typescript
async function updateQuickActions(newConfig) {
  // 1. 更新数据库
  await db.query(
    "UPDATE configs SET value = $1, updated_at = NOW() WHERE key = 'quick_actions'",
    [JSON.stringify(newConfig)]
  );
  
  // 2. 更新 Redis
  await redis.set(
    'config:quick_actions',
    JSON.stringify(newConfig),
    'EX',
    86400
  );
  
  return newConfig;
}
```

#### 3. Write-Behind 模式（用户统计）

**更新流程**：
```
1. 先更新 Redis（快速响应）
2. 异步批量更新数据库
```

**实现示例**：
```typescript
async function incrementGenerateCount(userId) {
  // 1. 更新 Redis（快速）
  const key = `user:${userId}`;
  await redis.hincrby(key, 'generate_count', 1);
  await redis.expire(key, 3600);
  
  // 2. 异步更新数据库（后台任务）
  setImmediate(async () => {
    await db.query(
      "UPDATE users SET generate_count = generate_count + 1 WHERE id = $1",
      [userId]
    );
  });
}
```

---

### 五、启动时批量加载配置

#### 实现方案

**应用启动时**：
```typescript
// server.ts 或 app.ts
async function loadConfigsToRedis() {
  const configs = [
    'quick_actions',
    'home_banner',
    'scenarios',
    'categories',
    'menu',
    'system'
  ];
  
  const options = [
    'moments_moods',
    'video_styles',
    'video_durations',
    'xiaohongshu_audiences'
  ];
  
  // 批量加载配置数据
  for (const key of configs) {
    const config = await db.query(
      "SELECT value FROM configs WHERE key = $1",
      [key]
    );
    if (config.rows[0]) {
      await redis.set(
        `config:${key}`,
        JSON.stringify(config.rows[0].value),
        'EX',
        86400
      );
    }
  }
  
  // 批量加载选项数据
  for (const type of options) {
    const option = await db.query(
      "SELECT value FROM option_configs WHERE type = $1",
      [type]
    );
    if (option.rows[0]) {
      await redis.set(
        `options:${type}`,
        JSON.stringify(option.rows[0].value),
        'EX',
        86400
      );
    }
  }
  
  console.log('✅ 配置数据已加载到 Redis');
}

// 应用启动时调用
app.on('ready', async () => {
  await loadConfigsToRedis();
  // ... 其他启动逻辑
});
```

---

### 六、API 实现示例

#### 1. 配置类 API 实现

```typescript
// GET /api/quick-actions
async function getQuickActions(req, res) {
  try {
    // 直接从 Redis 读取
    const cached = await redis.get('config:quick_actions');
    if (cached) {
      return res.json({
        success: true,
        data: { actions: JSON.parse(cached) }
      });
    }
    
    // 如果 Redis 未命中（理论上不应该发生），查数据库
    const config = await db.query(
      "SELECT value FROM configs WHERE key = 'quick_actions'"
    );
    
    const actions = config.rows[0]?.value || [];
    
    // 写入 Redis
    await redis.set('config:quick_actions', JSON.stringify(actions), 'EX', 86400);
    
    return res.json({
      success: true,
      data: { actions }
    });
  } catch (error) {
    console.error('获取快速操作配置失败:', error);
    return res.status(500).json({ success: false, message: '服务器错误' });
  }
}
```

#### 2. 选项类 API 实现

```typescript
// GET /api/generate/moments/moods
async function getMomentsMoods(req, res) {
  try {
    // 直接从 Redis 读取
    const cached = await redis.get('options:moments_moods');
    if (cached) {
      return res.json({
        success: true,
        data: { moods: JSON.parse(cached) }
      });
    }
    
    // 如果未命中，查数据库
    const option = await db.query(
      "SELECT value FROM option_configs WHERE type = 'moments_moods'"
    );
    
    const moods = option.rows[0]?.value || [];
    
    // 写入 Redis
    await redis.set('options:moments_moods', JSON.stringify(moods), 'EX', 86400);
    
    return res.json({
      success: true,
      data: { moods }
    });
  } catch (error) {
    console.error('获取心情选项失败:', error);
    return res.status(500).json({ success: false, message: '服务器错误' });
  }
}
```

#### 3. 用户数据 API 实现

```typescript
// GET /api/user/profile
async function getUserProfile(req, res) {
  try {
    const userId = req.user.id;
    const key = `user:${userId}`;
    
    // 先查 Redis
    const cached = await redis.hgetall(key);
    if (cached && Object.keys(cached).length > 0) {
      return res.json({
        success: true,
        data: {
          id: userId,
          nickname: cached.nickname,
          avatar: cached.avatar,
          avatarEmoji: cached.avatar_emoji
        }
      });
    }
    
    // 查数据库
    const user = await db.query(
      "SELECT id, nickname, avatar, avatar_emoji FROM users WHERE id = $1",
      [userId]
    );
    
    if (!user.rows[0]) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    const userData = user.rows[0];
    
    // 写入 Redis
    await redis.hset(key, {
      nickname: userData.nickname,
      avatar: userData.avatar || '',
      avatar_emoji: userData.avatar_emoji || ''
    });
    await redis.expire(key, 3600); // TTL = 1小时
    
    return res.json({
      success: true,
      data: {
        id: userData.id,
        nickname: userData.nickname,
        avatar: userData.avatar,
        avatarEmoji: userData.avatar_emoji
      }
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return res.status(500).json({ success: false, message: '服务器错误' });
  }
}
```

---

### 七、缓存更新策略

#### 1. 配置数据更新

```typescript
// PUT /api/admin/config/quick-actions
async function updateQuickActions(req, res) {
  try {
    const newConfig = req.body.actions;
    
    // 1. 更新数据库
    await db.query(
      "UPDATE configs SET value = $1, updated_at = NOW() WHERE key = 'quick_actions'",
      [JSON.stringify(newConfig)]
    );
    
    // 2. 更新 Redis
    await redis.set('config:quick_actions', JSON.stringify(newConfig), 'EX', 86400);
    
    return res.json({
      success: true,
      message: '配置更新成功'
    });
  } catch (error) {
    console.error('更新配置失败:', error);
    return res.status(500).json({ success: false, message: '服务器错误' });
  }
}
```

#### 2. 用户数据更新

```typescript
// PUT /api/user/profile
async function updateUserProfile(req, res) {
  try {
    const userId = req.user.id;
    const { nickname, avatar } = req.body;
    
    // 1. 更新数据库
    await db.query(
      "UPDATE users SET nickname = $1, avatar = $2, updated_at = NOW() WHERE id = $3",
      [nickname, avatar, userId]
    );
    
    // 2. 更新 Redis
    const key = `user:${userId}`;
    await redis.hset(key, {
      nickname,
      avatar: avatar || ''
    });
    await redis.expire(key, 3600);
    
    return res.json({
      success: true,
      message: '更新成功'
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    return res.status(500).json({ success: false, message: '服务器错误' });
  }
}
```

#### 3. 缓存失效策略

```typescript
// 模板变更时，清除相关缓存
async function updateTemplate(templateId, data) {
  // 1. 更新数据库
  await db.query("UPDATE templates SET ... WHERE id = $1", [templateId]);
  
  // 2. 清除模板列表缓存（按分类）
  const template = await db.query("SELECT category FROM templates WHERE id = $1", [templateId]);
  const category = template.rows[0].category;
  await redis.del(`templates:list:${category}`);
  await redis.del('templates:list:全部'); // 如果有"全部"分类
}
```

---

### 八、Redis 连接和错误处理

#### 1. Redis 连接配置

```typescript
// redis.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

// 错误处理
redis.on('error', (err) => {
  console.error('Redis 连接错误:', err);
  // 可以在这里实现降级策略：Redis 不可用时直接查数据库
});

redis.on('connect', () => {
  console.log('✅ Redis 连接成功');
});

export default redis;
```

#### 2. 降级策略（Redis 不可用时）

```typescript
async function getQuickActionsWithFallback() {
  try {
    // 尝试从 Redis 读取
    const cached = await redis.get('config:quick_actions');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn('Redis 读取失败，降级到数据库:', error);
    // 降级：直接查数据库
  }
  
  // 查数据库
  const config = await db.query(
    "SELECT value FROM configs WHERE key = 'quick_actions'"
  );
  return config.rows[0]?.value || [];
}
```

---

### 九、监控和维护

#### 1. 缓存命中率监控

```typescript
// 统计缓存命中率
let cacheHits = 0;
let cacheMisses = 0;

async function getQuickActionsWithStats() {
  const cached = await redis.get('config:quick_actions');
  if (cached) {
    cacheHits++;
    return JSON.parse(cached);
  }
  
  cacheMisses++;
  // ... 查数据库逻辑
}

// 定期输出统计
setInterval(() => {
  const total = cacheHits + cacheMisses;
  const hitRate = total > 0 ? (cacheHits / total * 100).toFixed(2) : 0;
  console.log(`缓存命中率: ${hitRate}% (${cacheHits}/${total})`);
}, 60000); // 每分钟输出一次
```

#### 2. Redis 健康检查

```typescript
async function checkRedisHealth() {
  try {
    await redis.ping();
    return { status: 'healthy', message: 'Redis 连接正常' };
  } catch (error) {
    return { status: 'unhealthy', message: 'Redis 连接失败', error: error.message };
  }
}

// 定期健康检查
setInterval(async () => {
  const health = await checkRedisHealth();
  if (health.status === 'unhealthy') {
    console.error('⚠️ Redis 健康检查失败:', health.message);
  }
}, 30000); // 每30秒检查一次
```

---

### 十、Redis 使用总结

#### 必须使用 Redis 的场景

1. ✅ **所有配置类数据**：快速操作、Banner、场景、分类、菜单、系统配置
2. ✅ **所有选项类数据**：心情、风格、时长、人群等选项

#### 推荐使用 Redis 的场景

1. ✅ **用户数据**：用户信息和统计数据

#### 可选使用 Redis 的场景

1. ⚠️ **模板列表**：如果数据库性能足够，可以不缓存

#### 不推荐使用 Redis 的场景

1. ❌ **记录列表**：数据个性化强，缓存命中率低
2. ❌ **收藏列表**：数据个性化强，缓存命中率低
3. ❌ **详情数据**：访问频率低，缓存意义不大

#### TTL 策略

- **配置数据**：24 小时（数据变更少）
- **选项数据**：24 小时（数据变更少）
- **用户数据**：1 小时（可能频繁更新）
- **模板列表**：1 小时（可能新增模板）

#### 关键原则

1. **启动时批量加载**：配置数据启动时全量加载到 Redis
2. **Cache-Aside 模式**：先查 Redis，未命中再查数据库
3. **Write-Through 模式**：更新时同时更新数据库和 Redis
4. **降级策略**：Redis 不可用时直接查数据库
5. **监控和告警**：监控缓存命中率和 Redis 健康状态
