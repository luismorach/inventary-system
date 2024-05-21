import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesModule } from '../administrador/content/administracion/clientes/clientes.module';
import { CajeroRoutingModule } from './cashier-routing.module';
import { TableFilterPipeModule } from '../pipes/table-filter.pipe.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyModule } from 'ngx-currency';
import { AlertsModule } from '../alerts/alerts.module';
import { UsuariosModule } from '../administrador/content/administracion/usuarios/usuarios.module';
import { CashierComponent } from './cashier.component';
import { SaleComponent } from './sale/sale.component';
import { UtilsComponentsModule } from '../utilsComponents/utilsComponents.module';



@NgModule({
  declarations: [
    CashierComponent,
    SaleComponent,
  ],
  imports: [
    CommonModule,
    ClientesModule,
    UsuariosModule,
    CajeroRoutingModule,
    TableFilterPipeModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    FormsModule,
    AlertsModule,
    UtilsComponentsModule
  ]
})
export class CashierModule { }
