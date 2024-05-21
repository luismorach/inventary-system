import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { AlertListProducts, AlertPay, ResponseAlert } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VentasComponent {
  title: string[] = [];
  subscriptions: Subscription[]=[]
  msjPay!: AlertPay
  msjListProducts!:AlertListProducts
  @ViewChild('pay') Pay?: ElementRef;
  @ViewChild('listProducts') ListProducts?: ElementRef;
  constructor(private comunicatorSvc: ComunicatorComponetsService,
    private ref: ChangeDetectorRef) { }
  ngOnInit() {
    this.subscriptions.push(this.comunicatorSvc.getTitleComponent()
      .subscribe(res => {this.title=res; this.ref.detectChanges();console.log(this.title)}))

    this.subscriptions.push(this.comunicatorSvc.getInfoAlertPay().subscribe(res => {
     
      if (res && res.showAlert === true) {
        this.msjPay = res
        this.Pay?.nativeElement.showModal()
        this.ref.detectChanges()
      } else {
        this.Pay?.nativeElement.close()
      }
    }))
    this.subscriptions.push(this.comunicatorSvc.getInfoAlertListProducts().subscribe(res => {
      console.log(res)
      if (res && res.showAlert === true && res.actionType==='venta') {
        this.msjListProducts = res
        this.ListProducts?.nativeElement.showModal()
        this.ref.detectChanges()
      } else {
        this.ListProducts?.nativeElement.close()
      }
    }))
  }
  receiveMessagePay(response: any) {

    let ResponseAlert: ResponseAlert = {
      type: 'pay',
      response: response
    }
    this.comunicatorSvc.setResponseAlert(ResponseAlert)
    if (!(response instanceof Object)) {
      this.msjPay.showAlert = false
      this.comunicatorSvc.setInfoAlertPay(this.msjPay)
    }
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
  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }

}

