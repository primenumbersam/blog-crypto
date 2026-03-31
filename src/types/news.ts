export interface NewsItem {
  id: string;
  title: string;
  link: string;
  date: string;
  description?: string;
  image?: string;
  source: 'investing' | 'blockmedia' | 'tokenpost' | 'coinness';
}
