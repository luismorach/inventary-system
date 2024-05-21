import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonedasComponent } from './monedas.component';
import { NuevaMonedaComponent } from './nueva-moneda/nueva-moneda.component';
import { ListaMonedasComponent } from './lista-monedas/lista-monedas.component';
import { CurrenciesResolve } from './resolver/currencies.resolver';

const routes: Routes = [
  {
    path: '',
    children: [
      {path:'',component:MonedasComponent,children:[
        {path:"nueva moneda",component:NuevaMonedaComponent},
        {path:"lista monedas",component: ListaMonedasComponent,resolve:{
          currencies:CurrenciesResolve}},
        {path:"actualizar moneda/:country_code",component: NuevaMonedaComponent,
          resolve:{currency:CurrenciesResolve}
        }
      ]},
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonedasRoutingModule { }
