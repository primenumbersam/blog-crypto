import * as cheerio from 'cheerio';
import { NewsItem } from '@/types/news';

export async function scrapeTelegram(id: string, source: 'blockmedia' | 'tokenpost'): Promise<NewsItem[]> {
  const url = `https://t.me/s/${id}`;
  try {
    const response = await fetch(url, {
      next: { revalidate: 900 }, // 15 mins
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x46) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch telegram channel: ${id}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const items: NewsItem[] = [];

    $('.tgme_widget_message_wrap').each((_, el) => {
      const $el = $(el);
      
      const messageText = $el.find('.tgme_widget_message_text').text().trim();
      if (!messageText) return; // Skip if no text

      // Title: first line contains the text or truncated
      const title = messageText.split('\n')[0].substring(0, 100) || 'Telegram News';
      
      const link = $el.find('.tgme_widget_message_date').attr('href') || '#';
      const date = $el.find('.tgme_widget_message_date time').attr('datetime') || new Date().toISOString();
      
      // Image extraction
      let image: string | undefined;
      const photoStyle = $el.find('.tgme_widget_message_photo_wrap').attr('style');
      if (photoStyle) {
        const match = photoStyle.match(/url\(['"]?(.*?)['"]?\)/);
        if (match && match[1]) {
          image = match[1];
        }
      }

      items.push({
        id: `${id}-${link.split('/').pop()}`,
        title,
        link,
        date,
        description: messageText,
        image,
        source: source,
      });
    });

    return items.reverse().slice(0, 100);
  } catch (error) {
    console.error(`Error scraping telegram ${id}:`, error);
    return [];
  }
}
