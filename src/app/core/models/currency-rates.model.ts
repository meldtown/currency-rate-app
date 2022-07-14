export enum CurrencyCode {
  UAH = 'UAH',
  USD = 'USD',
  EUR = 'EUR',
  CAD = 'CAD',
  JPY = 'JPY',
  PLN = 'PLN',
  MNT = 'MNT'
};

export type CurrencyCodes = ReadonlyArray<CurrencyCode>;

export type CurrencyRateOption = Readonly<{
  label: string;
  value: CurrencyCode
}>;

export type CurrencyRates = Record<CurrencyCode, number>;

export type CurrencyRatesResponse = Readonly<{
  motd: {
    msg: string;
    url: string
  };
  success: boolean;
  base: CurrencyCode;
  date: string;
  rates: CurrencyRates;
}>;

export type CurrencyRatesData = Pick<CurrencyRatesResponse, 'base' | 'rates'>;

export type CurrencyRatesParams = Readonly<{
  base: CurrencyCode;
  symbols: CurrencyCodes;
}>;

export type CurrencyRatesInfo = Map<CurrencyCode, CurrencyRates>;
