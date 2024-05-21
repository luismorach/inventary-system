import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevolucionesComponent } from './devoluciones.component';
import { DevolucionesRealizadasComponent } from './devoluciones-realizadas/devoluciones-realizadas.component';
import { BuscarDevolucionesComponent } from './buscar-devoluciones/buscar-devoluciones.component';
import { RepaymentsResolve } from './resolver/repayments.resolver';

const routes: Routes = [
  {
    path: '', component: DevolucionesComponent,
    children: [
      {
        path: "devoluciones realizadas", component: DevolucionesRealizadasComponent,
        resolve: { repayments: RepaymentsResolve }
      },
      { path: "buscar devoluciones", component: BuscarDevolucionesComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevolucionesRoutingModule { }
