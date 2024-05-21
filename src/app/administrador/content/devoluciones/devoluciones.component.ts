import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class DevolucionesComponent {

  title:string[]=[];
  comunicatorData!:Subscription
  constructor(private comunicatorSvc:ComunicatorComponetsService,
    private ref:ChangeDetectorRef) {}
    
  ngOnInit(){
    this.comunicatorData=this.comunicatorSvc.getTitleComponent().pipe(tap(res=>this.title=res))
    .subscribe(res=>this.ref.detectChanges());
  }
  ngOnDestroy(){
    (this.comunicatorData)?this.comunicatorData.unsubscribe():null
  }
}
