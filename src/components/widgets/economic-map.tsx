"use client";
import React, { useEffect, useRef } from "react";

export default function EconomicMapWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    // Clear previous if re-rendered
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://widgets.tradingview-widget.com/w/kr/tv-economic-map.js";
    script.type = "module";
    script.async = true;
    
    // Container element
    const widgetElement = document.createElement("tv-economic-map");
    widgetElement.setAttribute("metrics", "iryy,intr,gdg,gdp");
    
    container.current.appendChild(script);
    container.current.appendChild(widgetElement);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="w-full h-[400px] bg-[#131722]/50 rounded-xl overflow-hidden border border-border/50 shadow-lg">
      <div ref={container} className="h-full w-full" />
    </div>
  );
}
