import {CurrencyCode, CurrencyRateOption} from '@core/models';
import {currencyRatesOptions} from '@core/data';

export const getCurrencyRateOption = (code: CurrencyCode): CurrencyRateOption => {
  return currencyRatesOptions.find(({value}) => value === code);
};
