import { Injectable } from '@angular/core';
import { Register } from 'src/app/interfaces/interfaces';
import { Alert } from 'src/app/interfaces/interfaces';
import { Observable} from 'rxjs';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CajasService{

  private apiURL = 'http://localhost:3000/registers';

  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las cajas
  public getRegisters(): Observable<Register[]> {
    return this.http.get<Register[]>(this.apiURL);
  }

  //accedo al backend para obtener datos de la caja cuyo id se pasa como parametro
  public getRegister(id_register: number): Observable<Register[]> {
    return this.http.get<Register[]>(this.apiURL + '/' + id_register);
  }

  //accedo al backend para crear una nueva caja
  public setRegister(register: Register): Observable<Alert> {
    return this.http.post<Alert>(this.apiURL, register)
  }

  //accedo al backend para actualizar datos de la caja cuyo id se pasa como parametro
  public updateRegister(id_register: number, register: Register): Observable<Alert> {
    return this.http.put<Alert>(this.apiURL + '/' + id_register, register)
  }

  //accedo al backend para eliminar la caja cuyo id se pasa como parametro
  public deleteRegister(id_register: number): Observable<Alert> {
    return this.http.delete<Alert>(this.apiURL + '/' + id_register)
  }
}
