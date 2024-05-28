import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { AlertListProducts, ResponseAlert } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ComprasComponent {
  title:string[]=[];
  msjListProducts!:AlertListProducts
  subscriptions:Subscription[]=[]
  @ViewChild('listProducts') ListProducts?: ElementRef;
  constructor(private comunicatorSvc:ComunicatorComponetsService,
    private ref:ChangeDetectorRef) {}

  ngOnInit(){
    this.subscriptions.push(this.comunicatorSvc.getTitleComponent().pipe(tap(res=>this.title=res))
    .subscribe(res=>this.ref.detectChanges()));

    this.subscriptions.push(this.comunicatorSvc.getInfoAlertListProducts().subscribe(res => {
      if (res && res.showAlert === true&& res.actionType==='compra') {
        this.msjListProducts = res
        this.ListProducts?.nativeElement.showModal()
        this.ref.detectChanges()
      } else {
        this.ListProducts?.nativeElement.close()
      }
    }))
  } 

  receiveMessageListProducts(response: any) {
    let ResponseAlert: ResponseAlert = {
      type: 'availableProducts',
      response: response
    }
    this.comunicatorSvc.setResponseAlert(ResponseAlert)
    if (!(response instanceof Object)) {
      this.msjListProducts.showAlert = false
      this.comunicatorSvc.setInfoAlertListProducts(this.msjListProducts)
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
