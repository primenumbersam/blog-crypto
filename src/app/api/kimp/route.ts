import { NextResponse } from "next/server";
import { KIMP_SYMBOLS, KIMP_MAPPING } from "@/lib/kimp-constants";
import { getExchangeRate } from "@/lib/exchange-rate";

export const revalidate = 60; // Cache the API response for 60 seconds

export async function GET() {
  try {
    // 1. 환율 정보 가져오기
    const exchangeRateData = await getExchangeRate();
    const rate = exchangeRateData?.rate || 1400; // 실패 시 기본 1400원

    // 2. 업비트 티커 한 번에 가져오기
    const upbitMarkets = KIMP_SYMBOLS.map((s) => KIMP_MAPPING[s].upbit).join(",");
    const upbitTickersRes = await fetch(
      `https://api.upbit.com/v1/ticker?markets=${upbitMarkets}`,
      { next: { revalidate: 10 } }
    );
    const upbitTickersText = await upbitTickersRes.text();
    let upbitTickersArray: any[] = [];
    try {
      upbitTickersArray = JSON.parse(upbitTickersText);
    } catch (e) {
      console.error("Upbit tickers parse error", upbitTickersText);
      throw new Error("Failed to parse upbit tickers");
    }
    const upbitTickersMap = new Map(upbitTickersArray.map((t) => [t.market, t]));

    // 3. 바이낸스 티커 한 번에 가져오기
    const binanceTickersRes = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr`,
      { next: { revalidate: 10 } }
    );
    const binanceTickersText = await binanceTickersRes.text();
    let binanceTickersArray: any[] = [];
    try {
      binanceTickersArray = JSON.parse(binanceTickersText);
    } catch (e) {
      console.error("Binance tickers parse error", binanceTickersText);
    }

    // 필요한 바이낸스 티커만 맵으로 변환
    const neededBinanceSymbols = new Set(
      KIMP_SYMBOLS.map((s) => KIMP_MAPPING[s].binance)
    );
    const binanceTickersMap = new Map(
      binanceTickersArray
        .filter((t: any) => neededBinanceSymbols.has(t.symbol))
        .map((t: any) => [t.symbol, t])
    );

    const kimpData = [];

    // Helper for delay
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const symbol of KIMP_SYMBOLS) {
      const mapping = KIMP_MAPPING[symbol];
      const upbitTicker = upbitTickersMap.get(mapping.upbit);
      const binanceTicker = binanceTickersMap.get(mapping.binance);

      let binancePrice = 1.0;
      if (!mapping.isStable) {
        binancePrice = binanceTicker ? parseFloat(binanceTicker.lastPrice) : 0;
      }

      const upbitPrice = upbitTicker?.trade_price || 0;
      const kimp =
        binancePrice > 0 ? (upbitPrice / (binancePrice * rate) - 1) * 100 : 0;

      // 52주 고/저가 (Cache for 1 hour since they don't change fast)
      const weeksRes = await fetch(
        `https://api.upbit.com/v1/candles/weeks?market=${mapping.upbit}&count=52`,
        { next: { revalidate: 3600 } }
      );

      let weeksCandles: any[] = [];
      if (weeksRes.ok) {
        try {
          const text = await weeksRes.text();
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) weeksCandles = parsed;
        } catch (e) { }
      }

      const high52 = weeksCandles.length > 0 ? Math.max(...weeksCandles.map((c: any) => c.high_price)) : 0;
      const low52 = weeksCandles.length > 0 ? Math.min(...weeksCandles.map((c: any) => c.low_price)) : 0;

      await delay(50); // 50ms 지연

      // 30일 스파크라인 (Cache for 1 hour)
      const daysRes = await fetch(
        `https://api.upbit.com/v1/candles/days?market=${mapping.upbit}&count=30`,
        { next: { revalidate: 3600 } }
      );

      let daysCandles: any[] = [];
      if (daysRes.ok) {
        try {
          const text = await daysRes.text();
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) daysCandles = parsed;
        } catch (e) { }
      }
      const sparkline = daysCandles
        .map((c: any) => c.trade_price)
        .reverse(); // 과거 -> 현재 순서

      await delay(50); // 50ms 지연

      kimpData.push({
        symbol,
        upbitPrice,
        binancePrice,
        kimp,
        change24h: upbitTicker?.signed_change_rate ? upbitTicker.signed_change_rate * 100 : 0,
        high52,
        low52,
        sparkline,
        high52Diff: high52 > 0 ? ((upbitPrice / high52) - 1) * 100 : 0,
        low52Diff: low52 > 0 ? ((upbitPrice / low52) - 1) * 100 : 0,
      });
    }

    return NextResponse.json({
      data: kimpData,
      rate,
      lastUpdate: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Kimp API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch kimp data", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
