type Rates = {
  [key: string]: number;
};

// Now base is USD (USD = 1)
const exchangeRates: Rates = {
  USD: 1,
  INR: 83,        // 1 USD = 83 INR
  EUR: 0.92,
  GBP: 0.8,
  AUD: 1.53,
  CAD: 1.36,
  AED: 3.67,
  SGD: 1.35,
  JPY: 154,
  CNY: 7.2,
  ZAR: 18.5,
  NZD: 1.63,
  CHF: 0.91,
  SEK: 10.7,
  NOK: 10.9,
  DKK: 6.9,
  HKD: 7.8,
  KRW: 1350,
  THB: 36.5,
  MYR: 4.75,
  IDR: 16000,
  PKR: 278,
  BDT: 110,
  LKR: 300,
  RUB: 92,
  TRY: 32.5,
  BRL: 5.1,
  MXN: 17.2,
};

export function convertPrice(priceInUSD: number, targetCurrency: string): number {
  const rate = exchangeRates[targetCurrency] || 1;
  return priceInUSD * rate;
}
