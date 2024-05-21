import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableFilterPipeModule } from 'src/app/pipes/table-filter.pipe.module';
import { VentasComponent } from './ventas.component';
import { NuevaVentaComponent } from './nueva-venta/nueva-venta.component';
import { VentasRealizadasComponent } from './ventas-realizadas/ventas-realizadas.component';
import { BuscarVentasComponent } from './buscar-ventas/buscar-ventas.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { ClientesModule } from '../administracion/clientes/clientes.module';
import { DetallesVentaComponent } from './detalles-venta/detalles-venta.component';
import { CurrencyPipe } from 'src/app/pipes/currency.pipe';
import { AlertsModule } from 'src/app/alerts/alerts.module';
import { UtilsComponentsModule } from 'src/app/utilsComponents/utilsComponents.module';


@NgModule({
  declarations: [
    VentasComponent,
    NuevaVentaComponent,
    VentasRealizadasComponent,
    BuscarVentasComponent,
    DetallesVentaComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    ReactiveFormsModule,
    TableFilterPipeModule,
    NgxCurrencyModule,
    FormsModule,
    ClientesModule,
    AlertsModule,
    UtilsComponentsModule
  ],
  providers:[
    CurrencyPipe
  ],
  exports:[DetallesVentaComponent]
})
export class VentasModule { }
