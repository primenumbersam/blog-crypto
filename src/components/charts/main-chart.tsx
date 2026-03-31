"use client";
import React, { useEffect, useRef } from "react";

export default function MainChart() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "BINANCE:BTCUSDT",
      interval: "15",
      timezone: "Asia/Seoul",
      theme: "dark",
      style: "1",
      locale: "kr",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      container_id: "tradingview_chart"
    });
    
    const currentContainer = container.current;
    if (currentContainer && !currentContainer.querySelector('script')) {
      currentContainer.appendChild(script);
    }

    return () => {
      // Avoid clean up script if needed or just handle multiple appends
      // Actually cleaning up might re-trigger script load
    };
  }, []);

  return (
    <div className="w-full h-[600px] border border-border/50 rounded-xl overflow-hidden bg-black shadow-2xl transition-all hover:border-primary/30">
      <div id="tradingview_chart" ref={container} className="h-full w-full" />
    </div>
  );
}
