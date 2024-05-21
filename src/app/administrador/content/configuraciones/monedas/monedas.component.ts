import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-monedas',
  templateUrl: './monedas.component.html',
  styleUrls: ['./monedas.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class MonedasComponent extends DinamicComponent {
  comunicatordata!:Subscription

  constructor(comunicatorSvc: ComunicatorComponetsService, 
    private ref: ChangeDetectorRef,router:Router) {
    super(comunicatorSvc,router);
  }
  ngOnInit() {
    this.comunicatordata=this.comunicatorSvc.getTitleComponent().subscribe(titleComponet => {
      this.title = titleComponet
      switch (titleComponet[1]) {
        
        case "NUEVA MONEDA":
          this.option1 = true
          this.option2 = false
          break;
        case "LISTA MONEDAS":
          this.option1 = false
          this.option2 = true
          break;
        case "ACTUALIZAR MONEDA":
          this.option1 = false
          this.option2 = false
          break;
      }
      this.ref.detectChanges()
    })
  }
  ngOnDEstroy(){
    (this.comunicatordata)?this.comunicatordata.unsubscribe():null
  }
}
