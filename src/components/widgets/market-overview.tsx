"use client";

import React, { useEffect, useRef, memo } from 'react';

function MarketOverviewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!container.current) return;

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "colorTheme": "dark",
          "dateRange": "12M",
          "locale": "en",
          "largeChartUrl": "",
          "isTransparent": false,
          "showFloatingTooltip": false,
          "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
          "plotLineColorFalling": "rgba(41, 98, 255, 1)",
          "gridLineColor": "rgba(240, 243, 250, 0)",
          "scaleFontColor": "#DBDBDB",
          "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
          "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
          "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
          "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
          "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
          "tabs": [
            {
              "title": "US",
              "symbols": [
                {
                  "s": "FOREXCOM:SPXUSD",
                  "d": "S&P 500 Index"
                },
                {
                  "s": "FOREXCOM:DJI",
                  "d": "Dow Jones Industrial Average Index"
                },
                {
                  "s": "PEPPERSTONE:NAS100",
                  "d": "US Tech 100 Index",
                  "logoid": "indices/nasdaq-100",
                  "currency-logoid": "country/US"
                }
              ],
              "originalTitle": "Indices"
            },
            {
              "title": "Commodity",
              "symbols": [
                {
                  "s": "TVC:USOIL",
                  "d": "WTI",
                  "logoid": "crude-oil",
                  "currency-logoid": "country/US"
                },
                {
                  "s": "TVC:UKOIL",
                  "d": "Brent Oil",
                  "logoid": "crude-oil",
                  "currency-logoid": "country/US"
                },
                {
                  "s": "CAPITALCOM:NATURALGAS",
                  "d": "천연가스",
                  "logoid": "natural-gas",
                  "currency-logoid": "country/US"
                }
              ]
            },
            {
              "title": "Metal",
              "symbols": [
                {
                  "s": "TVC:GOLD",
                  "d": "금",
                  "logoid": "metal/gold",
                  "currency-logoid": "country/US"
                },
                {
                  "s": "TVC:SILVER",
                  "d": "은",
                  "logoid": "metal/silver",
                  "currency-logoid": "country/US"
                },
                {
                  "s": "CAPITALCOM:COPPER",
                  "d": "동",
                  "logoid": "metal/copper",
                  "currency-logoid": "country/US"
                }
              ]
            }
          ],
          "support_host": "https://www.tradingview.com",
          "backgroundColor": "#0f0f0f",
          "width": "100%",
          "height": "100%",
          "showSymbolLogo": true,
          "showChart": true
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

export default memo(MarketOverviewWidget);
