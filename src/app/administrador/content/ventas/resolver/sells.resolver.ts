import { Injectable } from '@angular/core';
import { Sell } from 'src/app/interfaces/interfaces';
import { Observable, catchError, map, mergeMap, of } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { VentasService } from '../service/ventas.service';

@Injectable({
  providedIn: 'root'
})
export class SellsResolve implements Resolve<Observable<Sell[] | null>> {

  constructor(private router: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    private sellSvc: VentasService) { }

  resolve(route: ActivatedRouteSnapshot,state:RouterStateSnapshot): Observable<Sell[]> | Observable<Observable<Sell[]>> | Promise<Observable<Sell[] >> {
    let type = (route.routeConfig?.path) ? route.routeConfig?.path : ''
    console.log(state.url)

    let criterio = route.queryParams['criterio']
    let initialDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    let endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    let initialDateParam = route.queryParams['initialDate']
    let endDateParam = route.queryParams['endDate']
    let id_sell = route.params['id_sell']
    let id_operation = route.params['id_operation']
    let id_product = route.params['id_product']

    if (initialDateParam && endDateParam) {
      initialDate = new Date(initialDateParam)
      endDate = new Date(endDateParam)
    }
    return this.getDataResolver(type, criterio, initialDate, endDate, id_sell,
      id_operation, id_product).pipe(
        map(res => res),
        catchError(error => {
          if (type !== "ventas realizadas" && type !== "detalles kardex/:type/:id_operation/:id_product") {
            this.router.navigateByUrl('/'+state.url.split('/')[1]+'/error');
            this.comunicatorSvc.errorServer(error);
          }
          return of([])
        })
      )
  }
  getDataResolver(type: string, criterio: string, initialDate: Date, endDate: Date,
    id_sell: number, id_operation: number, id_product: number) {
    const action: { [key: string]: any } = {
      'ventas realizadas': this.getSells(criterio, initialDate, endDate),
      "detalles venta/:id_sell": this.getDetails(id_sell),
      "detalles kardex/:type/:id_operation/:id_product": this.getKardexDetail(id_operation, id_product)
    }
    const handler = action[type]
    return handler
  }
  getKardexDetail(id_operation: number, id_product: number) {
    return this.sellSvc.getProductSell(id_operation, id_product).pipe(mergeMap((productSell) =>
      this.sellSvc.getSell(id_operation).pipe(map((sell) => { return { productSell, sell } }))
    ))

  }
  getDetails(id_sell: number) {
    return this.sellSvc.getSell(id_sell).pipe(mergeMap((res) => res),
      mergeMap((sell) => this.sellSvc.getProductsSell(sell.id_sell).pipe(
        map((productsSell) => productsSell),
        mergeMap((productsSell) => this.sellSvc.getPaysSell(id_sell).pipe(
          map((pays) => { return { sell, pays, productsSell } })
        ))
      )))
  }
  getSells(criterio: string, initialDate: Date, endDate: Date) {
    if (criterio === undefined) {
      return this.sellSvc.getSellsBydate(initialDate, endDate)
    } else {
      if (Number.isNaN(Number(criterio))) {
        let aux = criterio
        return this.sellSvc.getSellByUser(criterio).pipe(mergeMap((res) => {
          return (res instanceof Array && res.length !== 0) ? [res]
            : this.sellSvc.getSellByClient(aux)
        }))
      } else {
        return this.sellSvc.getSell(Number(criterio))
      }
    }
  }
}
