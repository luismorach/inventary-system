import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, PercentPipe } from '@angular/common';
import { TableFilterPipe } from './table-filter.pipe';
import { CurrencyPipe } from './currency.pipe';
import { DinamicPipe } from './dinamic-pipe.pipe';

@NgModule({
  declarations: [
    TableFilterPipe,
    CurrencyPipe,
    DinamicPipe
  ],
  imports: [
    CommonModule,
    
  ],
  exports:[
    TableFilterPipe,
    CurrencyPipe,
    DinamicPipe
  ],providers:[PercentPipe,DatePipe]
})
export class TableFilterPipeModule { }
