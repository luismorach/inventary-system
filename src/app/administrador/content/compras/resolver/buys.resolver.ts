import { Injectable } from '@angular/core';
import { Buy } from 'src/app/interfaces/interfaces';
import { Alert } from 'src/app/interfaces/interfaces';
import { Observable, catchError, map, mergeMap, of } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { ComprasService } from '../service/compras.service';

@Injectable({
  providedIn: 'root'
})
export class BuysResolve implements Resolve<Observable<Buy[] | Alert>>{

  constructor(private router: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    private buysSvc: ComprasService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Buy[] | Alert> | Observable<Observable<Buy[] | Alert>> | Promise<Observable<Buy[] | Alert>> {
    let type = (route.routeConfig?.path) ? route.routeConfig?.path : ''
    let criterio = route.queryParams['criterio']
    let initialDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    let endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    let initialDateParam = route.queryParams['initialDate']
    let endDateParam = route.queryParams['endDate']
    let id_buy = route.params['id_buy']
    let id_product = route.params['id_product']
    let id_operation=route.params['id_operation']
    console.log(id_buy)

    if (initialDateParam && endDateParam) {
      initialDate = new Date(initialDateParam)
      endDate = new Date(endDateParam)
    }
    return this.getDataResolver(type, criterio, initialDate, endDate, id_buy,
      id_product,id_operation).pipe(
      map(res => res),
      catchError(error => {
        if (type !== 'compras realizadas') {
          this.router.navigateByUrl('/administrador/error');
          this.comunicatorSvc.errorServer(error);
        }
        return of(null)
      })
    )
  }
  getDataResolver(type: string, criterio: string, initialDate: Date, endDate: Date, 
    id_buy: number,id_product:number,id_operation:number) {
    const action: { [key: string]: any } = {
      'compras realizadas': this.getbuys(criterio, initialDate, endDate),
      "detalles compra/:id_buy": this.getDetails(id_buy),
      "detalles kardex/:type/:id_operation/:id_product":this.buysSvc.getProductBuy(id_operation,id_product)
    }
    const handler = action[type]
    return handler
  }
  getDetails(id_buy: number) {
    return this.buysSvc.getBuy(id_buy).pipe(mergeMap((res) => res),
      mergeMap((buy) => this.buysSvc.getProductsBuy(buy.id_buy).pipe(
        map((productsBuy) => { return { buy, productsBuy } })
      )))
  }
  getbuys(criterio: string, initialDate: Date, endDate: Date) {
    if (criterio === undefined) {
      return this.buysSvc.getBuysBydate(initialDate, endDate)
    } else {
      if (Number.isNaN(Number(criterio))) {
        let aux = criterio
        return this.buysSvc.getBuyByUser(criterio).pipe(mergeMap((res) => {
          return (res instanceof Array && res.length !== 0) ? [res]
            : this.buysSvc.getBuyByProvider(aux)
        }))
      } else {
        return this.buysSvc.getBuy(Number(criterio))
      }
    }
  }
}
