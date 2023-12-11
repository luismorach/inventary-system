import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatosDeLaEmpresaComponent } from './datos-de-la-empresa/datos-de-la-empresa.component';
import { MonedasModule } from './monedas/monedas.module';
const routes: Routes = [
  {
    path: '', children: [
      { path: 'datos de la empresa', component: DatosDeLaEmpresaComponent },
      { path: 'monedas', loadChildren: ()=>import
      ('./monedas/monedas.module').then(m=>m.MonedasModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionesRoutingModule { }
