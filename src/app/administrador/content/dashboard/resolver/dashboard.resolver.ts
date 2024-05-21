import { Injectable } from '@angular/core';
import { Dashboard} from 'src/app/interfaces/interfaces';
import { Observable, catchError, map, of} from 'rxjs';
import { Resolve, Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DashboardService } from '../service/dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolve implements Resolve<Observable<Dashboard[] | null> >{

  constructor(private router:Router,
    private comunicatorSvc: ComunicatorComponetsService,
    private dashboardSvc:DashboardService) { }
  
  resolve(): Observable<Dashboard[]|null>  {

    return this.dashboardSvc.getData().pipe(
      map(res => res),
      catchError(error => {
        this.router.navigateByUrl('/error');
        this.comunicatorSvc.errorServer(error); 
        return of(null)
      })
    )
  }
  
}
