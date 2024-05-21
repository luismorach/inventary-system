import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert, Currency} from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CoinsService {

  private apiURL = 'http://localhost:3000/coins';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las cajas
  public getAllCoins(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.apiURL + '/all');
  }
  //accedo al backend para obtener datos de la caja cuyo id se pasa como parametro
  public getCoinByCountry(value: string,param:string): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.apiURL + 'ByCountry/' + value+'/'+param);
  }
  public updateCurrency(currency:Currency, coin: Currency): Observable<Alert> {
    return this.http.put<Alert>(this.apiURL + 'currency/' + currency.language_code+'/'+
    currency.currency_code+'/'+currency.country_code, coin)
  }

  //accedo al backend para obtener datos de todas las cajas
  public getCoinss(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.apiURL);
  }
  public getsecondariesCoins(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.apiURL+'/secondaries');
  }

  
  public getMainCurrency(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.apiURL + 'Main');
  }
  public setCurrency(currency: Currency): Observable<Alert> {
    return this.http.post<Alert>(this.apiURL, currency)
  }
  //accedo al backend para eliminar la caja cuyo id se pasa como parametro
  public deleteCurrency(language_code: string, currency_code: string): Observable<Alert> {
    return this.http.delete<Alert>(this.apiURL + '/' + language_code + '/' + currency_code)
  }

}
