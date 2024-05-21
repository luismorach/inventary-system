import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Building,Alert } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private apiURL = 'http://localhost:3000/building';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las cajas
  public getBuildings(): Observable<Building[]> {
    return this.http.get<Building[]>(this.apiURL);
  }

  //accedo al backend para obtener datos de la caja cuyo id se pasa como parametro
  public getBuilding(id_building: number): Observable<Building[]|Alert> {
    return this.http.get<Building[]|Alert>(this.apiURL + '/' + id_building);
  }
  public getbuildingoByCategory(id_category: number): Observable<Building[]|Alert> {
    return this.http.get<Building[]|Alert>(this.apiURL + '/category/' + id_category);
  }

  //accedo al backend para crear una nueva caja
  public setBuilding(building: Building): Observable<Alert> {
    return this.http.post<Alert>(this.apiURL, building)
  }

  //accedo al backend para actualizar datos de la caja cuyo id se pasa como parametro
  public updateBuilding(id_building: number, building: Building): Observable<Alert> {
    return this.http.put<Alert>(this.apiURL + '/' + id_building, building)
  }

   //accedo al backend para eliminar la caja cuyo id se pasa como parametro
  public deleteBuilding(id_building: number): Observable<Alert> {
    return this.http.delete<Alert>(this.apiURL + '/' + id_building)
  }
  
}
