import { Pipe, PipeTransform } from '@angular/core';
import { ComunicatorComponetsService } from '../services/comunicator/comunicator-componets.service';

@Pipe({
  name: 'tableFilter'
})
export class TableFilterPipe implements PipeTransform {
  constructor(private comunicatorSvc: ComunicatorComponetsService) { }
  transform(value: any, args: any): any {
    let result = value.filter((newValue: any) => {
      if (args.search === null || args.search === '') {
        return true;
      } else {
        return newValue[args.campSearch].includes(args.search);
      }
    });

    if (args.pagination) {
      this.comunicatorSvc.setData(result);
      const inicio: number = args.indexCurrentPage * args.numberRows;
      const fin: number = inicio + args.numberRows;
      result = result.slice(inicio, fin);
    }

    return result;
  }




}

