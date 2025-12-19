/**
 * 模板数据源
 * 根据模板 ID 返回对应的模板信息
 */

export interface Template {
  id: number;
  title: string;
  icon: string;
  category: string;
  description: string;
  introduction: string;
  features: string[];
  generatorPath: string; // 点击"立即使用"后跳转的生成器路径
  emoji: string; // 头部装饰 emoji
}

export const templatesData: Template[] = [
  {
    id: 1,
    title: '节日祝福',
    icon: '🎉',
    category: '生活',
    description: '适合所有节日的万能祝福语生成器',
    introduction: '不知道怎么给长辈、领导或者朋友发祝福？这个模板帮你搞定！支持自定义语气和对象，生成得体又温馨的祝福语，拒绝尴尬群发。',
    features: ['智能匹配节日氛围', '多种语气风格可选', '支持添加自定义署名'],
    generatorPath: '/generate/moments',
    emoji: '🎉',
  },
  {
    id: 2,
    title: '请假理由',
    icon: '📝',
    category: '职场',
    description: '帮你找到合适的请假理由',
    introduction: '需要请假但不知道怎么说？这个模板提供各种合理的请假理由，既不会显得不专业，又能有效传达你的需求。',
    features: ['多种请假场景', '语气专业得体', '支持自定义原因'],
    generatorPath: '/generate/moments',
    emoji: '📝',
  },
  {
    id: 3,
    title: '好物种草',
    icon: '💄',
    category: '营销',
    description: '打造爆款种草笔记',
    introduction: '想要分享好物但不知道怎么写？这个模板帮你打造吸引人的种草文案，让你的推荐更有说服力。',
    features: ['突出产品卖点', '吸引人的文案风格', '适合小红书等平台'],
    generatorPath: '/generate/xiaohongshu',
    emoji: '💄',
  },
  {
    id: 4,
    title: '表白情书',
    icon: '💌',
    category: '情感',
    description: '帮你表达真挚的情感',
    introduction: '想要表白但不知道如何开口？这个模板帮你写出真挚动人的情书，让你的心意完美传达。',
    features: ['多种情感风格', '真挚动人的表达', '适合不同场景'],
    generatorPath: '/generate/moments',
    emoji: '💌',
  },
  {
    id: 5,
    title: '周报总结',
    icon: '📊',
    category: '职场',
    description: '专业的周报工作总结模板',
    introduction: '写周报总是不知道从何下手？这个模板帮你结构化地总结工作成果，让你的周报既专业又全面。',
    features: ['结构化总结', '突出工作成果', '专业表达'],
    generatorPath: '/generate/moments',
    emoji: '📊',
  },
  {
    id: 6,
    title: '旅行日记',
    icon: '✈️',
    category: '生活',
    description: '记录美好的旅行时光',
    introduction: '想要记录旅行中的美好瞬间？这个模板帮你写出生动有趣的旅行日记，让回忆更加珍贵。',
    features: ['生动的场景描述', '情感丰富的表达', '适合朋友圈分享'],
    generatorPath: '/generate/moments',
    emoji: '✈️',
  },
];

/**
 * 根据 ID 获取模板数据
 */
export function getTemplateById(id: string | string[] | undefined): Template | null {
  if (!id) return null;
  
  const templateId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
  const template = templatesData.find(t => t.id === templateId);
  
  return template || null;
}

/**
 * 根据分类获取模板列表
 */
export function getTemplatesByCategory(category: string): Template[] {
  if (category === '全部') {
    return templatesData;
  }
  return templatesData.filter(t => t.category === category);
}

