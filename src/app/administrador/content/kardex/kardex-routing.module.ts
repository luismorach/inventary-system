import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KardexComponent } from './kardex.component';
import { KardexGeneralComponent } from './kardex-general/kardex-general.component';
import { BuscarKardexComponent } from './buscar-kardex/buscar-kardex.component';
import { DetallesKardexComponent } from './detalles-kardex/detalles-kardex.component';
import { KardexResolve } from './resolver/kardex.resolver';
import { CurrenciesResolve } from '../configuraciones/monedas/resolver/currencies.resolver';
import { BuysResolve } from '../compras/resolver/buys.resolver';
import { SellsResolve } from '../ventas/resolver/sells.resolver';
import { RepaymentsResolve } from '../devoluciones/resolver/repayments.resolver';

const routes: Routes = [
  {
    path: '', component: KardexComponent,
    children: [
      {
        path: "kardex general", component: KardexGeneralComponent,
        resolve: { kardex: KardexResolve, mainCurrency: CurrenciesResolve }
      },
      {
        path: "detalles kardex/:type/:id_operation/:id_product", component: DetallesKardexComponent,
        resolve: {
          kardex: KardexResolve, productBuy: BuysResolve,
          productSell: SellsResolve, productRepayment: RepaymentsResolve,
          mainCurrency: CurrenciesResolve
        }
      },
      { path: "buscar kardex", component: BuscarKardexComponent },
    ]
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KardexRoutingModule { }
