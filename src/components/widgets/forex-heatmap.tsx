"use client";
import React, { useEffect, useRef, memo } from 'react';

function ForexHeatMapWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!container.current) return;
      
      // Clear previous if re-rendered
      container.current.innerHTML = "";
      
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "colorTheme": "dark",
          "isTransparent": false,
          "locale": "en",
          "currencies": [
            "KRW",
            "USD",
            "EUR",
            "JPY",
            "CNY"
          ],
          "backgroundColor": "#0F0F0F",
          "width": "100%",
          "height": "100%"
        }`;
      
      const wrapper = document.createElement("div");
      wrapper.className = "tradingview-widget-container__widget";
      
      container.current.appendChild(wrapper);
      container.current.appendChild(script);

      return () => {
        if (container.current) {
          container.current.innerHTML = "";
        }
      };
    },
    []
  );

  return (
    <div className="w-full h-full min-h-[400px] bg-[#131722]/30 rounded-xl border border-border/50 p-2 overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="tradingview-widget-container h-full w-full" ref={container}>
        {/* Widget and script inserted here */}
      </div>
      <div className="text-[10px] text-muted-foreground mt-1 text-center">
        <a href="https://www.tradingview.com/markets/currencies/cross-rates-overview-heat-map/" rel="noopener nofollow" target="_blank" className="hover:text-primary">
          Forex Heatmap
        </a> by TradingView
      </div>
    </div>
  );
}

export default memo(ForexHeatMapWidget);
