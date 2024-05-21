import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CajasComponent } from './cajas.component';
import { NuevaCajaComponent } from './nueva-caja/nueva-caja.component';
import { ListaCajasComponent } from './lista-cajas/lista-cajas.component';
import { CajasRoutingModule } from './cajas-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UtilsComponentsModule } from 'src/app/utilsComponents/utilsComponents.module';
@NgModule({
  declarations: [
    CajasComponent,
    NuevaCajaComponent,
    ListaCajasComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CajasRoutingModule,
    UtilsComponentsModule
  ],
  exports:[
   
  ]
})
export class CajasModule { }
