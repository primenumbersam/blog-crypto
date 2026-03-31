import Parser from 'rss-parser';
import { NewsItem } from '@/types/news';

const parser = new Parser();

export async function fetchInvestingRSS(): Promise<NewsItem[]> {
  const url = 'https://kr.investing.com/rss/news_285.rss';
  try {
    const feed = await parser.parseURL(url);
    return feed.items.map((item, index) => ({
      id: `investing-${index}`,
      title: item.title || 'Investing News',
      link: item.link || '#',
      date: item.pubDate || new Date().toISOString(),
      description: item.contentSnippet || item.content || undefined,
      source: 'investing' as const,
    })).slice(0, 100);
  } catch (error) {
    console.error('Error fetching investing RSS:', error);
    return [];
  }
}
