import { Component } from '@angular/core';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-monedas',
  templateUrl: './monedas.component.html',
  styleUrls: ['./monedas.component.css']
})
export class MonedasComponent extends DinamicComponent {
  title: string[] = []

  constructor(private comunicatorSvc: ComunicatorComponetsService) {
    super(true, false);
  }
  ngOnInit() {
    this.comunicatorSvc.getTitleComponent().subscribe(titleComponet => {
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
    })
  }
}
