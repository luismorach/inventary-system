import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KardexRoutingModule } from './kardex-routing.module';
import { KardexComponent } from './kardex.component';
import { KardexGeneralComponent } from './kardex-general/kardex-general.component';
import { BuscarKardexComponent } from './buscar-kardex/buscar-kardex.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TableFilterPipeModule } from 'src/app/pipes/table-filter.pipe.module';
import { DetallesKardexComponent } from './detalles-kardex/detalles-kardex.component';
import { UtilsComponentsModule } from 'src/app/utilsComponents/utilsComponents.module';


@NgModule({
  declarations: [
    KardexComponent,
    KardexGeneralComponent,
    BuscarKardexComponent,
    DetallesKardexComponent
  ],
  imports: [
    CommonModule,
    KardexRoutingModule,
    ReactiveFormsModule,
    TableFilterPipeModule,
    UtilsComponentsModule
  ]
})
export class KardexModule { }
