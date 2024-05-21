import { Injectable } from '@angular/core';
import { Repayment } from 'src/app/interfaces/interfaces';
import { Observable, catchError, map, mergeMap, of } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DevolucionesService } from '../service/devoluciones.service';
import { ComprasService } from '../../compras/service/compras.service';
import { VentasService } from '../../ventas/service/ventas.service';

@Injectable({
  providedIn: 'root'
})
export class RepaymentsResolve implements Resolve<Observable<Repayment[] |null>>{

  constructor(private router: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    private repaymentsSvc: DevolucionesService,
    private buySvc: ComprasService, private sellSvc: VentasService) { }

  resolve(route: ActivatedRouteSnapshot,state:RouterStateSnapshot): Observable<Repayment[]> | Observable<Observable<Repayment[]>> | Promise<Observable<Repayment[]>> {
    let type = (route.routeConfig?.path) ? route.routeConfig?.path : ''
    let criterio = route.queryParams['criterio']
    let initialDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    let endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    let initialDateParam = route.queryParams['initialDate']
    let endDateParam = route.queryParams['endDate']
    let id_buy = route.params['id_buy']
    let id_sell = route.params['id_sell']
    let id_operation = route.params['id_operation']
    let id_product = route.params['id_product']

    if (initialDateParam && endDateParam) {
      initialDate = new Date(initialDateParam)
      endDate = new Date(endDateParam)
    }
    return this.getDataResolver(type, criterio, initialDate, endDate, id_buy, id_sell,
      id_operation, id_product).pipe(
        map(res => res),
        catchError(error => {
          this.router.navigateByUrl('/'+state.url.split('/')[1]+'/error');
          this.comunicatorSvc.errorServer(error);
          return of(null)
        })
      )
  }
  getDataResolver(type: string, criterio: string, initialDate: Date, endDate: Date,
    id_buy: number, id_sell: number, id_operation: number, id_product: number) {
    const action: { [key: string]: any } = {
      'devoluciones realizadas': this.getRepayments(criterio, initialDate, endDate),
      "detalles compra/:id_buy": this.repaymentsSvc.getRepaymentsBuy(id_buy),
      "detalles venta/:id_sell": this.repaymentsSvc.getRepaymentsSell(id_sell),
      "detalles kardex/:type/:id_operation/:id_product": this.getKardexDetail(id_operation, id_product)
    }
    const handler = action[type]
    return handler
  }
  getKardexDetail(id_operation: number, id_product: number) {
    return this.repaymentsSvc.getRepayment(id_operation).pipe(
      mergeMap((res) => {
        if (res.length !== 0) {
          return of(res).pipe(
            mergeMap((res: any) => res ),
            mergeMap((res: any) => {
              return ((res.id_buy !== null) ?
                this.buySvc.getProductBuy(res.id_buy, id_product) :
                this.sellSvc.getProductSell(res.id_sell, id_product))
            }))
        } else {
          return [res]
        }

      }))
    
  }

  getRepayments(criterio: string, initialDate: Date, endDate: Date) {
    if (criterio === undefined) {
      return this.repaymentsSvc.getRepaymentsBydate(initialDate, endDate)
    } else {
      if (Number.isNaN(Number(criterio))) {
        let aux = criterio
        return this.repaymentsSvc.getRepaymentByUser(criterio).pipe(mergeMap((res) => {
          return (res instanceof Array && res.length !== 0) ? [res]
            : this.repaymentsSvc.getRepaymentByType(aux)
        }))
      } else {
        return this.repaymentsSvc.getRepaymentsById(Number(criterio))
      }
    }
  }


}
