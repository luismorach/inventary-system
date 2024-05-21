import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { URLS } from '../utils/api-url';
import { RefreshTokenManagerService } from '../services/refresh-token-manager.service/refresh-token-manager.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private router:Router,private refreshTokenManagerService:RefreshTokenManagerService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('****API INTERCEPTOR****')
    console.log(request.url)

    if(URLS.includes(request.url)){
      return next.handle(request)
    }

    if(this.refreshTokenManagerService.isRefreshing){
      return EMPTY;
    }

    const requestClone = this.refreshTokenManagerService.addTokenHeader(request)

    if(!requestClone){
      sessionStorage.clear()
      this.router.navigateByUrl('/')
      return EMPTY;
    }
    
    return next.handle(requestClone);
  }
}
