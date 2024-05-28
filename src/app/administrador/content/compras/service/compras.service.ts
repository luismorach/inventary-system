import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Buy,Alert, BuyProduct } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {


  private apiURL = 'http://localhost:3000/buys';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las cajas
  public getBuys(): Observable<Buy[]> {
    return this.http.get<Buy[]>(this.apiURL);
  }
  public getBuysBydate(initialDate:Date,endDate:Date): Observable<Buy[]> {
    return this.http.get<Buy[]>(this.apiURL+'/'+initialDate.toISOString() +'/'+endDate.toISOString());
  }
  //accedo al backend para obtener datos de la caja cuyo id se pasa como parametro
  public getBuy(id_buy: number): Observable<Buy[]> {
    return this.http.get<Buy[]>(this.apiURL + '/' + id_buy);
  }
  public getBuyByUser(names:string): Observable<Buy[]> {
    return this.http.get<Buy[]>(this.apiURL + 'byUser/' +names);
  }
  public getBuyByProvider(name:string): Observable<Buy[]> {
    return this.http.get<Buy[]>(this.apiURL + 'byProvider/' +name);
  }
  public getProductsBuy(id_buy: number): Observable<BuyProduct[]> {
    return this.http.get<BuyProduct[]>(this.apiURL + 'Products/' + id_buy);
  }
  public getProductBuy(id_buy: number,id_product:number): Observable<BuyProduct[]> {
    return this.http.get<BuyProduct[]>(this.apiURL + 'Product/' + id_buy+'/'+id_product);
  }

  //accedo al backend para crear una nueva caja
  public setBuy(buy: Buy): Observable<Alert> {
    return this.http.post<Alert>(this.apiURL, buy)
  }

  //accedo al backend para actualizar datos de la caja cuyo id se pasa como parametro
  public updateBuy(id_buy: number, buy: Buy): Observable<Alert> {
    return this.http.put<Alert>(this.apiURL + '/' + id_buy, buy)
  }
  public updateProductsBuy(id_buy: number,id_product:number, buy_product: BuyProduct): Observable<Alert> {
    return this.http.put<Alert>(this.apiURL + 'Products/' + id_buy+'/'+id_product, buy_product)
  }

   //accedo al backend para eliminar la caja cuyo id se pasa como parametro
  public deleteBuy(id_buy: number): Observable<Alert> {
    return this.http.delete<Alert>(this.apiURL + '/' + id_buy)
  }
}
