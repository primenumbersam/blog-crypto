
export const KIMP_SYMBOLS = [
  "USDT",
  "USDC",
  "BTC",
  "ETH",
  "XRP",
  "SOL",
  "TRX",
  "LINK",
  "DOGE",
  "PEPE",
  "RAY",
  "ONDO",
  "G",
] as const;

export type KimpSymbol = (typeof KIMP_SYMBOLS)[number];

export interface MarketMapping {
  upbit: string;
  binance: string;
  isStable: boolean;
  nameKo: string;
}

export const KIMP_MAPPING: Record<KimpSymbol, MarketMapping> = {
  USDT: { upbit: "KRW-USDT", binance: "KRAKEN:USDTUSD", isStable: true, nameKo: "테더" },
  USDC: { upbit: "KRW-USDC", binance: "USDCUSDT", isStable: true, nameKo: "유에스디씨" },
  BTC: { upbit: "KRW-BTC", binance: "BTCUSDT", isStable: false, nameKo: "비트코인" },
  ETH: { upbit: "KRW-ETH", binance: "ETHUSDT", isStable: false, nameKo: "이더리움" },
  XRP: { upbit: "KRW-XRP", binance: "XRPUSDT", isStable: false, nameKo: "리플" },
  SOL: { upbit: "KRW-SOL", binance: "SOLUSDT", isStable: false, nameKo: "솔라나" },
  TRX: { upbit: "KRW-TRX", binance: "TRXUSDT", isStable: false, nameKo: "트론" },
  LINK: { upbit: "KRW-LINK", binance: "LINKUSDT", isStable: false, nameKo: "체인링크" },
  DOGE: { upbit: "KRW-DOGE", binance: "DOGEUSDT", isStable: false, nameKo: "도지코인" },
  PEPE: { upbit: "KRW-PEPE", binance: "PEPEUSDT", isStable: false, nameKo: "페페" },
  RAY: { upbit: "KRW-RAY", binance: "RAYUSDT", isStable: false, nameKo: "레이디움" },
  ONDO: { upbit: "KRW-ONDO", binance: "ONDOUSDT", isStable: false, nameKo: "온도" },
  G: { upbit: "KRW-G", binance: "GUSDT", isStable: false, nameKo: "그래비티" },
};

/**
 * Gets the Upbit market string from the symbol.
 */
export const getUpbitMarket = (symbol: KimpSymbol) => KIMP_MAPPING[symbol].upbit;

/**
 * Gets the Binance symbol from the symbol.
 */
export const getBinanceSymbol = (symbol: KimpSymbol) => KIMP_MAPPING[symbol].binance;
