import { Pipe, PipeTransform } from '@angular/core';
import { Currency } from '../interfaces/interfaces';

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {

  transform(value: any, currency:Currency): any {
    const formatter = new Intl.NumberFormat(currency.language_code+'-'+currency.country_code, {
      style: 'currency',
      minimumFractionDigits: 2,
      currency:currency.currency_code,
    })
    return formatter.format(value)
  }
}
