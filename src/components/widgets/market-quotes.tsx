"use client";

import React, { useEffect, useRef, memo } from 'react';

function MarketQuotesWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!container.current) return;

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "colorTheme": "dark",
          "locale": "en",
          "largeChartUrl": "",
          "isTransparent": false,
          "showSymbolLogo": true,
          "backgroundColor": "#0F0F0F",
          "support_host": "https://www.tradingview.com",
          "width": "100%",
          "height": "100%",
          "symbolsGroups": [
            {
              "name": "US",
              "symbols": [
                {
                  "name": "FOREXCOM:SPXUSD",
                  "displayName": "S&P 500 Index"
                },
                {
                  "name": "FOREXCOM:DJI",
                  "displayName": "Dow Jones Industrial Average Index"
                },
                {
                  "name": "PEPPERSTONE:NAS100",
                  "displayName": "나스닥 100"
                }
              ]
            },
            {
              "name": "Commodity",
              "symbols": [
                {
                  "name": "TVC:USOIL",
                  "displayName": "WTI"
                },
                {
                  "name": "TVC:UKOIL",
                  "displayName": "Brent Oil"
                },
                {
                  "name": "PEPPERSTONE:NATGAS",
                  "displayName": "천연가스"
                }
              ]
            },
            {
              "name": "Metal",
              "symbols": [
                {
                  "name": "TVC:GOLD",
                  "displayName": "금"
                },
                {
                  "name": "TVC:SILVER",
                  "displayName": "은"
                },
                {
                  "name": "CAPITALCOM:COPPER",
                  "displayName": "동"
                }
              ]
            }
          ]
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

export default memo(MarketQuotesWidget);
