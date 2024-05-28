import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Kardex } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class KardexService {
  private apiURL = 'http://localhost:3000/kardex';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las cajas
  public getKardex(): Observable<Kardex[]> {
    return this.http.get<Kardex[]>(this.apiURL);
  }
  public getKardexById(type:string,id_operation:number,id_product:number): Observable<Kardex[]> {
    return this.http.get<Kardex[]>(this.apiURL+'/'+type+'/'+id_operation+'/'+id_product);
  }
  public getKardexByDate(initialDate:Date,endDate:Date): Observable<Kardex[]> {
    return this.http.get<Kardex[]>(this.apiURL+'ByDate/'+
    initialDate.toISOString()+'/'+
    endDate.toISOString());
  }
  public getKardexByProduct(barcode:string): Observable<Kardex[]> {
    return this.http.get<Kardex[]>(this.apiURL+'ByProduct/'+barcode);
  }
}
