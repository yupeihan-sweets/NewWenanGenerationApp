# Supabase Auth 集成说明

## 概述

本项目使用 **Supabase Auth** 进行用户认证，业务数据表通过 `id` 字段关联到 Supabase Auth 的 `auth.users` 表。

## 关联方式

### 1. 用户表关联

`users` 表的 `id` 字段**直接使用** Supabase Auth 的 `auth.users.id`：

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  -- 其他业务字段...
);
```

**关键点**：
- `users.id` = `auth.users.id`（同一个 UUID）
- 使用 `REFERENCES auth.users(id) ON DELETE CASCADE` 建立外键关联
- 当 Supabase Auth 中的用户被删除时，业务表中的用户记录也会被级联删除

### 2. 自动创建用户记录

当用户在 Supabase Auth 中注册时，通过数据库触发器自动在 `users` 表中创建对应的业务用户记录：

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, nickname, avatar_emoji)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', NEW.email, '用户' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_emoji', '👤')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**工作原理**：
1. 用户在 Supabase Auth 中注册（通过 `supabase.auth.signUp()`）
2. Supabase 在 `auth.users` 表中创建记录
3. 触发器 `on_auth_user_created` 自动执行
4. 在 `users` 表中创建对应的业务用户记录
5. 默认昵称从 `raw_user_meta_data` 或邮箱获取

## Row Level Security (RLS)

所有用户数据表都启用了 **Row Level Security (RLS)**，确保用户只能访问自己的数据。

### users 表 RLS 策略

```sql
-- 用户只能查看自己的资料
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 用户只能更新自己的资料
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### records 表 RLS 策略

```sql
-- 用户只能查看、创建、更新、删除自己的记录
CREATE POLICY "Users can view own records" ...
CREATE POLICY "Users can create own records" ...
CREATE POLICY "Users can update own records" ...
CREATE POLICY "Users can delete own records" ...
```

### favorites 表 RLS 策略

```sql
-- 用户只能查看、创建、删除自己的收藏
CREATE POLICY "Users can view own favorites" ...
CREATE POLICY "Users can create own favorites" ...
CREATE POLICY "Users can delete own favorites" ...
```

## 使用流程

### 1. 用户注册

```typescript
// 前端代码
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      nickname: '用户昵称',
      avatar_emoji: '😎'
    }
  }
});
```

**后端自动处理**：
- Supabase Auth 创建 `auth.users` 记录
- 触发器自动创建 `users` 记录
- 用户可以直接使用应用

### 2. 用户登录

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### 3. 获取当前用户

```typescript
// 获取 Supabase Auth 用户
const { data: { user } } = await supabase.auth.getUser();

// 获取业务用户信息（通过 API）
const profile = await apiGet('/api/user/profile');
// 后端会自动使用 auth.uid() 获取当前用户ID
```

### 4. 后端 API 中获取用户ID

```typescript
// 后端代码示例（Node.js/Express）
import { createClient } from '@supabase/supabase-js';

async function getUserProfile(req, res) {
  // 从请求头获取 token
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  // 验证 token 并获取用户ID
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // 使用 user.id 查询业务数据
  const profile = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [user.id]
  );
  
  return res.json(profile.rows[0]);
}
```

## 数据库迁移步骤

### 1. 在 Supabase Dashboard 中执行

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 进入 **SQL Editor**
4. 执行 `database/schema.sql` 文件

### 2. 注意事项

⚠️ **重要**：触发器 `on_auth_user_created` 需要在 Supabase 的 `auth` schema 中执行，可能需要：

- 在 Supabase Dashboard 的 SQL Editor 中执行
- 或者使用 Supabase 的 Database Webhooks 功能作为替代方案

### 3. 验证集成

```sql
-- 检查 users 表结构
\d users

-- 检查外键约束
SELECT 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'users';

-- 检查 RLS 策略
SELECT * FROM pg_policies WHERE tablename = 'users';
```

## 替代方案：使用 Database Webhooks

如果触发器无法在 Supabase 中直接创建，可以使用 **Database Webhooks**：

### 1. 在 Supabase Dashboard 中配置 Webhook

1. 进入 **Database** → **Webhooks**
2. 创建新的 Webhook
3. 配置：
   - **Table**: `auth.users`
   - **Events**: `INSERT`
   - **HTTP Request**: 指向你的后端 API

### 2. 后端 API 处理

```typescript
// POST /api/webhooks/user-created
app.post('/api/webhooks/user-created', async (req, res) => {
  const { record } = req.body;
  const userId = record.id;
  
  // 创建业务用户记录
  await db.query(
    `INSERT INTO users (id, nickname, avatar_emoji)
     VALUES ($1, $2, $3)
     ON CONFLICT (id) DO NOTHING`,
    [
      userId,
      record.raw_user_meta_data?.nickname || record.email || '用户',
      record.raw_user_meta_data?.avatar_emoji || '👤'
    ]
  );
  
  return res.json({ success: true });
});
```

## 数据同步

### 从 Supabase Auth 同步用户信息

如果需要从 `auth.users` 同步信息到 `users` 表：

```sql
-- 同步函数
CREATE OR REPLACE FUNCTION sync_user_from_auth()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET 
    nickname = COALESCE(NEW.raw_user_meta_data->>'nickname', users.nickname),
    avatar_emoji = COALESCE(NEW.raw_user_meta_data->>'avatar_emoji', users.avatar_emoji),
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 在 auth.users 更新时同步
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_from_auth();
```

## 常见问题

### Q1: 为什么 users.id 要关联 auth.users.id？

**A**: 
- 统一用户标识，避免数据不一致
- 利用 Supabase Auth 的 RLS 功能
- 简化权限管理

### Q2: 如果用户已经在 Supabase Auth 中注册，如何创建 users 记录？

**A**: 可以手动插入或使用迁移脚本：

```sql
-- 为现有 auth.users 创建 users 记录
INSERT INTO users (id, nickname, avatar_emoji)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'nickname', email, '用户'),
  COALESCE(raw_user_meta_data->>'avatar_emoji', '👤')
FROM auth.users
WHERE id NOT IN (SELECT id FROM users)
ON CONFLICT (id) DO NOTHING;
```

### Q3: RLS 策略会影响性能吗？

**A**: 
- RLS 策略有轻微性能开销，但可以接受
- 对于配置类数据（templates, configs 等），可以设置为公开访问
- 使用索引可以优化查询性能

### Q4: 如何在后端验证 Supabase JWT Token？

**A**: 使用 Supabase 客户端验证：

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const { data: { user }, error } = await supabase.auth.getUser(token);
```

## 参考文档

- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)
- [Supabase RLS 文档](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Database Webhooks](https://supabase.com/docs/guides/database/webhooks)

