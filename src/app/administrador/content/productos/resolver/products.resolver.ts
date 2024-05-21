import { Injectable } from '@angular/core';
import { Category, Product} from 'src/app/interfaces/interfaces';
import { Observable, catchError, concatMap, map, mergeMap, of, toArray } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { ProductosService } from '../service/productos.service';
import { CategoriasService } from '../../administracion/categorias/service/categorias.service';
import { ComprasService } from '../../compras/service/compras.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsResolve implements Resolve<Observable<Product[] | null>>{
  constructor(private router: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    private productsSvc: ProductosService, private categoriesSvc: CategoriasService,
    private buysSvc:ComprasService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product[]> {
    let type = (route.routeConfig?.path) ? route.routeConfig?.path : ''
    let id_product = route.params['id_product']
    let id_buy = route.params['id_buy']

    return this.getDataResolver(type, id_product,id_buy).pipe(
      map(res => res),
      catchError(error => {
        this.router.navigateByUrl('/'+state.url.split('/')[1]+'/error');
        this.comunicatorSvc.errorServer(error);
        return of(null)
      }))
  }

  getDataResolver(type: string, id_product: number,id_buy:number) {
    const action: { [key: string]: any } = {
      'productos en almacen': this.productsSvc.getProductos(),
      'lo mas vendido': this.productsSvc.getProductosMasVendidos(),
      'productos por vencimiento': this.productsSvc.getProductosPorVencimiento(),
      'productos por categoría': this.getProductsByCategory(),
      'productos por categoría/:id_category': this.getProductsByCategory(),
      "actualizar producto/:id_product": this.productsSvc.getProducto(id_product),
      'detalles compra/:id_buy':this.getBuyProducts(id_buy),
      'nueva compra':this.productsSvc.getProductos(),
      'nueva venta':this.productsSvc.getProductos(),
    }
    const handler = action[type]
    return handler
  } 

  getBuyProducts(id_buy:number){
    return this.buysSvc.getProductsBuy(id_buy).pipe(
      concatMap((res: any) =>res),
      concatMap((res: any) => this.productsSvc.getProducto(res.id_product).pipe(
        concatMap((product)=>product)
      )),toArray())
  }
  getProductsByCategorySelected(id_category: number){
    return this.categoriesSvc.getCategory(id_category)
  }

  getProductsByCategory() {
    
    let consulta = this.categoriesSvc.getCategories().pipe(mergeMap((other:Category[]) => other),
      mergeMap((category: Category) => 
        this.productsSvc.getProductoByCategory(category.id_category).pipe(
          map((products) => {
            return { category, products }
          }))
      ),toArray())

    return consulta
  }

}
