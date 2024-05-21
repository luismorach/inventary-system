import { Injectable } from '@angular/core';
import { Category } from 'src/app/interfaces/interfaces';
import { Alert } from 'src/app/interfaces/interfaces';
import { Observable, catchError, map, of} from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { CategoriasService } from '../service/categorias.service';


@Injectable({
  providedIn: 'root'
})
export class CategoriesResolve implements Resolve<Observable<Category[] | Alert> >{

  constructor(private router: Router, 
    private comunicatorSvc: ComunicatorComponetsService,
    private categoriesSvc:CategoriasService) { }
  
  resolve(route: ActivatedRouteSnapshot): Observable<Category[] | Alert> | Observable<Observable<Category[] | Alert>> | Promise<Observable<Category[] | Alert>> {
    let type = (route.routeConfig?.path) ? route.routeConfig?.path: ''
    let id_category = route.params['id_category']

    return this.getDataResolver(type, id_category).pipe(
      map(res => res),
      catchError(error => {
        console.log(error)
        this.router.navigateByUrl('/administrador/error');
        this.comunicatorSvc.errorServer(error); 
        return of(null)
      })
    )
  }
  getDataResolver(type: string, id_category: number) {
    const action: { [key: string]: any } = {
      'actualizar categoría/:id_category': this.categoriesSvc.getCategory(id_category),
      'lista categorías': this.categoriesSvc.getCategories(),
      'productos por categoría/:id_category': this.categoriesSvc.getCategory(id_category),

    }
    const handler = action[type]
    return handler
  }
}
