import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User,Alert } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiURL = 'http://localhost:3000/users';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todos los usuarios
  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURL);
  }

  //accedo al backend para obtener datos del usuario cuyo id se pasa como parametro
  public getUser(id_User: number): Observable<User[]> {
    return this.http.get<User[]>(this.apiURL + '/' + id_User);
  }
  

  //accedo al backend para crear un nuevo usuario
  public setUser(User: User): Observable<Alert> {
    return this.http.post<Alert>(this.apiURL, User)
  }
  

  //accedo al backend para actualizar datos del usuario cuyo id se pasa como parametro
  public updateUser(id_User: number, User: User): Observable<Alert> {
    return this.http.put<Alert>(this.apiURL + '/' + id_User, User)
  }

  //accedo al backend para actualizar datos del usuario cuyo id se pasa como parametro
  public updateAccount(id_User: number, User: User): Observable<Alert> {
    return this.http.put<Alert>(this.apiURL + 'Account/' + id_User, User)
  }

   //accedo al backend para eliminar el usuario cuyo id se pasa como parametro
  public deleteUser(id_user: number): Observable<Alert> {
    return this.http.delete<Alert>(this.apiURL + '/' + id_user)
  }
  
}
