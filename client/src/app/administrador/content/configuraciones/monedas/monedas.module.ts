import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonedasRoutingModule } from './monedas-routing.module';
import { MonedasComponent } from './monedas.component';
import { NuevaMonedaComponent } from './nueva-moneda/nueva-moneda.component';
import { ListaMonedasComponent } from './lista-monedas/lista-monedas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TableFilterPipeModule } from 'src/app/pipes/table-filter.pipe.module';


@NgModule({
  declarations: [
    MonedasComponent,
    NuevaMonedaComponent,
    ListaMonedasComponent
  ],
  imports: [
    CommonModule,
    MonedasRoutingModule,
    ReactiveFormsModule,
    TableFilterPipeModule
  ]
})
export class MonedasModule { }
