import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedoresComponent } from './proveedores.component';
import { ListaProveedoresComponent } from './lista-proveedores/lista-proveedores.component';
import { NuevoProveedorComponent } from './nuevo-proveedor/nuevo-proveedor.component';
import { RouterModule } from '@angular/router';
import { ProvidersResolve } from './resolver/providers.resolver';

const proveedoresRoutes=[
  {
    path: 'proveedores',component:ProveedoresComponent,
    children: [
        {path:"nuevo proveedor",component:NuevoProveedorComponent},
        {path:"lista proveedores",component: ListaProveedoresComponent,
        resolve:{providers:ProvidersResolve}},
        {path:"actualizar proveedor/:id_provider",component:NuevoProveedorComponent,
        resolve:{provider:ProvidersResolve}},
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(proveedoresRoutes)
  ],exports:[
    RouterModule
  ]
})
export class ProveedoresRoutingModule { }
