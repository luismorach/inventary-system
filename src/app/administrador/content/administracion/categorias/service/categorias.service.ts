import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category,Alert } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private apiURL = 'http://localhost:3000/categories';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las categorias
  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiURL);
  }

  //accedo al backend para obtener datos de la categoria cuyo id se pasa como parametro
  public getCategory(id_Category: number): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiURL + '/' + id_Category);
  }

  //accedo al backend para crear una nueva categoria
  public setCategory(Category: Category): Observable<Alert> {
    return this.http.post<Alert>(this.apiURL, Category)
  }

  //accedo al backend para actualizar datos de la categoria cuyo id se pasa como parametro
  public updateCategory(id_Category: number, Category: Category): Observable<Alert> {
    return this.http.put<Alert>(this.apiURL + '/' + id_Category, Category)
  }

   //accedo al backend para eliminar la categoria cuyo id se pasa como parametro
  public deleteCategory(id_Category: number): Observable<Alert> {
    return this.http.delete<Alert>(this.apiURL + '/' + id_Category)
  }
}
