import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Alert, AlertListProducts, AlertPay, Currency, ResponseAlert} from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ComunicatorComponetsService {
  private listData$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private state$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private showAlert$: Subject<Alert> = new Subject<Alert>
  private showAlertPay$: Subject<AlertPay> = new Subject<AlertPay>();
  private showAlertListProducts$: Subject<AlertListProducts> = new Subject<AlertListProducts>();
  private notFound$: BehaviorSubject<string> = new BehaviorSubject<string>(
    'Error: page not found');
  private responseAlert$: Subject<ResponseAlert> = new Subject<ResponseAlert>;
  private titleComponent$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);


  constructor() {

  }
  x: number = 0
  public setshowHideNavBar(state: boolean) {
    this.state$.next(state);
  }

  public getShowHideNavBar(): Observable<boolean> {
    return this.state$.asObservable();
  }
  public setNotFound(text: string) {
    this.notFound$.next(text)
  }
  public getNotFound(): Observable<string> {
    return this.notFound$.asObservable();
  }
  public setInfoAlert(info: Alert) {
    this.showAlert$.next(info);
  }

  public getInfoAlert(): Observable<Alert> {
    return this.showAlert$.asObservable();
  }
  public setInfoAlertPay(info: AlertPay) {
    this.showAlertPay$.next(info);
  }

  public getInfoAlertPay(): Observable<AlertPay> {
    return this.showAlertPay$.asObservable();
  }

  public setInfoAlertListProducts(info: AlertListProducts) {
    this.showAlertListProducts$.next(info);
  }

  public getInfoAlertListProducts(): Observable<AlertListProducts> {
    return this.showAlertListProducts$.asObservable();
  }

  public setResponseAlert(response: ResponseAlert) {
    this.responseAlert$.next(response);
  }

  public getResponseAlert(): Observable<ResponseAlert> {
    return this.responseAlert$.asObservable();
  }


  public setTitleComponent(title: any) {
    this.titleComponent$.next(title);
  }
  public getTitleComponent(): Observable<string[]> {
    return this.titleComponent$.asObservable();
  }

  public setData(data: any) {
    this.listData$.next(data)
  }
  public getData() {
    return this.listData$.asObservable();
  }

  public errorServer(error: HttpErrorResponse) {
    console.log(error)
    switch (error.status) {
      case 0:
        this.setNotFound(error.message );
        break;
      case 401:
      case 403:
      case 500:
        this.setNotFound(error.error );
        break;
      default:
        // Handle other cases if needed
        break;
    }
  }
  converterToMainCoin(value: number, exchange: number) {
    return Number((value * exchange).toFixed(2))
  }
  converterToSecondaryCoin(value: number, exchange: number) {
    return Number((value / exchange).toFixed(2))
  }
  converter(value: number, mainCurrency: Currency, currencySelected: Currency) {
    if (!currencySelected) {
      return 0;
    }

    const exchangeRate = currencySelected.currency_code === mainCurrency.currency_code ? currencySelected.exchange : 1 / currencySelected.exchange;
    return Number((value * exchangeRate).toFixed(2));
  }

  currencyFormatter(value: number, currency: Currency) {
    const formatter = new Intl.NumberFormat(currency.language_code + '-' + currency.country_code, {
      style: 'currency',
      minimumFractionDigits: 2,
      currency: currency.currency_code,
    })
    return formatter.format(value)
  }


  getAtributes(currency?: Currency) {
    const formatter = new Intl.NumberFormat(currency?.language_code + '-' +
      currency?.country_code, {
      style: 'currency',
      minimumFractionDigits: 2,
      currency: currency?.currency_code,
    })
    const parts = formatter.formatToParts(10000);
    let options: any = { prefix: '', suffix: '', align: 'left' };

    parts.forEach((res, i) => {
      switch (res.type) {
        case 'currency':
          if (i === 0) {
            options.prefix = res.value;
          } else if (i === 6) {
            options.suffix += res.value;
          }
          break;
        case 'literal':
          if (options.prefix !== '') {
            options.prefix += res.value;
          } else {
            options.suffix = res.value;
          }
          break;
        case 'decimal':
          options.decimal = res.value;
          break;
        case 'group':
          options.thousands = res.value;
          break;
      }
    });

    return options;
  }
}
