import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { alert, all_coins, coin } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CoinsService {

  private apiURL = 'http://localhost:3000/coins';
  constructor(private http: HttpClient) { }

   //accedo al backend para obtener datos de todas las cajas
   public getAllCoins(): Observable<all_coins[]> {
    return this.http.get<all_coins[]>(this.apiURL+'/all');
  }
  //accedo al backend para obtener datos de todas las cajas
  public getCoins(): Observable<coin[]> {
    return this.http.get<coin[]>(this.apiURL);
  }

  //accedo al backend para obtener datos de la caja cuyo id se pasa como parametro
  public getCoin(id_coin: number): Observable<coin[]|alert> {
    return this.http.get<coin[]|alert>(this.apiURL + '/' + id_coin);
  }
  public getMainCoin(): Observable<coin[]|alert> {
    return this.http.get<coin[]|alert>(this.apiURL+'Main');
  }

  //accedo al backend para crear una nueva caja
  public setCoin(coin: coin): Observable<alert> {
    return this.http.post<alert>(this.apiURL, coin)
  }

  //accedo al backend para actualizar datos de la caja cuyo id se pasa como parametro
  public updateCoin(id_coin: number, coin: coin): Observable<alert> {
    return this.http.put<alert>(this.apiURL + '/' + id_coin, coin)
  }

   //accedo al backend para eliminar la caja cuyo id se pasa como parametro
  public deleteCoin(id_coin: number): Observable<alert> {
    return this.http.delete<alert>(this.apiURL + '/' + id_coin)
  }
  
}
