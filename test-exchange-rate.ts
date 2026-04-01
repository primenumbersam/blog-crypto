import { getExchangeRate } from "./src/lib/exchange-rate";

async function main() {
  const data = await getExchangeRate();
  console.log("Exchange Rate:", data);
}

main();
