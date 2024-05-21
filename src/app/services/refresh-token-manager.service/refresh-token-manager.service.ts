import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Alert, AlertListProducts, AlertPay, Currency, ResponseAlert, SignUp} from 'src/app/interfaces/interfaces';
import { SessionStorageService } from 'src/app/storage/session-storage.service';
import { URL_AUTH_REFRESH } from 'src/app/utils/api-url';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenManagerService {

  private _isRefreshing = false;
  public get isRefreshing() {
    return this._isRefreshing;
  }
  public set isRefreshing(value) {
    this._isRefreshing = value;
  }

  constructor(private sessionStorageService:SessionStorageService) {}

  addTokenHeader(request: HttpRequest<unknown>){
    const user=this.sessionStorageService.getItem<SignUp>('user')
    
    if (!user) {
      return undefined
    }

    const tokenToUse= (request.url===URL_AUTH_REFRESH)?user.refreshToken:user.token
    return request.clone({setHeaders: { Authorization: `bearer ${tokenToUse}` }})
  }

  updateTokens(accessToken:string,refreshToken:string){
    const user=this.sessionStorageService.getItem<SignUp>('user')
    if(user!==null){
      user.token=accessToken
      user.refreshToken=refreshToken
      this.sessionStorageService.setItem('user',user)
    }
    
  }
  
}
