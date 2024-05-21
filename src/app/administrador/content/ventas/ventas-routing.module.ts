import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasComponent } from './ventas.component';
import { NuevaVentaComponent } from './nueva-venta/nueva-venta.component';
import { VentasRealizadasComponent } from './ventas-realizadas/ventas-realizadas.component';
import { BuscarVentasComponent } from './buscar-ventas/buscar-ventas.component';
import { DetallesVentaComponent } from './detalles-venta/detalles-venta.component';
import { SellsResolve } from './resolver/sells.resolver';
import { RepaymentsResolve } from '../devoluciones/resolver/repayments.resolver';
import { CurrenciesResolve } from '../configuraciones/monedas/resolver/currencies.resolver';
import { ClientsResolve } from '../administracion/clientes/resolver/clients.resolver';
import { ProductsResolve } from '../productos/resolver/products.resolver';

const routes: Routes = [
  {
    path: '', component: VentasComponent,
    children: [
      {
        path: "nueva venta", component: NuevaVentaComponent,
        resolve: {
          currencies: CurrenciesResolve, clients: ClientsResolve,
          products: ProductsResolve
        }
      },
      {
        path: "ventas realizadas", component: VentasRealizadasComponent,
        resolve: { sells: SellsResolve }
      },
      { path: "buscar ventas", component: BuscarVentasComponent },
      {
        path: "detalles venta/:id_sell", component: DetallesVentaComponent,
        resolve: { sells: SellsResolve, repayments: RepaymentsResolve, mainCurrency: CurrenciesResolve }
      },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
