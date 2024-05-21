import { Injectable } from '@angular/core';
import { Alert, Tax } from 'src/app/interfaces/interfaces';
import { Observable, catchError,map, of} from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { ImpuestosService } from '../../service/impuestos.service';


@Injectable({
  providedIn: 'root'
})
export class TaxesResolve implements Resolve<Observable<Tax[] |Alert >>{

  constructor(private router: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    private taxesSvc:ImpuestosService ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Tax[] | Alert > | Observable<Observable<Tax[] | Alert >> | Promise<Observable<Tax[] | Alert>> {
    let type = (route.routeConfig?.path) ? route.routeConfig?.path : ''
    let tax_id = route.params['tax_id']
    return this.getDataResolver(type, tax_id).pipe(
      map(res => res),
      catchError(error => {
        this.router.navigateByUrl('/administrador/error');
        this.comunicatorSvc.errorServer(error);
        return of(null)
      })
    )
  }
  getDataResolver(type: string, tax_id: number) {
    const action: { [key: string]: any } = {
      "actualizar impuesto/:tax_id":this.taxesSvc.getTaxById(tax_id),
      "lista impuestos":this.taxesSvc.getTaxes()
    }
    const handler = action[type]
    return handler
  }
  
}
