
export async function getExchangeRate() {
  const apiKey = process.env.ExchangeRate_API_KEY;

  // 1. Try different endpoints for better reliability and frequency
  // Standard free plan key on exchangerate-api only updates every 24h,
  // but open.er-api.com (their own public API) updates hourly.
  const endpoints = [
    apiKey ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD` : null,
    "https://open.er-api.com/v6/latest/USD",
    "https://api.exchangerate-api.com/v4/latest/USD"
  ].filter(url => url !== null) as string[];

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour
        signal: (AbortSignal as any).timeout(5000) // 5s timeout
      });

      if (!response.ok) continue;

      const data = await response.json();
      const rate = data.conversion_rates?.KRW || data.rates?.KRW;

      if (rate) {
        return {
          rate: rate,
          lastUpdate: data.time_last_update_utc || data.date,
        };
      }
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
    }
  }

  // Final fallback if all failed
  return null;
}
