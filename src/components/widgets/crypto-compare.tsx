"use client";
import React, { useEffect, useRef } from "react";

/**
 * CryptoCompare Multi-Coin Widget with custom theme
 * Shows BTC, ETH, XRP prices in USD, KRW, EUR, JPY.
 */
export default function CryptoCompareWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set theme globally as the widget script expects it
    (window as any).cccTheme = {
      "General": { "background": "#121212", "borderColor": "#000" },
      "Tabs": { "background": "#000", "color": "#FFF", "borderColor": "#333", "activeBackground": "#333", "activeColor": "#FFF" },
      "Row": { "color": "#FFF", "borderColor": "#585858" },
      "Conversion": { "background": "#000", "color": "#CCC" }
    };

    const appName = typeof window !== "undefined" ? encodeURIComponent(window.location.hostname || "local") : "local";
    const baseUrl = "https://widgets.cryptocompare.com/";
    const theUrl = baseUrl + 'serve/v1/coin/multi?fsyms=BTC,ETH,XRP&tsyms=USD,KRW,EUR,JPY';
    
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = theUrl + (theUrl.indexOf("?") >= 0 ? "&" : "?") + "app=" + appName;

    // Append to the container
    containerRef.current.innerHTML = ""; // Clear previous if any
    containerRef.current.appendChild(script);

    return () => {
      // Cleanup if necessary
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="w-full bg-[#121212] overflow-x-auto min-h-[150px]">
      <div ref={containerRef} id="cryptocompare-multi-coin-widget" />
    </div>
  );
}
