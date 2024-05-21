import { Injectable } from '@angular/core';
import { Register } from 'src/app/interfaces/interfaces';
import { Alert } from 'src/app/interfaces/interfaces';
import { Observable, catchError, map, of} from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { CajasService } from '../service/cajas.service';

@Injectable({
  providedIn: 'root'
})
export class RegistersResolve implements Resolve<Observable<Register[] | Alert> >{

  constructor(private router: Router, 
    private comunicatorSvc: ComunicatorComponetsService,
    private registerSvc:CajasService) { }
  
  resolve(route: ActivatedRouteSnapshot): Observable<Register[] | Alert> | Observable<Observable<Register[] | Alert>> | Promise<Observable<Register[] | Alert>> {
    let type = (route.routeConfig?.path) ? route.routeConfig?.path: ''
    let id_register = route.params['id_register']

    return this.getDataResolver(type, id_register).pipe(
      map(res => res),
      catchError(error => {
        console.log(error)
        this.router.navigateByUrl('/administrador/error');
        this.comunicatorSvc.errorServer(error); 
        return of(null)
      })
    )
  }
  getDataResolver(type: string, id_register: number) {
    const action: { [key: string]: any } = {
      'actualizar caja/:id_register': this.registerSvc.getRegister(id_register),
      'lista cajas': this.registerSvc.getRegisters()
    }
    const handler = action[type]
    return handler
  }
}
