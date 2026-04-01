
export async function getExchangeRate() {
  const apiKey = process.env.ExchangeRate_API_KEY;

  // 1. Try real-time endpoints for precise and frequent updates
  const endpoints = [
    "https://api.manana.kr/exchange/rate/KRW/USD.json", // Reliable Korean source
    "https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD", // Upbit's source
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    apiKey ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD` : null,
    "https://open.er-api.com/v6/latest/USD"
  ].filter(url => url !== null) as string[];

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        next: { revalidate: 300 }, // Cache for 5 minutes instead of 1 hour
        signal: (AbortSignal as any).timeout(5000), // 5s timeout
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });

      if (!response.ok) continue;

      const data = await response.json();
      let rate = null;
      let lastUpdate = new Date().toISOString();

      // Parse depending on which API succeeded
      if (url.includes("manana")) {
        rate = data[0]?.rate;
      } else if (url.includes("dunamu")) {
        rate = data[0]?.basePrice;
        if (data[0]?.date && data[0]?.time) {
          lastUpdate = `${data[0].date}T${data[0].time}Z`;
        }
      } else if (url.includes("fawazahmed0")) {
        rate = data.usd?.krw;
        lastUpdate = data.date || lastUpdate;
      } else {
        rate = data.conversion_rates?.KRW || data.rates?.KRW;
        lastUpdate = data.time_last_update_utc || data.date || lastUpdate;
      }

      if (rate) {
        return {
          rate: rate,
          lastUpdate: lastUpdate,
        };
      }
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
    }
  }

  // Final fallback if all failed (e.g. offline)
  return null;
}
