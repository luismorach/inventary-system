import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product,Alert } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiURL = 'http://localhost:3000/products';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas los productos
  public getProductos(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURL);
  }
  public getProductosMasVendidos(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURL+'/sells');
  }
  public getProductosPorVencimiento(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURL+'/expir');
  }

  //accedo al backend para obtener datos de los productos cuyo id se pasa como parametro
  public getProducto(id_product: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURL + '/' + id_product);
  }
  public getProductoByBarcode(barcode: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURL + '/barcode/' + barcode);
  }
  public getProductoByCategory(id_category: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURL + '/category/' + id_category);
  }

  //accedo al backend para crear un nuevo producto
  public setProducto(product: Product): Observable<Alert> {
    return this.http.post<Alert>(this.apiURL, product)
  }

  //accedo al backend para actualizar datos de el producto cuyo id se pasa como parametro
  public updateProducto(id_product: number, product: Product): Observable<Alert> {
    return this.http.put<Alert>(this.apiURL + '/' + id_product, product)
  }

   //accedo al backend para eliminar el producto cuyo id se pasa como parametro
  public deleteProducto(id_product: number): Observable<Alert> {
    return this.http.delete<Alert>(this.apiURL + '/' + id_product)
  }
}
