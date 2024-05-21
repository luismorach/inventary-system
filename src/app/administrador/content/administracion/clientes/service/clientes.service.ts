import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client,Alert } from 'src/app/interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiURL = 'http://localhost:3000/clients';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todos los clientes
  public getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiURL);
  }
  public getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiURL+'All');
  }

  //accedo al backend para obtener datos de el cliente cuyo id se pasa como parametro
  public getClient(id_client: number): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiURL + '/' + id_client);
  }

  //accedo al backend para crear un nuevo cliente
  public setClient(client: Client): Observable<Alert> {
    return this.http.post<Alert>(this.apiURL, client)
  }

  //accedo al backend para actualizar datos de el cliente cuyo id se pasa como parametro
  public updateClient(id_client: number, client: Client): Observable<Alert> {
    return this.http.put<Alert>(this.apiURL + '/' + id_client, client)
  }

   //accedo al backend para eliminar el cliente cuyo id se pasa como parametro
  public deleteClient(id_client: number): Observable<Alert> {
    return this.http.delete<Alert>(this.apiURL + '/' + id_client)
  }
}
