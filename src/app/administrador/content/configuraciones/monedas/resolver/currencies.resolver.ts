import { Injectable } from '@angular/core';
import { Currency } from 'src/app/interfaces/interfaces';
import { Alert } from 'src/app/interfaces/interfaces';
import { Observable, catchError, concat, map, mergeMap, of, toArray } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { CoinsService } from '../../service/coins.service';


@Injectable({
  providedIn: 'root'
})
export class CurrenciesResolve implements Resolve<Observable<Currency[] | Alert>>{

  constructor(private router: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    private currenciesSvc: CoinsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Currency[] | Alert> | Observable<Observable<Currency[] | Alert>> | Promise<Observable<Currency[] | Alert>> {
    let type = (route.routeConfig?.path) ? route.routeConfig?.path : ''
    let country_code = route.params['country_code']
    return this.getDataResolver(type, country_code).pipe(
      map(res => res),
      catchError(error => {
        this.router.navigateByUrl('/'+state.url.split('/')[1]+'/error');
        this.comunicatorSvc.errorServer(error);
        return of(null)
      })
    )
  }
  getDataResolver(type: string, country_code: string) {
    const action: { [key: string]: any } = {
      'lista monedas':this.currenciesSvc.getAllCoins(),
      'productos en almacen': this.currenciesSvc.getMainCurrency(),
      'nueva compra': this.getCurrenciesUSed(),
      'nueva venta': this.getCurrenciesUSed(),
      'detalles venta/:id_sell': this.currenciesSvc.getMainCurrency(),
      'kardex general':this.currenciesSvc.getMainCurrency(),
      "detalles kardex/:type/:id_operation/:id_product":this.currenciesSvc.getMainCurrency(),
      'datos de la empresa':this.getCurrenciesBuilding(),
      "actualizar moneda/:country_code":this.currenciesSvc.getCoinByCountry(country_code, 'country_code')
    }
    const handler = action[type]
    return handler
  }
  getCurrenciesBuilding(){
    return concat(this.currenciesSvc.getMainCurrency(),this.currenciesSvc.getsecondariesCoins(),
    this.currenciesSvc.getCoinss()).pipe(toArray())
  }
  getCurrenciesUSed() {
    return this.currenciesSvc.getMainCurrency().pipe(mergeMap((main: any) =>
      this.currenciesSvc.getsecondariesCoins().pipe(map((res:any) => {
        return {mainCurrency:main,currencies:main.concat(res)}
      }))))
  }
}
