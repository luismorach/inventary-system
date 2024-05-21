import { Injectable } from '@angular/core';
import { User } from 'src/app/interfaces/interfaces';
import { Alert } from 'src/app/interfaces/interfaces';
import { Observable, catchError, map, of} from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { UsuariosService } from '../service/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class UsersResolve implements Resolve<Observable<User[] | Alert> >{

  constructor(private router: Router, 
    private comunicatorSvc: ComunicatorComponetsService,
    private UsersSvc:UsuariosService) { }
  
  resolve(route: ActivatedRouteSnapshot): Observable<User[] | Alert> | Observable<Observable<User[] | Alert>> | Promise<Observable<User[] | Alert>> {
    let type = (route.routeConfig?.path) ? route.routeConfig?.path : ''
    let id_user = route.params['id_user']

    return this.getDataResolver(type, id_user).pipe(
      map(res => res),
      catchError(error => {
        this.router.navigateByUrl('/administrador/error');
        this.comunicatorSvc.errorServer(error); 
        return of(null)
      })
    )
  }
  getDataResolver(type: string, id_user: number) {
    const action: { [key: string]: any } = {
      'actualizar usuario/:id_user': this.UsersSvc.getUser(id_user),
      'actualizar cuenta/:id_user': this.UsersSvc.getUser(id_user),
      'recover password/:id_user': this.UsersSvc.getUser(id_user),
      'lista usuarios': this.UsersSvc.getUsers()
    }
    const handler = action[type]
    return handler
  }
}
