
import { NextResponse } from "next/server";
import { KIMP_SYMBOLS, KIMP_MAPPING } from "@/lib/kimp-constants";
import { getExchangeRate } from "@/lib/exchange-rate";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. 환율 정보 가져오기
    const exchangeRateData = await getExchangeRate();
    const rate = exchangeRateData?.rate || 1400; // 실패 시 기본 1400원

    // 2. 업비트 티커 한 번에 가져오기
    const upbitMarkets = KIMP_SYMBOLS.map((s) => KIMP_MAPPING[s].upbit).join(",");
    const upbitTickersRes = await fetch(
      `https://api.upbit.com/v1/ticker?markets=${upbitMarkets}`,
      { next: { revalidate: 3600 } }
    );
    const upbitTickersArray: any[] = await upbitTickersRes.json();
    const upbitTickersMap = new Map(upbitTickersArray.map((t) => [t.market, t]));

    // 3. 바이낸스 티커 한 번에 가져오기
    const binanceTickersRes = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr`,
      { next: { revalidate: 3600 } }
    );
    const binanceTickersArray: any[] = await binanceTickersRes.json();
    // 필요한 바이낸스 티커만 맵으로 변환
    const neededBinanceSymbols = new Set(
      KIMP_SYMBOLS.map((s) => KIMP_MAPPING[s].binance)
    );
    const binanceTickersMap = new Map(
      binanceTickersArray
        .filter((t) => neededBinanceSymbols.has(t.symbol))
        .map((t) => [t.symbol, t])
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

      // 52주 고/저가
      const weeksRes = await fetch(
        `https://api.upbit.com/v1/candles/weeks?market=${mapping.upbit}&count=52`,
        { next: { revalidate: 3600 } }
      );
      let weeksCandles = [];
      if (weeksRes.ok) {
        weeksCandles = await weeksRes.json();
      }
      
      const high52 = weeksCandles.length > 0 ? Math.max(...weeksCandles.map((c: any) => c.high_price)) : 0;
      const low52 = weeksCandles.length > 0 ? Math.min(...weeksCandles.map((c: any) => c.low_price)) : 0;

      await delay(100); // 100ms 지연

      // 30일 스파크라인
      const daysRes = await fetch(
        `https://api.upbit.com/v1/candles/days?market=${mapping.upbit}&count=30`,
        { next: { revalidate: 3600 } }
      );
      let daysCandles = [];
      if (daysRes.ok) {
        daysCandles = await daysRes.json();
      }
      const sparkline = daysCandles
        .map((c: any) => c.trade_price)
        .reverse(); // 과거 -> 현재 순서

      await delay(100); // 100ms 지연

      kimpData.push({
        symbol,
        upbitPrice,
        binancePrice,
        kimp,
        change24h: upbitTicker?.signed_change_rate * 100 || 0,
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
      { error: "Failed to fetch kimp data" },
      { status: 500 }
    );
  }
}
