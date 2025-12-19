export type GenderTheme = 'male' | 'female';

export interface Record {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'moments' | 'xiaohongshu' | 'video' | 'other';
  tags: string[];
}

