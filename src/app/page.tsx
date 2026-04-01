import ForexHeatMapWidget from "@/components/widgets/forex-heatmap";
import EconomicMapWidget from "@/components/widgets/economic-map";
import CryptoCompareWidget from "@/components/widgets/crypto-compare";
import FearGreedChart from "@/components/charts/fear-greed-chart";
import MainChart from "@/components/charts/main-chart";
import TickerTapeWidget from "@/components/widgets/ticker-tape";
import HashRateCard from "@/components/widgets/hash-rate-card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { ArrowUpRight, TrendingUp, Zap, Newspaper, Coins, Gauge, PieChart, BarChart, ExternalLink, ShieldCheck, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const indicatorLinks = [
  // Group 1: BTC Derivative Market
  { name: "Liquidation (24h)", url: "https://www.coinglass.com/LiquidationData", group: "Derivative" },
  { name: "Liquidation Map", url: "https://www.coinglass.com/pro/futures/LiquidationMap", group: "Derivative" },
  { name: "Liquidation Heatmap", url: "https://www.coinglass.com/pro/futures/LiquidationHeatMap", group: "Derivative" },
  { name: "Open Interest (24h)", url: "https://www.coinglass.com/BitcoinOpenInterest", group: "Derivative" },
  { name: "Futures Long/Short", url: "https://www.coinglass.com/LongShortRatio", group: "Derivative" },
  { name: "Options Call/Put", url: "https://www.coinglass.com/options", group: "Derivative" },

  // Group 2: BTC On-chain Metrics (Pro Indicators)
  { name: "4-Year Moving Average", url: "https://www.coinglass.com/pro/i/four-year-moving-average", group: "On-chain" },
  { name: "MVRV Ratio", url: "https://www.coinglass.com/pro/i/mvrv-ratio", group: "On-chain" },
  { name: "LTH-MVRV", url: "https://www.coinglass.com/pro/i/long-term-holder-mvrv", group: "On-chain" },
  { name: "STH-MVRV", url: "https://www.coinglass.com/pro/i/short-term-holder-mvrv", group: "On-chain" },
  { name: "LTH-Supply", url: "https://www.coinglass.com/pro/i/long-term-holder-supply", group: "On-chain" },
  { name: "LTH-SOPR", url: "https://www.coinglass.com/pro/i/long-term-holder-sopr", group: "On-chain" },
];

export default function Home() {
  const derivativeLinks = indicatorLinks.filter(l => l.group === "Derivative");
  const onChainLinks = indicatorLinks.filter(l => l.group === "On-chain");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Ticker Tape at the very top */}
      <div className="w-full border-b border-border/50 bg-card">
        <TickerTapeWidget />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Main Chart Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
              <TrendingUp className="w-6 h-6" /> BTC/USDT
            </h2>
            <div className="flex gap-2">
              <Link
                href="/kimp"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex items-center gap-1")}
              >
                <Zap className="w-4 h-4" /> 김프
              </Link>
              <Link
                href="/news"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "flex items-center gap-1")}
              >
                <Newspaper className="w-4 h-4" /> 뉴스
              </Link>
            </div>
          </div>
          <MainChart />
        </div>

        {/* 1. Crypto Section */}
        <div className="space-y-4 mb-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-500" /> 가상자산 지표
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Real-time Crypto Prices Widget */}
            <Card className="bg-card/50 border-border/50 shadow-sm overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-orange-500" /> 실시간 주요 시세
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-auto border-t border-border/20">
                <CryptoCompareWidget />
              </CardContent>
            </Card>

            {/* Fear & Greed */}
            <Card className="bg-card/50 border-border/50 shadow-sm overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-primary" /> Fear & Greed Index (30d)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[250px] pt-4">
                <FearGreedChart />
              </CardContent>
            </Card>

            {/* Hash Rate */}
            <HashRateCard />
          </div>
        </div>

        {/* External Analysis Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Derivative Market Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 px-1">
              <Activity className="w-5 h-5 text-blue-500" /> 파생상품 시장 (Coinglass)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {derivativeLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "justify-between font-normal text-xs h-10 hover:bg-primary/5 hover:text-primary transition-colors"
                  )}
                >
                  {link.name}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </Link>
              ))}
            </div>
          </div>

          {/* On-chain Metrics Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 px-1">
              <ShieldCheck className="w-5 h-5 text-green-500" /> 온체인 분석 (Pro)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {onChainLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "justify-between font-normal text-xs h-10 hover:bg-primary/5 hover:text-primary transition-colors"
                  )}
                >
                  {link.name}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
