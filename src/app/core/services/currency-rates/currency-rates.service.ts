import {BehaviorSubject, combineLatest, distinct, map, mergeMap, Observable, scan, shareReplay} from 'rxjs';

import {Injectable} from '@angular/core';

import {CurrencyRatesApiService} from '@core/services';
import {availableCurrencyCodes, mainCurrencyCodes} from '@core/data';
import {
  CurrencyCode,
  CurrencyCodes,
  CurrencyRates,
  CurrencyRatesData,
  CurrencyRatesInfo,
  CurrencyRatesParams
} from '@core/models';

@Injectable()
export class CurrencyRatesService {
  static readonly DEFAULT_CURRENCY = CurrencyCode.UAH;
  static readonly MAIN_CURRENCIES = mainCurrencyCodes;
  static readonly AVAILABLE_CURRENCIES = availableCurrencyCodes;

  static get convertToMainCurrencies(): CurrencyCodes {
    return this.getConvertToCurrencies(this.DEFAULT_CURRENCY, this.MAIN_CURRENCIES);
  }

  static get convertToAvailableCurrencies(): CurrencyCodes {
    return this.getConvertToCurrencies(this.DEFAULT_CURRENCY, this.AVAILABLE_CURRENCIES);
  }

  private selectedCurrency$ = new BehaviorSubject<CurrencyCode>(CurrencyRatesService.DEFAULT_CURRENCY);

  private currencyRates$ = this.selectedCurrency$
    .pipe(
      distinct(),
      mergeMap(base => this.fetchCurrencyRates(base)),
      scan<{ base: CurrencyCode, rates: CurrencyRates }, CurrencyRatesInfo, CurrencyRatesInfo>(
        (state, {base, rates}) => {
          if (base && rates) state.set(base, rates); // Handle server error

          return state;
        },
        new Map()
      )
    );

  selectedCurrencyRates$ = combineLatest([this.selectedCurrency$, this.currencyRates$])
    .pipe(
      map(([selectedCurrency, rates]) => rates.get(selectedCurrency) || null),
      shareReplay(1)
    );

  constructor(private apiService: CurrencyRatesApiService) {
  }

  selectCurrency(base: CurrencyCode): void {
    this.selectedCurrency$.next(base);
  }

  private static getConvertToCurrencies(base: CurrencyCode, symbols: CurrencyCodes): CurrencyCodes {
    const convertToCurrencies = [...symbols];
    const index = convertToCurrencies.indexOf(base);

    convertToCurrencies.splice(index, 1);

    return convertToCurrencies
  }

  private generateParams(base: CurrencyCode): CurrencyRatesParams {
    const availableCurrencies = [...CurrencyRatesService.AVAILABLE_CURRENCIES];
    const symbols = CurrencyRatesService.getConvertToCurrencies(base, availableCurrencies);

    return {base, symbols};
  }

  private fetchCurrencyRates(base: CurrencyCode): Observable<CurrencyRatesData> {
    const params = this.generateParams(base);

    return this.apiService.fetchRates(params);
  }
}
