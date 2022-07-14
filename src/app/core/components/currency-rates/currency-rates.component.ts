import {isNil} from 'lodash';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {combineLatest, filter, map, pairwise, startWith, withLatestFrom} from 'rxjs';

import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {CurrencyRatesService} from '@core/services';
import {FormControl} from '@angular/forms';
import {CurrencyCode} from '@core/models';
import {getCurrencyRateOption} from '@core/helpers';

@UntilDestroy()
@Component({
  selector: 'app-currency-rates',
  templateUrl: './currency-rates.component.html',
  styleUrls: ['./currency-rates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyRatesComponent implements OnInit {
  private readonly FLOAT_DIGITS_COUNT = 4;

  selectedCurrencyRates$ = this.currencyRatesService.selectedCurrencyRates$;
  loading$ = this.selectedCurrencyRates$.pipe(map(rate => !rate));

  currencyOptions = CurrencyRatesService.AVAILABLE_CURRENCIES.map(code => getCurrencyRateOption(code));

  fromCurrencyCode = new FormControl<CurrencyCode>(CurrencyRatesService.DEFAULT_CURRENCY);
  toCurrencyCode = new FormControl<CurrencyCode>(CurrencyRatesService.convertToAvailableCurrencies[0]);

  fromCurrencyAmount = new FormControl<number>(1);
  toCurrencyAmount = new FormControl<number>(null);

  constructor(private currencyRatesService: CurrencyRatesService) {
  }

  ngOnInit() {
    this.subscribeToCurrencyCodes();
    this.subscribeToAmountControls();

    this.loading$
      .pipe(untilDestroyed(this))
      .subscribe(loading => this.handleControlsEnabledState(loading));
  }

  private handleControlsEnabledState(loading: boolean): void {
    [
      this.fromCurrencyCode,
      this.fromCurrencyAmount,
      this.toCurrencyCode,
      this.toCurrencyAmount
    ].forEach(control => loading ? control.disable({emitEvent: false}) : control.enable({emitEvent: false}));
  }

  private subscribeToAmountControls(): void {
    combineLatest([
      this.selectedCurrencyRates$,
      this.toCurrencyCode.valueChanges.pipe(startWith(this.toCurrencyCode.value)),
      this.fromCurrencyAmount.valueChanges.pipe(startWith(this.fromCurrencyAmount.value))
    ])
      .pipe(
        filter(([rates, toCurrencyCode]) => !!(rates && rates[toCurrencyCode])),
        map(([rates, toCurrencyCode]) => {
          const amount = this.fromCurrencyAmount.value;

          if (isNil(amount) || amount < 0) return null;

          const toCurrencyRate = rates[toCurrencyCode];
          const value = amount * toCurrencyRate;

          return parseFloat(value.toFixed(this.FLOAT_DIGITS_COUNT));
        })
      )
      .subscribe(value => this.toCurrencyAmount.setValue(value, {emitEvent: false}));

    this.toCurrencyAmount.valueChanges
      .pipe(
        withLatestFrom(this.selectedCurrencyRates$),
        filter(([ ,rates]) => !!(rates && rates[this.toCurrencyCode.value])),
        map(([amount, rates]) => {
          if (isNil(amount) || amount < 0) return null;

          const toCurrencyCode = this.toCurrencyCode.value;
          const toCurrencyRate = rates[toCurrencyCode];
          const value = amount / toCurrencyRate;

          return parseFloat(value.toFixed(this.FLOAT_DIGITS_COUNT));
        })
      )
      .subscribe(value => this.fromCurrencyAmount.setValue(value, {emitEvent: false}));
  }

  private subscribeToCurrencyCodes(): void {
    this.fromCurrencyCode.valueChanges
      .pipe(
        untilDestroyed(this),
        startWith(this.fromCurrencyCode.value),
        pairwise(),
        filter(([, value]) => value === this.toCurrencyCode.value)
      )
      .subscribe(([value]) => this.toCurrencyCode.setValue(value));

    this.toCurrencyCode.valueChanges
      .pipe(
        untilDestroyed(this),
        startWith(this.toCurrencyCode.value),
        pairwise(),
        filter(([, value]) => value === this.fromCurrencyCode.value)
      )
      .subscribe(([value]) => this.fromCurrencyCode.setValue(value));

    this.fromCurrencyCode.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(code => this.selectCurrency(code));
  }

  private selectCurrency(base: CurrencyCode): void {
    this.currencyRatesService.selectCurrency(base);
  }
}
