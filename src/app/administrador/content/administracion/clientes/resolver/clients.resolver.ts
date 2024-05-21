import { Injectable } from '@angular/core';
import { Client } from 'src/app/interfaces/interfaces';
import { Alert } from 'src/app/interfaces/interfaces';
import { Observable, catchError, map, of } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { ClientesService } from '../service/clientes.service';

@Injectable({
  providedIn: 'root'
})
export class ClientsResolve implements Resolve<Observable<Client[] | Alert>>{

  constructor(private router: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    private clientsSvc: ClientesService) { }

  resolve(route: ActivatedRouteSnapshot,state:RouterStateSnapshot): Observable<Client[] | Alert> | Observable<Observable<Client[] | Alert>> | Promise<Observable<Client[] | Alert>> {
    let type = (route.routeConfig?.path) ? route.routeConfig?.path : ''
    let id_client = route.params['id_client']

    return this.getDataResolver(type, id_client).pipe(
      map(res => res),
      catchError(error => {
        this.router.navigateByUrl('/'+state.url.split('/')[1]+'/error');
        this.comunicatorSvc.errorServer(error);
        return of(null)
      })
    )
  }
  getDataResolver(type: string, id_client: number) {
    const action: { [key: string]: any } = {
      'actualizar cliente/:id_client': this.clientsSvc.getClient(id_client),
      'lista clientes': this.clientsSvc.getClients(),
      'nueva venta':this.clientsSvc.getAllClients(),
    }
    const handler = action[type]
    return handler
  }
}
