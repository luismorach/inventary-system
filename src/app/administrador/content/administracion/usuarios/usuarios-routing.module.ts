import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario.component';
import { UsuariosComponent } from './usuarios.component';
import { UsersResolve } from './resolver/users.resolver';

const usersRoutes = [
  {
    path: 'usuarios', component: UsuariosComponent,
    children: [
     
          { path: "nuevo usuario", component: NuevoUsuarioComponent },
          {
            path: "lista usuarios", component: ListaUsuariosComponent,
            resolve: { users: UsersResolve }
          },
          {
            path: "actualizar cuenta/:id_user", component: NuevoUsuarioComponent,
            resolve: { user: UsersResolve }
          },
          {
            path: "actualizar usuario/:id_user", component: NuevoUsuarioComponent,
            resolve: { user: UsersResolve }
          },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(usersRoutes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
