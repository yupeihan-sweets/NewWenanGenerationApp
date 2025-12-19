# 数据库 Schema 说明

## 文件说明

- `schema.sql` - 完整的数据库表结构定义（DDL）

## 使用方法

### 1. 创建数据库

```bash
# 连接到 PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE wenan_generation;

# 连接到新数据库
\c wenan_generation
```

### 2. 执行 Schema

```bash
# 方式1: 使用 psql 命令行
psql -U postgres -d wenan_generation -f database/schema.sql

# 方式2: 在 psql 中执行
\i database/schema.sql
```

### 3. 验证表结构

```sql
-- 查看所有表
\dt

-- 查看表结构
\d users
\d records
\d favorites
\d templates
```

## 表结构说明

### 核心表

1. **users** - 用户表（包含统计信息）
2. **records** - 创作记录表
3. **favorites** - 收藏表
4. **templates** - 模板表

### 配置表

5. **configs** - 配置表（JSONB 存储）
6. **option_configs** - 选项配置表
7. **scenarios** - 场景表
8. **categories** - 分类表
9. **menu_configs** - 菜单配置表
10. **system_configs** - 系统配置表

## 特性说明

### 1. UUID 主键
所有表使用 UUID 作为主键，使用 `gen_random_uuid()` 自动生成。

### 2. 自动时间戳
- `created_at` - 创建时间，自动设置
- `updated_at` - 更新时间，通过触发器自动更新

### 3. JSONB 类型
- `records.input_params` - 用户输入参数
- `records.generate_results` - 生成结果数组
- `configs.value` - 配置值
- `option_configs.value` - 选项配置值

### 4. 数组类型
- `templates.features` - 模板特性列表（TEXT[]）

### 5. 全文搜索
- `templates.search_vector` - 全文搜索向量（tsvector）
- 自动通过触发器更新

### 6. 自动统计
- 创建记录时自动增加用户 `generate_count`
- 创建收藏时自动增加用户 `favorite_count`
- 删除收藏时自动减少用户 `favorite_count`

## 索引说明

### 性能优化索引

1. **列表查询优化**
   - `idx_records_user_created` - 用户记录列表查询
   - `idx_favorites_user_created` - 用户收藏列表查询
   - `idx_templates_category` - 模板分类查询

2. **JSONB 索引**
   - `idx_records_generate_results` - GIN 索引，支持 JSONB 查询
   - `idx_records_input_params` - GIN 索引
   - `idx_configs_value` - GIN 索引

3. **全文搜索索引**
   - `idx_templates_search` - GIN 索引，支持全文搜索

## 约束说明

### 检查约束

- `users.plan` - 只能是 'FREE', 'PRO', 'PREMIUM'
- `users.generate_count` - 必须 >= 0
- `users.favorite_count` - 必须 >= 0
- `records.type` - 只能是 '朋友圈', '小红书', '短视频', '其他'

### 外键约束

- `records.user_id` - 引用 `users.id`，级联删除
- `favorites.user_id` - 引用 `users.id`，级联删除
- `favorites.record_id` - 引用 `records.id`，删除时设为 NULL

## 触发器说明

### 自动更新时间戳

所有表的 `updated_at` 字段通过触发器自动更新：
- `trigger_users_updated_at`
- `trigger_records_updated_at`
- `trigger_templates_updated_at`
- `trigger_configs_updated_at`
- `trigger_option_configs_updated_at`
- `trigger_scenarios_updated_at`
- `trigger_menu_configs_updated_at`
- `trigger_system_configs_updated_at`

### 全文搜索更新

- `trigger_templates_search_vector` - 自动更新模板的全文搜索向量

### 统计更新

- `trigger_increment_generate_count` - 创建记录时增加生成次数
- `trigger_increment_favorite_count` - 创建收藏时增加收藏数
- `trigger_decrement_favorite_count` - 删除收藏时减少收藏数

## 初始化数据

Schema 文件包含以下初始化数据：

1. **默认分类**：全部、生活、职场、营销、情感、娱乐
2. **默认场景**：朋友圈、小红书、短视频等
3. **系统配置**：应用版本号

## 注意事项

1. **扩展依赖**
   - 需要 `uuid-ossp` 扩展（PostgreSQL 13+ 内置 `gen_random_uuid()`）
   - 需要 `pg_trgm` 扩展（用于全文搜索）

2. **性能优化**
   - 列表查询时不要使用 `SELECT *`，只查询必要字段
   - TEXT 和 JSONB 字段在列表查询时不加载
   - 使用索引优化查询性能

3. **数据迁移**
   - 生产环境执行前请先备份数据库
   - 建议在测试环境先验证

## 维护建议

1. **定期备份**
   ```bash
   pg_dump -U postgres wenan_generation > backup.sql
   ```

2. **监控索引使用**
   ```sql
   SELECT * FROM pg_stat_user_indexes;
   ```

3. **分析表统计**
   ```sql
   ANALYZE users;
   ANALYZE records;
   ANALYZE favorites;
   ANALYZE templates;
   ```

