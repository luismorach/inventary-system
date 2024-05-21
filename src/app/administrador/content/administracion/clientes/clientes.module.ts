import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesComponent } from './clientes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NuevoClienteComponent } from './nuevo-cliente/nuevo-cliente.component';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { UtilsComponentsModule } from 'src/app/utilsComponents/utilsComponents.module';


@NgModule({
  declarations: [
    ClientesComponent,
    NuevoClienteComponent,
    ListaClientesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClientesRoutingModule,
    UtilsComponentsModule
  ],
  exports:[NuevoClienteComponent]
})
export class ClientesModule { }
