
export async function getExchangeRate() {
  const apiKey = process.env.ExchangeRate_API_KEY;
  if (!apiKey) {
    console.error("ExchangeRate_API_KEY is not defined");
    return null;
  }

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }

    const data = await response.json();
    return {
      rate: data.conversion_rates.KRW,
      lastUpdate: data.time_last_update_utc,
    };
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
}
