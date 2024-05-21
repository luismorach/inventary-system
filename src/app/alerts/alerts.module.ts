import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarningComponent } from './warning/warning.component';
import { ErrorComponent } from './error/error.component';
import { SuccessComponent } from './success/success.component';
import { QuantityComponent } from './quantity/quantity.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PayComponent } from './pay/pay.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { CurrencyPipe } from '../pipes/currency.pipe';
import { TableFilterPipe } from '../pipes/table-filter.pipe';
import { TableFilterPipeModule } from '../pipes/table-filter.pipe.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { UtilsComponentsModule } from '../utilsComponents/utilsComponents.module';



@NgModule({
  declarations: [
    WarningComponent,
    ErrorComponent,
    SuccessComponent,
    QuantityComponent,
    PayComponent,
    NotFoundComponent,
    ListProductsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    TableFilterPipeModule,
    UtilsComponentsModule
  ],
  providers: [CurrencyPipe],
  exports: [
    WarningComponent,
    ErrorComponent,
    SuccessComponent,
    QuantityComponent,
    PayComponent,
    ListProductsComponent]
})
export class AlertsModule { }
