import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alert, Tax } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ImpuestosService {

  private apiURL = 'http://localhost:3000/taxes';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las cajas
  public getTaxes(): Observable<Tax[]> {
    return this.http.get<Tax[]>(this.apiURL );
  }
  //accedo al backend para obtener datos de la caja cuyo id se pasa como parametro
  public getTaxById(tax_id:number): Observable<Tax[] > {
    return this.http.get<Tax[] >(this.apiURL + '/'+tax_id);
  }

  //accedo al backend para crear una nueva caja
  public setTax(tax: Tax): Observable<Alert> {
    return this.http.post<Alert>(this.apiURL, tax)
  }

  //accedo al backend para actualizar datos de la caja cuyo id se pasa como parametro
  public updateTax(tax_id: number, tax: Tax): Observable<Alert> {
    return this.http.put<Alert>(this.apiURL + '/' + tax_id, tax)
  }

  //accedo al backend para eliminar la caja cuyo id se pasa como parametro
  public deleteTax(tax_id:number): Observable<Alert> {
    return this.http.delete<Alert>(this.apiURL + '/' + tax_id)
  }

}
