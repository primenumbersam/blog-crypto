"use client";
import React, { useEffect, useRef } from "react";

interface TradingViewRowWidgetProps {
  symbol: string;
}

export default function TradingViewRowWidget({ symbol }: TradingViewRowWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject the tradingview script only if it's not already there
    if (!container.current) return;
    
    // Clear previous if re-rendered
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol.includes(":") ? symbol : `BINANCE:${symbol}`,
      interval: "60",
      timezone: "Asia/Seoul",
      theme: "dark",
      style: "1",
      locale: "kr",
      enable_publishing: false,
      allow_symbol_change: false,
      calendar: false,
      hide_top_toolbar: true,
      hide_legend: false,
      save_image: false,
      container_id: `tradingview_row_${symbol}`
    });
    
    container.current.appendChild(script);

    return () => {
      // Cleanup could just be emptying the inner HTML
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [symbol]);

  return (
    <div className="w-full h-[400px] bg-black">
      <div id={`tradingview_row_${symbol}`} ref={container} className="h-full w-full" />
    </div>
  );
}
