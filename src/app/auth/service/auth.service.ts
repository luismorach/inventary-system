import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Alert, SignUp, User } from 'src/app/interfaces/interfaces';
import { Observable } from 'rxjs';
import { SessionStorageService } from 'src/app/storage/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = 'http://localhost:3000/';

  constructor(private http: HttpClient,private sessionStorageService:SessionStorageService) { }

  public auth(User: User): Observable<any> {
    return this.http.post<any>(this.apiURL + 'login', User)
  }
  public forgotPassword(user: User) {
    return this.http.post<Alert>(this.apiURL + 'forgot-password', user)
  }
  public changePassword(token: string, newPassword: string) {
    let header = new HttpHeaders({
      Authorization: `bearer ${token}` 
    })
    return this.http.put<Alert>(this.apiURL + 'change-password', { newPassword }, { 'headers': header })
  }
  public refreshToken(){
    const id_user=this.sessionStorageService.getItem<SignUp>('user')?.id_user
    return this.http.put<SignUp>(this.apiURL + 'refresh-token',{id_user})
  }

}