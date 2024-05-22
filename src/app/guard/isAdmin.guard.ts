import { Injectable } from '@angular/core';
import { CanActivate, Router,UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ComunicatorComponetsService } from '../services/comunicator/comunicator-componets.service';
import { SessionStorageService } from '../storage/session-storage.service';
import { SignUp } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {
  constructor(private router: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    private sessionStorageService:SessionStorageService) { }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkIsAdmin()
  }
  checkIsAdmin(): boolean {
    const range_user = this.sessionStorageService.getItem<SignUp>('user')?.range_user||''
    if (range_user === 'Administrador') {
      return true;
    } else {
      this.comunicatorSvc.setNotFound('No tiene permisos para acceder a las opciones de administrador');
      this.router.navigateByUrl('/Error');
      return false;
    }
  }
}

