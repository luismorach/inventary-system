import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComprasComponent } from './compras.component';
import { NuevaCompraComponent } from './nueva-compra/nueva-compra.component';
import { ComprasRealizadasComponent } from './compras-realizadas/compras-realizadas.component';
import { BuscarComprasComponent } from './buscar-compras/buscar-compras.component';
import { DetallesCompraComponent } from './detalles-compra/detalles-compra.component';
import { BuysResolve } from './resolver/buys.resolver';
import { ProductsResolve } from '../productos/resolver/products.resolver';
import { RepaymentsResolve } from '../devoluciones/resolver/repayments.resolver';
import { CurrenciesResolve } from '../configuraciones/monedas/resolver/currencies.resolver';
import { ProvidersResolve } from '../administracion/proveedores/resolver/providers.resolver';
import { BuildingResolve } from '../configuraciones/datos-de-la-empresa/resolver/building.resolver';

const routes: Routes = [
  {
    path: '', component: ComprasComponent,
    children: [
      {
        path: "nueva compra", component: NuevaCompraComponent,
        resolve: {
          currencies: CurrenciesResolve, providers: ProvidersResolve,
          products: ProductsResolve
        }
      },
      {
        path: "compras realizadas", component: ComprasRealizadasComponent,
        resolve: { buys: BuysResolve }
      },
      { path: "buscar compras", component: BuscarComprasComponent },
      {
        path: "detalles compra/:id_buy", component: DetallesCompraComponent,
        resolve: { buy: BuysResolve, products: ProductsResolve, repayments: RepaymentsResolve }
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
