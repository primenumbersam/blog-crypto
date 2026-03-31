import { NextResponse } from 'next/server';
import { fetchInvestingRSS } from '@/lib/news/investing';
import { scrapeTelegram } from '@/lib/news/telegram';
import { fetchCoinnessNews } from '@/lib/news/coinness';

export const revalidate = 900; // 15 mins

export async function GET() {
  try {
    const [investing, blockmedia, tokenpost, coinness] = await Promise.all([
      fetchInvestingRSS(),
      scrapeTelegram('blockmedia', 'blockmedia'),
      scrapeTelegram('tokenpost_kr', 'tokenpost'),
      fetchCoinnessNews(),
    ]);

    const allNews = [
      ...investing,
      ...blockmedia,
      ...tokenpost,
      ...coinness,
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(allNews.slice(0, 100));
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
