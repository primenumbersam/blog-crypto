
export async function getExchangeRate() {
  const apiKey = process.env.ExchangeRate_API_KEY;

  // 1. Try real-time endpoints for precise and frequent updates
  const endpoints = [
    "https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD", // Upbit's actual standard
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    apiKey ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD` : null,
    "https://open.er-api.com/v6/latest/USD"
  ].filter(url => url !== null) as string[];

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        next: { revalidate: 600 }, // Cache for 10 minutes instead of 1 hour for fresher data
        signal: (AbortSignal as any).timeout(5000), // 5s timeout
        headers: {
          "User-Agent": "Mozilla/5.0" // Required by some APIs
        }
      });

      if (!response.ok) continue;

      const data = await response.json();
      let rate = null;
      let lastUpdate = new Date().toISOString();

      // Parse depending on which API succeeded
      if (url.includes("dunamu")) {
        rate = data[0]?.basePrice;
        if (data[0]?.date && data[0]?.time) {
          // Dunamu gives date "2026-04-01", time "14:40:00"
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
