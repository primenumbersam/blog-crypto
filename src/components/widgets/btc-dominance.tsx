"use client";

import React, { useEffect, useRef, memo } from 'react';

function BTCDominanceWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!container.current) return;

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "symbol": "CRYPTOCAP:BTC.D",
          "width": "100%",
          "height": "100%",
          "locale": "en",
          "dateRange": "12M",
          "colorTheme": "dark",
          "isTransparent": false,
          "autosize": true,
          "largeChartUrl": ""
        }`;
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
    <div className="tradingview-widget-container w-full h-full" ref={container}>
      <div className="tradingview-widget-container__widget h-full"></div>
    </div>
  );
}

export default memo(BTCDominanceWidget);
