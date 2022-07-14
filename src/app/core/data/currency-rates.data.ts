import {CurrencyCode, CurrencyCodes, CurrencyRateOption, CurrencyRatesData} from '@core/models';

export const mainCurrencyCodes: CurrencyCodes = [
  CurrencyCode.UAH,
  CurrencyCode.USD,
  CurrencyCode.EUR
];

export const availableCurrencyCodes: CurrencyCodes = [
  ...mainCurrencyCodes,
  CurrencyCode.CAD,
  CurrencyCode.JPY,
  CurrencyCode.PLN,
  CurrencyCode.MNT
];

export const currencyRatesOptions: CurrencyRateOption[] = [
  {label: 'Ukrainian Hryvnia', value: CurrencyCode.UAH},
  {label: 'United States Dollar', value: CurrencyCode.USD},
  {label: 'Euro', value: CurrencyCode.EUR},
  {label: 'Canadian Dollar', value: CurrencyCode.CAD},
  {label: 'Japanese Yena', value: CurrencyCode.JPY},
  {label: 'Polish Zloty', value: CurrencyCode.PLN},
  {label: 'Mongolian Tugrik', value: CurrencyCode.MNT}
];


export const emptyCurrencyRatesData: CurrencyRatesData = {base: null, rates: null};
