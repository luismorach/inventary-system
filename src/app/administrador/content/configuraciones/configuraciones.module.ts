import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionesRoutingModule } from './configuraciones-routing.module';
import { DatosDeLaEmpresaComponent } from './datos-de-la-empresa/datos-de-la-empresa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyModule } from 'ngx-currency';
import { ImpuestosComponent } from './impuestos/impuestos.component';
import { UtilsComponentsModule } from 'src/app/utilsComponents/utilsComponents.module';


@NgModule({
  declarations: [
    DatosDeLaEmpresaComponent,
    ImpuestosComponent,
  ],
  imports: [
    CommonModule,
    ConfiguracionesRoutingModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    FormsModule,
    UtilsComponentsModule
  ]
})
export class ConfiguracionesModule { }
