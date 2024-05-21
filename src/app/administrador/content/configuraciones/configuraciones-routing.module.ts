import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatosDeLaEmpresaComponent } from './datos-de-la-empresa/datos-de-la-empresa.component';
import { MonedasModule } from './monedas/monedas.module';
import { BuildingResolve } from './datos-de-la-empresa/resolver/building.resolver';
import { CurrenciesResolve } from './monedas/resolver/currencies.resolver';
const routes: Routes = [
  {
    path: '', children: [
      { path: 'datos de la empresa', component: DatosDeLaEmpresaComponent,
        resolve:{building:BuildingResolve,currencies:CurrenciesResolve}
       },
      { path: '', loadChildren: ()=>import
      ('./monedas/monedas.module').then(m=>m.MonedasModule) },
      { path: '', loadChildren: ()=>import
      ('./impuestos/impuestos.module').then(m=>m.ImpuestosModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionesRoutingModule { }
