import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from './categorias.component';
import { NuevaCategoriaComponent } from './nueva-categoria/nueva-categoria.component';
import { ListaCategoriasComponent } from './lista-categorias/lista-categorias.component';
import { CategoriesResolve } from './resolver/categories.resolver';

const categoriasRoutes: Routes = [
  {
    path: 'categorías', component: CategoriasComponent, children: [
      { path: "nueva categoría", component: NuevaCategoriaComponent },
      {
        path: "lista categorías", component: ListaCategoriasComponent,
        resolve: { categories: CategoriesResolve }
      },
      {
        path: "actualizar categoría/:id_category", component: NuevaCategoriaComponent,
        resolve: { category: CategoriesResolve }
      },
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(categoriasRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class CategoriasRoutingModule { }
