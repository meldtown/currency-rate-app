import {catchError, map, Observable, of} from 'rxjs';

import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {environment} from '@environments/environment';
import {CurrencyRatesData, CurrencyRatesParams, CurrencyRatesResponse} from '@core/models';
import {emptyCurrencyRatesData} from '@core/data';

@Injectable()
export class CurrencyRatesApiService {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {
  }

  fetchRates(currencyRatesParams: CurrencyRatesParams): Observable<CurrencyRatesData> {
    const serializedParams = this.serializeParams(currencyRatesParams);
    const params = new HttpParams({fromObject: serializedParams});

    return this.http.get<CurrencyRatesResponse>(`${this.baseUrl}/latest`, {params})
      .pipe(
        map(({base, rates}) => ({base, rates})),
        catchError(() => of(emptyCurrencyRatesData))
      );
  }

  private serializeParams(params: CurrencyRatesParams): { [param: string]: string } {
    return {...params, symbols: params.symbols.toString()};
  }
}
