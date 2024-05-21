import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrenciesResolve } from '../administrador/content/configuraciones/monedas/resolver/currencies.resolver';
import { ClientsResolve } from '../administrador/content/administracion/clientes/resolver/clients.resolver';
import { ProductsResolve } from '../administrador/content/productos/resolver/products.resolver';
import { NotFoundComponent } from '../alerts/not-found/not-found.component';
import { DetallesVentaComponent } from '../administrador/content/ventas/detalles-venta/detalles-venta.component';
import { SellsResolve } from '../administrador/content/ventas/resolver/sells.resolver';
import { RepaymentsResolve } from '../administrador/content/devoluciones/resolver/repayments.resolver';
import { CashierComponent } from './cashier.component';
import { SaleComponent } from './sale/sale.component';

const cajeroRoutes: Routes = [
  {
    path: 'nueva venta', component: CashierComponent,children:[
      {path:'',component:SaleComponent}
    ], resolve: {
      currencies: CurrenciesResolve , clients: ClientsResolve,
      products: ProductsResolve 
    },
    
  },
  {
    path: 'detalles venta/:id_sell', component: CashierComponent,children:[
      {path:'',component:DetallesVentaComponent}
    ],resolve:{sells:SellsResolve, repayments: RepaymentsResolve, mainCurrency: CurrenciesResolve}
  },
  { path: '', redirectTo: 'nueva venta', pathMatch: 'full' },
   { path: "**", component: NotFoundComponent } 
]


@NgModule({
  imports: [
    RouterModule.forChild(cajeroRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CajeroRoutingModule { }
