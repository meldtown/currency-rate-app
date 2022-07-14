import {first, map, mapTo, Observable, startWith, tap} from 'rxjs';

import {Component} from '@angular/core';

import {CurrencyRatesService} from '@core/services';
import {CurrencyCode, CurrencyRates} from '@core/models';
import {getCurrencyRateOption} from '@core/helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  initialCurrencyRate$: Observable<CurrencyRates> = this.currencyRatesService.selectedCurrencyRates$.pipe(first());
  convertToCurrencies = CurrencyRatesService.convertToMainCurrencies;
  defaultCurrencyLabel = getCurrencyRateOption(CurrencyRatesService.DEFAULT_CURRENCY).label;

  constructor(private currencyRatesService: CurrencyRatesService) {
  }
}
