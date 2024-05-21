import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImpuestosRoutingModule } from './impuestos-routing.module';
import { NuevoImpuestoComponent } from './nuevo-impuesto/nuevo-impuesto.component';
import { ListaDeImpuestosComponent } from './lista-de-impuestos/lista-de-impuestos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertsModule } from 'src/app/alerts/alerts.module';
import { TableFilterPipeModule } from 'src/app/pipes/table-filter.pipe.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { UtilsComponentsModule } from 'src/app/utilsComponents/utilsComponents.module';


@NgModule({
  declarations: [
    NuevoImpuestoComponent,
    ListaDeImpuestosComponent
  ],
  imports: [
    CommonModule,
    ImpuestosRoutingModule,
    ReactiveFormsModule,
    AlertsModule,
    TableFilterPipeModule,
    NgxCurrencyModule,
    UtilsComponentsModule
  ]
})
export class ImpuestosModule { }
