import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ComunicatorComponetsService } from './services/comunicator/comunicator-componets.service';
import { Alert,  ResponseAlert } from './interfaces/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent {

  msj!: Alert
  data!: Subscription

  @ViewChild('success') Success?: ElementRef;
  @ViewChild('warning') Warning?: ElementRef;
  @ViewChild('error') Error?: ElementRef;
  @ViewChild('quantity') Quantity?: ElementRef;

  constructor(private comunicatorSvc: ComunicatorComponetsService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
      this.data = this.comunicatorSvc.getInfoAlert().subscribe(res => {
      this.msj = res
      if (res && res.showAlert === true && res.type) {
        this.getAlert(res).showModal()
        this.ref.detectChanges()
      } else if (res.type) {
        this.getAlert(res).close()
      }
    });  

  }

  getAlert(type: Alert) {
    const action: { [key: string]: any } = {
      Warning: this.Warning?.nativeElement,
      Error: this.Error?.nativeElement,
      Success: this.Success?.nativeElement,
      Quantity: this.Quantity?.nativeElement,
    }
    const handler = action[(type.type) ? type.type : '']
    return handler
  }
  receiveMessage(response: any) {
    let ResponseAlert: ResponseAlert = {
      type: (this.msj.type) ? this.msj.type : '',
      response: response
    }

    this.comunicatorSvc.setResponseAlert(ResponseAlert)
    this.msj.showAlert = false
    this.comunicatorSvc.setInfoAlert(this.msj)
  }
  

  ngOnDestroy() {
    console.log('desusciroh')
    // this.data.unsubscribe()
  }
}
