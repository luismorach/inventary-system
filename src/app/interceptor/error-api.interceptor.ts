import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { EMPTY, Observable, catchError, concatMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { URLS } from '../utils/api-url';
import { RefreshTokenManagerService } from '../services/refresh-token-manager.service/refresh-token-manager.service';
import { AuthService } from '../auth/service/auth.service';

@Injectable()
export class ErrorApiInterceptor implements HttpInterceptor {

  constructor(private router:Router,
    private refreshTokenManagerService:RefreshTokenManagerService,
    private authService:AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('****ERROR API INTERCEPTOR****')
    console.log(request.url)
    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse)=>{
        console.log(error.status)

        if(error.status===HttpStatusCode.Unauthorized){
          
          return this.authService.refreshToken().pipe(
            concatMap((response)=>{
             
              this.refreshTokenManagerService.updateTokens(response.token,response.refreshToken)
              const requestClone = this.refreshTokenManagerService.addTokenHeader(request)
              if(!requestClone){
                sessionStorage.clear()
                this.router.navigateByUrl('/')
                return EMPTY;
              }
              return next.handle(requestClone) 
            }),catchError((error)=>{
              this.router.navigateByUrl('/')
              return EMPTY;
            })
          )
        }
        return throwError(()=>error)
      })
    )
  }
}
