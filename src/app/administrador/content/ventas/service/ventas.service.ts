import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert, SellProduct, Sell, Payment } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private apiURL = 'http://localhost:3000/sells';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las cajas
  public getSells(): Observable<Sell[]> {
    return this.http.get<Sell[]>(this.apiURL);
  }
  public getSellsBydate(initialDate:Date,endDate:Date): Observable<Sell[]> {
    return this.http.get<Sell[]>(this.apiURL+'/'+initialDate.toISOString()
    +'/'+endDate.toISOString());
  }
  public getSellBydate(initialDate:Date,endDate:Date): Observable<Sell[]> {
    return this.http.get<Sell[]>(this.apiURL+'ByDate/'+initialDate.toISOString()
    +'/'+endDate.toISOString());
  }
  //accedo al backend para obtener datos de la caja cuyo id se pasa como parametro
  public getSell(id_Sell: number): Observable<Sell[]> {
    return this.http.get<Sell[]>(this.apiURL + '/' + id_Sell);
  }
  public getSellByUser(names:string): Observable<Sell[]> {
    return this.http.get<Sell[]>(this.apiURL + 'byUser/' +names);
  }
  public getSellByClient(names:string): Observable<Sell[]> {
    return this.http.get<Sell[]>(this.apiURL + 'byClient/' +names);
  }
  
  public getProductsSell(id_Sell: number): Observable<SellProduct[]> {
    return this.http.get<SellProduct[]>(this.apiURL + 'Products/' + id_Sell);
  }
  public getProductSell(id_Sell: number,id_product:number): Observable<SellProduct[]> {
    return this.http.get<SellProduct[]>(this.apiURL + 'Product/' + id_Sell+'/'+id_product);
  }
  public getPaysSell(id_Sell: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiURL + 'Pays/' + id_Sell);
  }
  public getPaysByDate(initialDate:Date,endDate:Date): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiURL + 'PaysByDate/' + 
    new Intl.DateTimeFormat('es-CL').format(initialDate)
    +'/'+new Intl.DateTimeFormat('es-CL').format(endDate));
  }

  //accedo al backend para crear una nueva caja
  public setSell(Sell: Sell): Observable<Alert> {
    return this.http.post<Alert>(this.apiURL, Sell)
  }

  //accedo al backend para crear una nueva caja
  public setPay(sell: Sell,pay:Payment): Observable<Alert> {
    return this.http.post<Alert>(this.apiURL+ 'Pays',{sell,pay})
  }

  //accedo al backend para actualizar datos de la caja cuyo id se pasa como parametro
  public updateSell(id_Sell: number, Sell: Sell): Observable<Alert> {
    return this.http.put<Alert>(this.apiURL + '/' + id_Sell, Sell)
  }
  public updateProductsSell(id_Sell: number,id_product:number, Sell_product: SellProduct): Observable<Alert> {
    return this.http.put<Alert>(this.apiURL + 'Products/' + id_Sell+'/'+id_product, Sell_product)
  }

   //accedo al backend para eliminar la caja cuyo id se pasa como parametro
  public deleteSell(id_Sell: number): Observable<Alert> {
    return this.http.delete<Alert>(this.apiURL + '/' + id_Sell)
  }
}
