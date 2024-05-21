import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-impuestos',
  templateUrl: './impuestos.component.html',
  styleUrls: ['./impuestos.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ImpuestosComponent extends  DinamicComponent {
  comunicatorData!:Subscription

  constructor(comunicatorSvc: ComunicatorComponetsService, 
    private ref: ChangeDetectorRef,router:Router) {
    super(comunicatorSvc,router);
  }
  ngOnInit() {
    this.comunicatorData=this.comunicatorSvc.getTitleComponent().subscribe(titleComponet => {
      this.title = titleComponet
      switch (titleComponet[1]) {
        case "NUEVO IMPUESTO":
          this.option1 = true
          this.option2 = false
          break;
        case "LISTA IMPUESTOS":
          this.option1 = false
          this.option2 = true
          break;
        case "ACTUALIZAR IMPUESTO":
          this.option1 = false
          this.option2 = false
          break;
      }
      this.ref.detectChanges()
    })
  }

  ngOnDestroy(){
    (this.comunicatorData)?this.comunicatorData.unsubscribe():null
  }
}
