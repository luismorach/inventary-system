import { Injectable } from '@angular/core';
import { Building } from 'src/app/interfaces/interfaces';
import { Alert } from 'src/app/interfaces/interfaces';
import { Observable, catchError, map, mergeMap, of } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { EmpresaService } from '../../service/empresa.service';


@Injectable({
  providedIn: 'root'
})
export class BuildingResolve implements Resolve<Observable<Building[] | Alert>>{

  constructor(private router: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    private buildingSvc: EmpresaService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Building[] | Alert> | Observable<Observable<Building[] | Alert>> | Promise<Observable<Building[] | Alert>> {
    let type = (route.routeConfig?.path) ? route.routeConfig?.path : ''
    let currency_code = route.queryParams['currency_code']
    return this.getDataResolver(type, currency_code).pipe(
      map(res => res),
      catchError(error => {
        this.router.navigateByUrl('/administrador/error');
        this.comunicatorSvc.errorServer(error);
        return of(null)
      })
    )
  }
  getDataResolver(type: string, currency_code: number) {
    const action: { [key: string]: any } = {
      'nueva compra': this.buildingSvc.getBuildings(),
      'datos de la empresa': this.buildingSvc.getBuildings(),
    }
    const handler = action[type]
    return handler
  }
 
}
