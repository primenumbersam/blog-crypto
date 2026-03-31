"use client";

import React, { useEffect, useRef, memo } from 'react';

function TickerTapeWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!container.current) return;

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "symbols": [
            {
              "proName": "CRYPTOCAP:BTC.D",
              "title": "BTC Dominance"
            },
            {
              "proName": "COINBASE:BTCUSD",
              "title": "BTC/USD"
            },
            {
              "proName": "NASDAQ:GOOG",
              "title": "Google"
            },
            {
              "proName": "NASDAQ:NVDA",
              "title": "NVIDIA"
            },
            {
              "proName": "KRX:005930",
              "title": "Samsung Electronics"
            },
            {
              "proName": "KRX:000660",
              "title": "SK Hynix"
            }
          ],
          "showSymbolLogo": true,
          "isTransparent": false,
          "displayMode": "adaptive",
          "colorTheme": "dark",
          "locale": "en"
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
    <div className="tradingview-widget-container w-full" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(TickerTapeWidget);
