import { NewsItem } from '@/types/news';

export async function fetchCoinnessNews(): Promise<NewsItem[]> {
  const url = 'https://api.coinness.com/feed/v1/news?page=1&size=50&languageCode=ko';
  try {
    const response = await fetch(url, {
      next: { revalidate: 900 }, // 15 mins
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Coinness API');
    }

    const data = await response.json() as any[];
    return data.map((item) => ({
      id: `coinness-${item.id}`,
      title: item.title || 'Coinness News',
      link: `https://coinness.com/news/${item.id}`,
      date: item.publishAt || new Date().toISOString(),
      description: item.content || undefined,
      image: item.contentImage || undefined,
      source: 'coinness' as const,
    })).slice(0, 100);
  } catch (error) {
    console.error('Error fetching Coinness news:', error);
    return [];
  }
}
