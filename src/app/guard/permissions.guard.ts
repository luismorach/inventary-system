import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { SessionStorageService } from '../storage/session-storage.service';
import { SignUp } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate {
  constructor(private router: Router, private sessionStorageService:SessionStorageService) { }
canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.validateToken();
}

  validateToken() {
    return !!this.sessionStorageService.getItem<SignUp>('user') || (this.router.navigateByUrl('/login'), false);
  }

}
