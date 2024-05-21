import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provider,Alert } from 'src/app/interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  
  private apiURL = 'http://localhost:3000/providers';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todos los proveedores
  public getProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(this.apiURL);
  }

  //accedo al backend para obtener datos de el proveedor cuyo id se pasa como parametro
  public getProvider(id_provider: number): Observable<Provider[]> {
    return this.http.get<Provider[]>(this.apiURL + '/' + id_provider);
  }

  //accedo al backend para crear un nuevo proveedor
  public setProvider(provider: Provider): Observable<Alert> {
    return this.http.post<Alert>(this.apiURL, provider)
  }

  //accedo al backend para actualizar los datos del proveedor cuyo id se pasa como parametro
  public updateProvider(id_provider: number, provider: Provider): Observable<Alert> {
    return this.http.put<Alert>(this.apiURL + '/' + id_provider, provider)
  }

   //accedo al backend para eliminar el proveedor cuyo id se pasa como parametro
  public deleteProvider(id_provider: number): Observable<Alert> {
    return this.http.delete<Alert>(this.apiURL + '/' + id_provider)
  }
  
}
