import { Injectable } from '@angular/core';
import { Provider } from 'src/app/interfaces/interfaces';
import { Alert } from 'src/app/interfaces/interfaces';
import { Observable, catchError, map, of} from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';

import { ProveedoresService } from '../service/proveedores.service';

@Injectable({
  providedIn: 'root'
})
export class ProvidersResolve implements Resolve<Observable<Provider[] | Alert> >{

  constructor(private router: Router, 
    private comunicatorSvc: ComunicatorComponetsService,
    private providersSvc:ProveedoresService) { }
  
  resolve(route: ActivatedRouteSnapshot): Observable<Provider[] | Alert> | Observable<Observable<Provider[] | Alert>> | Promise<Observable<Provider[] | Alert>> {
    let type = (route.routeConfig?.path) ? route.routeConfig?.path : ''
    let id_provider = route.params['id_provider']

    return this.getDataResolver(type, id_provider).pipe(
      map(res => res),
      catchError(error => {
        this.router.navigateByUrl('/administrador/error');
        this.comunicatorSvc.errorServer(error); 
        return of(null)
      })
    )
  }
  getDataResolver(type: string, id_provider: number) {
    const action: { [key: string]: any } = {
      'actualizar proveedor/:id_provider': this.providersSvc.getProvider(id_provider),
      'lista proveedores': this.providersSvc.getProviders(),
      'nueva compra':this.providersSvc.getProviders()
    }
    const handler = action[type]
    return handler
  }
}
