import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriasComponent } from './categorias.component';
import { NuevaCategoriaComponent } from './nueva-categoria/nueva-categoria.component';
import { ListaCategoriasComponent } from './lista-categorias/lista-categorias.component';
import { CategoriasRoutingModule } from './categorias-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UtilsComponentsModule } from 'src/app/utilsComponents/utilsComponents.module';

@NgModule({
  declarations: [
    CategoriasComponent,
    NuevaCategoriaComponent,
    ListaCategoriasComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CategoriasRoutingModule,
    UtilsComponentsModule
  ]
})
export class CategoriasModule { }
