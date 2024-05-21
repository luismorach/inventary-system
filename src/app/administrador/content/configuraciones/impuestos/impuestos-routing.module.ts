import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImpuestosComponent } from './impuestos.component';
import { NuevoImpuestoComponent } from './nuevo-impuesto/nuevo-impuesto.component';
import { ListaDeImpuestosComponent } from './lista-de-impuestos/lista-de-impuestos.component';
import { TaxesResolve } from './resolver/taxes.resolver';

const routes: Routes = [
  {
    path: '',
    children: [
      {path:'',component:ImpuestosComponent,children:[
        {path:"nuevo impuesto",component:NuevoImpuestoComponent},
        {path:"lista impuestos",component: ListaDeImpuestosComponent,resolve:{taxes:TaxesResolve}},
        {path:"actualizar impuesto/:tax_id",component: NuevoImpuestoComponent,
          resolve:{tax:TaxesResolve}
        }
      ]},
     
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ImpuestosRoutingModule { 
  
}
