import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "느좋 코린: 광고 없는 실시간 김프 및 퀀트 지표 대시보드",
  description: "느좋 코린: 성공팔이와 보그병신체로부터 자유로운 클린 김치프리미엄 대시보드. 업비트, 바이낸스 실시간 데이터와 퀀트 지표를 투명하게 제공합니다.",
  keywords: ["느좋코린", "김치프리미엄", "코인김프", "실시간김프", "비트코인시세", "퀀트지표", "암호화폐자동화", "gitsam"],
  authors: [{ name: "gitsam", url: "https://gitsam.com" }],
  metadataBase: new URL("https://primenumbersam.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "느좋 코린 - 광고 없이 깨끗한 퀀트 터미널",
    description: "생각은 깊게, 구현은 쉽게. 주요 투자지표 현황판.",
    url: "https://primenumbersam.vercel.app",
    siteName: "느좋 코린",
    images: [
      {
        url: "/screen.jpg",
        width: 1200,
        height: 630,
        alt: "느좋 코린 대시보드 스크린샷",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.png",
  },
};

export const revalidate = 300; // 5-minute cache for Root Layout

import { SEO } from "@/components/SEO";


import { TopNav } from "@/components/layout/top-nav";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { getExchangeRate } from "@/lib/exchange-rate";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const exchangeRateData = await getExchangeRate();

  return (
    <html lang="ko" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <SEO />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TopNav exchangeRate={exchangeRateData?.rate} />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
