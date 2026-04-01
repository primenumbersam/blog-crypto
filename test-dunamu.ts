async function fetchDunamu() {
  const res = await fetch("https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD");
  const data = await res.json();
  console.log(data);
}
fetchDunamu();
