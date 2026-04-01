import React from "react";
import ForexHeatMapWidget from "@/components/widgets/forex-heatmap";
import EconomicMapWidget from "@/components/widgets/economic-map";
import StockHeatMapWidget from "@/components/widgets/stock-heatmap";
import CryptoHeatMapWidget from "@/components/widgets/crypto-heatmap";
import MarketOverviewWidget from "@/components/widgets/market-overview";
import MarketQuotesWidget from "@/components/widgets/market-quotes";
import { LayoutDashboard, BarChart3, Globe, TrendingUp, Search } from "lucide-react";

export default function IndicatorsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-700">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary" /> 시장 지표
          </h1>
          <p className="text-muted-foreground mt-2">
            주요 자산별 지수/지표 모니터링 터미널
          </p>
        </div>

        {/* Forex & Economic Maps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-500" /> Forex Heatmap
            </h2>
            <div className="flex flex-col h-[400px]">
              <ForexHeatMapWidget />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-primary" /> Economic Map
            </h2>
            <div className="flex flex-col h-[400px]">
              <EconomicMapWidget />
            </div>
          </div>
        </div>

        {/* Heatmaps Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" /> Stock Heatmap (S&P 500)
            </h2>
            <div className="h-[500px] w-full bg-card/50 border border-border/50 rounded-xl overflow-hidden shadow-sm p-1">
              <StockHeatMapWidget />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-500" /> Crypto Heatmap
            </h2>
            <div className="h-[500px] w-full bg-card/50 border border-border/50 rounded-xl overflow-hidden shadow-sm p-1">
              <CryptoHeatMapWidget />
            </div>
          </div>
        </div>

        {/* Market Data & Overview Section (Replaced placeholders) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" /> Market Overview
            </h2>
            <div className="h-[500px] w-full bg-card/50 border border-border/50 rounded-xl overflow-hidden shadow-sm">
              <MarketOverviewWidget />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Search className="w-5 h-5 text-green-500" /> Market Data
            </h2>
            <div className="h-[500px] w-full bg-card/50 border border-border/50 rounded-xl overflow-hidden shadow-sm">
              <MarketQuotesWidget />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
