-- ============================================
-- 文案生成应用数据库 Schema
-- 数据库: PostgreSQL
-- 版本: 1.0.0
-- 创建日期: 2024
-- 集成: Supabase Auth
-- ============================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- 用于全文搜索和相似度匹配

-- ============================================
-- 1. 用户表（合并统计信息，关联 Supabase Auth）
-- ============================================
-- 说明：
-- - id 字段直接使用 Supabase Auth 的 auth.users.id
-- - 当用户在 Supabase Auth 中注册时，通过触发器自动创建 users 记录
-- - 业务相关的用户信息（昵称、统计等）存储在此表中
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname VARCHAR(50) NOT NULL,
  avatar VARCHAR(255),
  avatar_emoji VARCHAR(10),
  generate_count INTEGER DEFAULT 0 NOT NULL,
  favorite_count INTEGER DEFAULT 0 NOT NULL,
  plan VARCHAR(20) DEFAULT 'FREE' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  -- 约束
  CONSTRAINT chk_plan CHECK (plan IN ('FREE', 'PRO', 'PREMIUM')),
  CONSTRAINT chk_generate_count CHECK (generate_count >= 0),
  CONSTRAINT chk_favorite_count CHECK (favorite_count >= 0)
);

-- 启用 Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS 策略：用户只能查看和更新自己的数据
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- 用户表索引
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_plan ON users(plan);

-- 用户表更新时间触发器
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_users_updated_at();

-- ============================================
-- Supabase Auth 集成：自动创建用户记录
-- ============================================
-- 当用户在 Supabase Auth 中注册时，自动在 users 表中创建对应的业务用户记录
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

-- 在 auth.users 表上创建触发器
-- 注意：这个触发器需要在 Supabase Dashboard 的 SQL Editor 中执行
-- 或者通过 Supabase 的 Database Webhooks 功能实现
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. 记录表（列表和详情分离）
-- ============================================
CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL,
  content TEXT,                    -- 详情才查
  input_params JSONB,              -- 用户输入参数
  generate_results JSONB,           -- 生成结果数组
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  -- 约束
  CONSTRAINT chk_record_type CHECK (type IN ('朋友圈', '小红书', '短视频', '其他'))
);

-- 启用 Row Level Security (RLS)
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- RLS 策略：用户只能查看、创建、更新、删除自己的记录
CREATE POLICY "Users can view own records"
  ON records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own records"
  ON records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records"
  ON records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own records"
  ON records FOR DELETE
  USING (auth.uid() = user_id);

-- 记录表索引
CREATE INDEX idx_records_user_created ON records(user_id, created_at DESC);
CREATE INDEX idx_records_type ON records(type);
CREATE INDEX idx_records_created_at ON records(created_at DESC);
CREATE INDEX idx_records_generate_results ON records USING GIN(generate_results);
CREATE INDEX idx_records_input_params ON records USING GIN(input_params);

-- 记录表更新时间触发器
CREATE OR REPLACE FUNCTION update_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_records_updated_at
  BEFORE UPDATE ON records
  FOR EACH ROW
  EXECUTE FUNCTION update_records_updated_at();

-- ============================================
-- 3. 收藏表（列表和详情分离）
-- ============================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,               -- 详情才查
  color VARCHAR(20),
  border_color VARCHAR(20),
  record_id UUID REFERENCES records(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 启用 Row Level Security (RLS)
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS 策略：用户只能查看、创建、删除自己的收藏
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- 收藏表索引
CREATE INDEX idx_favorites_user_created ON favorites(user_id, created_at DESC);
CREATE INDEX idx_favorites_record_id ON favorites(record_id) WHERE record_id IS NOT NULL;

-- ============================================
-- 4. 模板表（使用数组类型）
-- ============================================
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  icon VARCHAR(10),
  category VARCHAR(20) NOT NULL,
  description TEXT,
  introduction TEXT,                -- 长文本
  features TEXT[],                  -- PostgreSQL 数组
  generator_path VARCHAR(100),
  emoji VARCHAR(10),
  sort_order INTEGER DEFAULT 0 NOT NULL,
  search_vector tsvector,           -- 全文搜索
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 模板表索引
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_sort ON templates(category, sort_order);
CREATE INDEX idx_templates_search ON templates USING GIN(search_vector);
CREATE INDEX idx_templates_created_at ON templates(created_at DESC);

-- 模板表更新时间触发器
CREATE OR REPLACE FUNCTION update_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_templates_updated_at();

-- 模板表全文搜索触发器函数
CREATE OR REPLACE FUNCTION update_templates_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    to_tsvector('simple', 
      COALESCE(NEW.title, '') || ' ' || 
      COALESCE(NEW.description, '') || ' ' ||
      COALESCE(NEW.introduction, '')
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建全文搜索触发器
CREATE TRIGGER trigger_templates_search_vector
  BEFORE INSERT OR UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_templates_search_vector();

-- ============================================
-- 5. 配置表（JSONB 存储）
-- ============================================
CREATE TABLE configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 配置表索引
CREATE INDEX idx_configs_key ON configs(key);
CREATE INDEX idx_configs_value ON configs USING GIN(value);

-- 配置表更新时间触发器
CREATE OR REPLACE FUNCTION update_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_configs_updated_at
  BEFORE UPDATE ON configs
  FOR EACH ROW
  EXECUTE FUNCTION update_configs_updated_at();

-- ============================================
-- 6. 选项配置表（数组类型）
-- ============================================
CREATE TABLE option_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) UNIQUE NOT NULL,
  value JSONB NOT NULL,             -- 可以是数组或对象
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 选项配置表索引
CREATE INDEX idx_option_configs_type ON option_configs(type);
CREATE INDEX idx_option_configs_value ON option_configs USING GIN(value);

-- 选项配置表更新时间触发器
CREATE OR REPLACE FUNCTION update_option_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_option_configs_updated_at
  BEFORE UPDATE ON option_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_option_configs_updated_at();

-- ============================================
-- 7. 场景表
-- ============================================
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(50) NOT NULL,
  icon VARCHAR(10),
  description VARCHAR(100),
  generator_path VARCHAR(100),
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 场景表索引
CREATE INDEX idx_scenarios_sort ON scenarios(sort_order);
CREATE INDEX idx_scenarios_created_at ON scenarios(created_at DESC);

-- 场景表更新时间触发器
CREATE OR REPLACE FUNCTION update_scenarios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_scenarios_updated_at
  BEFORE UPDATE ON scenarios
  FOR EACH ROW
  EXECUTE FUNCTION update_scenarios_updated_at();

-- ============================================
-- 8. 分类表（模板分类）
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(20) UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 分类表索引
CREATE INDEX idx_categories_sort ON categories(sort_order);

-- ============================================
-- 9. 菜单配置表
-- ============================================
CREATE TABLE menu_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon VARCHAR(50) NOT NULL,
  label VARCHAR(50) NOT NULL,
  value VARCHAR(100),
  route VARCHAR(100),
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 菜单配置表索引
CREATE INDEX idx_menu_configs_sort ON menu_configs(sort_order);

-- 菜单配置表更新时间触发器
CREATE OR REPLACE FUNCTION update_menu_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_menu_configs_updated_at
  BEFORE UPDATE ON menu_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_menu_configs_updated_at();

-- ============================================
-- 10. 系统配置表
-- ============================================
CREATE TABLE system_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 系统配置表索引
CREATE INDEX idx_system_configs_key ON system_configs(key);
CREATE INDEX idx_system_configs_value ON system_configs USING GIN(value);

-- 系统配置表更新时间触发器
CREATE OR REPLACE FUNCTION update_system_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_system_configs_updated_at
  BEFORE UPDATE ON system_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_system_configs_updated_at();

-- ============================================
-- 统计触发器：更新用户统计
-- ============================================

-- 当创建记录时，增加用户的生成次数
CREATE OR REPLACE FUNCTION increment_user_generate_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET generate_count = generate_count + 1 
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_generate_count
  AFTER INSERT ON records
  FOR EACH ROW
  EXECUTE FUNCTION increment_user_generate_count();

-- 当创建收藏时，增加用户的收藏数
CREATE OR REPLACE FUNCTION increment_user_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET favorite_count = favorite_count + 1 
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_favorite_count
  AFTER INSERT ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION increment_user_favorite_count();

-- 当删除收藏时，减少用户的收藏数
CREATE OR REPLACE FUNCTION decrement_user_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET favorite_count = GREATEST(favorite_count - 1, 0)
  WHERE id = OLD.user_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_favorite_count
  AFTER DELETE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION decrement_user_favorite_count();

-- ============================================
-- 注释说明
-- ============================================

COMMENT ON TABLE users IS '用户表，包含用户基本信息和统计数据。id 字段关联 Supabase Auth 的 auth.users.id';
COMMENT ON TABLE records IS '创作记录表，存储用户生成的内容记录';
COMMENT ON TABLE favorites IS '收藏表，存储用户收藏的内容';

COMMENT ON COLUMN users.id IS '用户ID，直接使用 Supabase Auth 的 auth.users.id，作为主键和外键';
COMMENT ON TABLE templates IS '模板表，存储内容生成模板';
COMMENT ON TABLE configs IS '配置表，存储系统配置数据（JSONB格式）';
COMMENT ON TABLE option_configs IS '选项配置表，存储生成器的选项配置';
COMMENT ON TABLE scenarios IS '场景表，存储创作场景';
COMMENT ON TABLE categories IS '分类表，存储模板分类';
COMMENT ON TABLE menu_configs IS '菜单配置表，存储个人中心菜单项';
COMMENT ON TABLE system_configs IS '系统配置表，存储全局系统配置';

COMMENT ON COLUMN records.content IS '记录的实际内容（长文本），列表查询时不加载';
COMMENT ON COLUMN records.input_params IS '用户输入参数（JSONB格式），支持不同生成器的参数';
COMMENT ON COLUMN records.generate_results IS '生成结果数组（JSONB格式），存储多个生成结果';
COMMENT ON COLUMN templates.features IS '模板特性列表（PostgreSQL数组类型）';
COMMENT ON COLUMN templates.search_vector IS '全文搜索向量，用于模板搜索功能';
COMMENT ON COLUMN favorites.text IS '收藏的文本内容（长文本），列表查询时不加载';

-- ============================================
-- 初始化数据（可选）
-- ============================================

-- 插入默认分类
INSERT INTO categories (name, sort_order) VALUES
  ('全部', 0),
  ('生活', 1),
  ('职场', 2),
  ('营销', 3),
  ('情感', 4),
  ('娱乐', 5)
ON CONFLICT (name) DO NOTHING;

-- 插入默认场景
INSERT INTO scenarios (title, icon, description, generator_path, sort_order) VALUES
  ('朋友圈', '📷', '日常分享', '/generate/moments', 1),
  ('小红书', '💄', '种草笔记', '/generate/xiaohongshu', 2),
  ('短视频', '🎬', '剧本创作', '/generate/video', 3),
  ('公众号', '📰', '文章大纲', NULL, 4),
  ('邮件', '📧', '商务沟通', NULL, 5),
  ('周报', '📑', '工作总结', NULL, 6),
  ('其它', '✨', '自由创作', NULL, 7)
ON CONFLICT DO NOTHING;

-- 插入默认系统配置
INSERT INTO system_configs (key, value, description) VALUES
  ('version', '"2.0.1"', '应用版本号')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 完成
-- ============================================

