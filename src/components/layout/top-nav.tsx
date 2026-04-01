"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Newspaper, LayoutDashboard, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";


interface TopNavProps {
  exchangeRate?: number | null;
}

export function TopNav({ exchangeRate: initialExchangeRate }: TopNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(initialExchangeRate);

  useEffect(() => {
    // 만약 서버에서 준 값이 있더라도, 클라이언트에서 한 번 더 최신화
    const fetchFreshRate = async () => {
      try {
        const res = await fetch("/api/kimp");
        const json = await res.json();
        if (json.rate) {
          setExchangeRate(json.rate);
        }
      } catch (e) {
        console.error("Failed to fetch fresh rate in top-nav", e);
      }
    };
    
    // 페이지 로드 1초 후 반영 (초기 수화 안정성 위해)
    const timer = setTimeout(fetchFreshRate, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { title: "김프", href: "/kimp", icon: LayoutDashboard },
    { title: "지표", href: "/indicators", icon: Globe },
    { title: "뉴스", href: "/news", icon: Newspaper },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container max-w-7xl flex h-16 items-center justify-between mx-auto px-4 md:px-0">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl tracking-tighter hover:text-primary transition-colors">
            느좋 코린
          </Link>
          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end gap-0.5 mr-2">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">USD/KRW</span>
            <span className="text-sm font-bold text-primary tabular-nums">
              {exchangeRate ? exchangeRate.toLocaleString('ko-KR', { maximumFractionDigits: 0 }) : "---"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link href="https://gitsam.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex rounded-full border-primary/20 hover:bg-primary/5">딸깍</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none ml-1"
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 h-screen bg-background border-t transition-all duration-300 ease-in-out transform",
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}
        style={{ top: '64px' }}
      >
        <div className="p-6 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between p-4 rounded-xl hover:bg-primary/5 transition-all text-lg font-bold border border-transparent hover:border-primary/10"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <span>{item.title}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:translate-x-1 group-hover:text-primary transition-all" />
            </Link>
          ))}

          <div className="mt-6 pt-6 border-t">
            <div className="p-4 bg-muted/30 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">환경 설정</p>
                <div className="flex items-center gap-2 mt-1">
                  <ModeToggle />
                  <span className="text-sm font-medium text-muted-foreground">테마 전환</span>
                </div>
              </div>
              <Button onClick={() => setIsOpen(false)} className="rounded-full shadow-lg shadow-primary/20">데이터 갱신</Button>
            </div>
            <div className="mt-4 p-4 bg-primary/5 rounded-2xl">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-1">실시간 환율</p>
              <p className="text-xl font-black text-primary">
                {exchangeRate ? exchangeRate.toLocaleString('ko-KR', { maximumFractionDigits: 0 }) : "---"}
                <span className="text-sm font-normal text-muted-foreground ml-1">KRW</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
