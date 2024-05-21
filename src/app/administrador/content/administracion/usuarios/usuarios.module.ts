import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario.component';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UtilsComponentsModule } from 'src/app/utilsComponents/utilsComponents.module';


@NgModule({
  declarations: [
    UsuariosComponent,
    NuevoUsuarioComponent,
    ListaUsuariosComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsuariosRoutingModule,
    UtilsComponentsModule
  ],
  exports:[NuevoUsuarioComponent]
})
export class UsuariosModule { }
