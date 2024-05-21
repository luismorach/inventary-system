import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CajasComponent } from './cajas.component';
import { NuevaCajaComponent } from './nueva-caja/nueva-caja.component';
import { ListaCajasComponent } from './lista-cajas/lista-cajas.component';
import { RegistersResolve } from './resolver/registers.resolver';

const cajasRoutes: Routes = [
  {
    path: 'cajas', component: CajasComponent,
    children: [
      { path: "nueva caja", component: NuevaCajaComponent },
      { path: "lista cajas", component: ListaCajasComponent, resolve: { registers: RegistersResolve } },
      { path: "actualizar caja/:id_register", component: NuevaCajaComponent, resolve: { register: RegistersResolve } }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(cajasRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CajasRoutingModule { }
