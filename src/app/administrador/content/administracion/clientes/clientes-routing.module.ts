import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './clientes.component';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { NuevoClienteComponent } from './nuevo-cliente/nuevo-cliente.component';
import { ClientsResolve } from './resolver/clients.resolver';

const clientesRoutes: Routes = [
  {
    path: 'clientes', component: ClientesComponent,
    children: [
      { path: "nuevo cliente", component: NuevoClienteComponent },
      {
        path: "lista clientes", component: ListaClientesComponent,
        resolve: { clients: ClientsResolve }
      },
      {
        path: "actualizar cliente/:id_client", component: NuevoClienteComponent,
        resolve: { client: ClientsResolve }
      },

    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(clientesRoutes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
