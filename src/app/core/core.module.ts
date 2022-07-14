import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {CurrencyRatesComponent} from './components';
import {CurrencyRatesApiService, CurrencyRatesService} from './services';
import {SharedModule} from '@shared/shared.module';

@NgModule({
  declarations: [CurrencyRatesComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  exports: [CurrencyRatesComponent],
  providers: [CurrencyRatesService, CurrencyRatesApiService]
})
export class CoreModule {
}
