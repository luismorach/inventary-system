import { Injectable } from '@angular/core';
import { Kardex } from 'src/app/interfaces/interfaces';
import { Observable, catchError, map, mergeMap, of } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { KardexService } from '../service/kardex.service';
import { CoinsService } from '../../configuraciones/service/coins.service';

@Injectable({
  providedIn: 'root'
})
export class KardexResolve implements Resolve<Observable<Kardex[] |null>>{

  constructor(private router: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    private kardexSvc: KardexService,
    private currenciesSvc:CoinsService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Kardex[]> | Observable<Observable<Kardex[]>> | Promise<Observable<Kardex[] >> {
    let type = (route.routeConfig?.path) ? route.routeConfig?.path : ''
    let barcode = route.queryParams['barcode']
    let initialDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    let endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    let initialDateParam = route.queryParams['initialDate']
    let endDateParam = route.queryParams['endDate']
    let id_operation=route.params['id_operation']
    let id_product=route.params['id_product']
    let type_operation=route.params['type']
    if (initialDateParam && endDateParam) {
      initialDate = new Date(initialDateParam)
      endDate = new Date(endDateParam)
    }
    return this.getDataResolver(type, barcode, initialDate, endDate,
      id_operation,id_product,type_operation).pipe(
      map(res => res),
      catchError(error => {
        this.router.navigateByUrl('/administrador/error');
        this.comunicatorSvc.errorServer(error);
        return of(null)
      })
    )
  }
  getDataResolver(type: string, barcode: string, initialDate: Date, endDate: Date,
    id_operation:number,id_product:number,type_operation:string) {
    const action: { [key: string]: any } = {
      "kardex general": this.getKardex(barcode, initialDate, endDate),
      "detalles kardex/:type/:id_operation/:id_product":this.getDetailKardex(id_operation,
        id_product,type_operation)
    }
    const handler = action[type]
    return handler
  }

  getDetailKardex(id_operation:number,id_product:number,type_operation:string){
    return this.kardexSvc.getKardexById(type_operation,id_operation, id_product).pipe(
      mergeMap((res: any) => res),
        mergeMap((kardex: any) => this.currenciesSvc.getCoinByCountry(
          kardex.currency_code, 'currency_code').pipe(
            map((currency)=>{return {kardex,currency}})
          )))
     
  }

  getKardex(barcode: string, initialDate: Date, endDate: Date) {
    if (barcode) {
      return  this.kardexSvc.getKardexByProduct(barcode)
     
    } else {
      return this.kardexSvc.getKardexByDate(initialDate, endDate)
    }
  }
}
