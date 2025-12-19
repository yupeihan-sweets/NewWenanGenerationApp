/**
 * 收藏数据源
 * 根据收藏 ID 返回对应的收藏信息
 */

export interface Favorite {
  id: number;
  text: string;
  date: string;
  color: string;
  borderColor?: string;
}

export const favoritesData: Favorite[] = [
  {
    id: 1,
    text: '春风十里不如你，三里桃花不及卿。🌸',
    date: '2024-03-24',
    color: '#FDF2F8', // AppColors.muted
  },
  {
    id: 2,
    text: '【周报摘要】本周完成了三个核心模块的开发，进度符合预期。',
    date: '2024-03-23',
    color: '#FFFFFF',
    borderColor: '#F1B1DF33', // AppColors.primary + '33'
  },
  {
    id: 3,
    text: '生活的温柔之处在于，总有一个人让你觉得人间值得。✨',
    date: '2024-03-22',
    color: '#FFFFFF',
    borderColor: '#F3F4F6',
  },
  {
    id: 4,
    text: '星巴克新品测评：樱花拿铁真的绝绝子！',
    date: '2024-03-21',
    color: '#F1B1DF33', // AppColors.primary + '33'
  },
];

/**
 * 根据 ID 获取收藏数据
 */
export function getFavoriteById(id: string | string[] | undefined): Favorite | null {
  if (!id) return null;
  
  const favoriteId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
  const favorite = favoritesData.find(f => f.id === favoriteId);
  
  return favorite || null;
}

