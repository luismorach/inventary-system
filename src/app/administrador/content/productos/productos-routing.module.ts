import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevoProductoComponent } from './nuevo-producto/nuevo-producto.component';
import { ProductosComponent } from './productos.component';
import { ProductosEnAlmacenComponent } from './productos-en-almacen/productos-en-almacen.component';
import { LoMasVendidoComponent } from './lo-mas-vendido/lo-mas-vendido.component';
import { ProductosPorCategoriaComponent } from './productos-por-categoria/productos-por-categoria.component';
import { ProductosPorVencimientoComponent } from './productos-por-vencimiento/productos-por-vencimiento.component';
import { ProductsResolve } from './resolver/products.resolver';
import { CurrenciesResolve } from '../configuraciones/monedas/resolver/currencies.resolver';
import { CategoriesResolve } from '../administracion/categorias/resolver/categories.resolver';

const routes: Routes = [
  {
    path: '',component: ProductosComponent,
    children: [
     
          { path: "nuevo producto", component: NuevoProductoComponent },
          {
            path: "productos en almacen", component: ProductosEnAlmacenComponent,
            resolve: { products: ProductsResolve, mainCurrency: CurrenciesResolve }
          },
          {
            path: "lo mas vendido", component: LoMasVendidoComponent,
            resolve: { products: ProductsResolve }
          },
          {
            path: "productos por categoría", component: ProductosPorCategoriaComponent,
            resolve: { categories: ProductsResolve }
          },
          {
            path: "productos por categoría/:id_category", component: ProductosPorCategoriaComponent,
            resolve: { categories: ProductsResolve, category: CategoriesResolve }
          },
          {
            path: "productos por vencimiento", component: ProductosPorVencimientoComponent,
            resolve: { products: ProductsResolve }
          },
          {
            path: "actualizar producto/:id_product", component: NuevoProductoComponent,
            resolve: { product: ProductsResolve }
          },
        ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
