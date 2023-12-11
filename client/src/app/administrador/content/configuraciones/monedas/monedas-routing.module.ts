import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonedasComponent } from './monedas.component';
import { NuevaMonedaComponent } from './nueva-moneda/nueva-moneda.component';
import { ListaMonedasComponent } from './lista-monedas/lista-monedas.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path:'',component:MonedasComponent,children:[
        {path:"nueva moneda",component:NuevaMonedaComponent},
        {path:"lista monedas",component: ListaMonedasComponent},
        {path:"actualizar moneda/:id_moneda",component: NuevaMonedaComponent}
      ]},
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonedasRoutingModule { }
