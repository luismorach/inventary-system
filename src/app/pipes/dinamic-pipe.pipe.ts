import { DatePipe, PercentPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from './currency.pipe';
import { ComunicatorComponetsService } from '../services/comunicator/comunicator-componets.service';

@Pipe({
  name: 'dinamicPipe'
})
export class DinamicPipe implements PipeTransform {
  constructor(private percentPipe: PercentPipe,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe, private comunicatorSvc: ComunicatorComponetsService) { }
  transform(value: any, ...args: any[]): any {
    switch (args[0]) {
      case 'date':
        return this.datePipe.transform(value, args[1],'GMT+0')
      case 'percent':
        return this.formatPercent(value,args)
      case 'currency':
        return this.formatCurrency(value,args)
      default:
        return value;
    }
  }
  formatPercent(value:any,args:any){
    if (Number.isNaN(Number(value)))
      return value
    return this.percentPipe.transform(value, args[1])
  }

  formatCurrency(value:any,args:any){
    console.log(value,args) 
    if(!value){
      return value
    }
    if (args[1] instanceof Array) {
      if (args[1][0].currency_code !== args[1][1].currency_code) {
        return this.currencyPipe.transform(value, args[1][0]) + ' / ' +
          this.currencyPipe.transform(
            this.comunicatorSvc.converterToMainCoin(value, args[1][0].exchange), args[1][1])
      }
        return this.currencyPipe.transform(value, args[1][0])
    } 
    return this.currencyPipe.transform(value, args[1])
  }
}
