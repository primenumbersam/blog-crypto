'use client';

import { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, Clock, Image as ImageIcon, ChevronRight, ChevronDown } from 'lucide-react';
import { NewsItem } from '@/types/news';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'investing' | 'blockmedia' | 'tokenpost' | 'coinness'>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNews();
  }, []);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredNews = activeTab === 'all' 
    ? news 
    : news.filter(item => item.source === activeTab);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-64 mx-auto"></div>
          <div className="space-y-3 mt-8 max-w-4xl mx-auto">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-muted rounded-xl w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'investing', label: '인베스팅' },
    { id: 'blockmedia', label: '블록미디어' },
    { id: 'tokenpost', label: '토큰포스트' },
    { id: 'coinness', label: '코인니스' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      <div className="flex flex-col gap-6 mb-8 border-b pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Newspaper className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">실시간 소식</h1>
            <p className="text-sm text-muted-foreground mt-0.5">글로벌 및 국내 암호화폐 시장 속보</p>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-primary-foreground/20 text-[10px]">
                  {filteredNews.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredNews.map((item) => {
          const isExpanded = expandedItems.has(item.id);
          const sourceBadge = {
            investing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            blockmedia: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
            tokenpost: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            coinness: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
          }[item.source];

          const sourceName = {
            investing: 'Investing',
            blockmedia: 'Blockmedia',
            tokenpost: 'Tokenpost',
            coinness: 'Coinness',
          }[item.source];

          return (
            <article
              key={item.id}
              className={cn(
                "group relative overflow-hidden bg-card border border-border/50 rounded-2xl transition-all hover:bg-muted/30 shadow-sm",
                isExpanded && "ring-1 ring-primary/20 bg-muted/20"
              )}
            >
              <div 
                className="p-5 cursor-pointer select-none"
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex items-start gap-4">
                  {item.image && (
                    <div className="hidden sm:block flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-border/30">
                      <img 
                        src={item.image} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}

                  <div className="flex-1 space-y-2.5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider", sourceBadge)}>
                          {sourceName}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(item.date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    </div>

                    <h2 className={cn(
                      "text-lg font-bold leading-snug group-hover:text-primary transition-colors",
                      !isExpanded && "line-clamp-2"
                    )}>
                      {item.title}
                    </h2>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border/30 animate-in fade-in slide-in-from-top-1 duration-200">
                    {item.description && (
                      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap mb-4 font-normal">
                        {item.description}
                      </div>
                    )}
                    <div className="flex items-center justify-end">
                      <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-full px-4" onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.link, '_blank', 'noopener,noreferrer');
                      }}>
                        <ExternalLink className="w-3 h-3" />
                        원문 보기
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-32 bg-muted/10 rounded-3xl border border-dashed border-border/50 backdrop-blur-sm">
          <ImageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">표시할 뉴스가 현재 없습니다.</p>
        </div>
      )}
    </div>
  );
}
