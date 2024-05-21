import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repayment,Alert } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DevolucionesService {

  private apiURL = 'http://localhost:3000/repayments';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las cajas
  public getRepayments(): Observable<Repayment[]> {
    return this.http.get<Repayment[]>(this.apiURL);
  }
  public getRepaymentsBydate(initialDate:Date,endDate:Date): Observable<Repayment[]> {
    return this.http.get<Repayment[]>(this.apiURL+'/'+new Intl.DateTimeFormat('es-CL').format(initialDate)
    +'/'+new Intl.DateTimeFormat('es-CL').format(endDate));
  }
  //accedo al backend para obtener datos de la caja cuyo id se pasa como parametro
  public getRepayment(id_repayment: number): Observable<Repayment[]> {
    return this.http.get<Repayment[]>(this.apiURL + '/' + id_repayment);
  }
  public getRepaymentsById(id_ticket: number): Observable<Repayment[]> {
    return this.http.get<Repayment[]>(this.apiURL + 'ById/' + id_ticket);
  }
  public getRepaymentsBuy(id_buy: number): Observable<Repayment[]> {
    return this.http.get<Repayment[]>(this.apiURL + 'Buy/' + id_buy);
  }
  public getRepaymentsSell(id_sell: number): Observable<Repayment[]> {
    return this.http.get<Repayment[]>(this.apiURL + 'Sell/' + id_sell);
  }
  public getRepaymentByUser(names:string): Observable<Repayment[]> {
    return this.http.get<Repayment[]>(this.apiURL + 'ByUser/' +names);
  }
  public getRepaymentByType(names:string): Observable<Repayment[]> {
    return this.http.get<Repayment[]>(this.apiURL + 'ByType/' +names);
  }
 
    //accedo al backend para crear una nueva caja
  public setRepaymentBuy(repayment: Repayment): Observable<Alert> {
    return this.http.post<Alert>(this.apiURL+'Buy', repayment)
  }
  public setRepaymentSell(repayment: Repayment): Observable<Alert> {
    return this.http.post<Alert>(this.apiURL+'Sell', repayment)
  }

  //accedo al backend para actualizar datos de la caja cuyo id se pasa como parametro
  public updateRepayment(id_repayment: number, repayment: Repayment): Observable<Alert> {
    return this.http.put<Alert>(this.apiURL + '/' + id_repayment, repayment)
  }

   //accedo al backend para eliminar la caja cuyo id se pasa como parametro
  public deleteRepayment(id_repayment: number): Observable<Alert> {
    return this.http.delete<Alert>(this.apiURL + '/' + id_repayment)
  }
}





