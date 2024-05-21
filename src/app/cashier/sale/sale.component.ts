import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder,} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VentasService } from 'src/app/administrador/content/ventas/service/ventas.service';
import { ResponseAlert,SelectInfo } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { SessionStorageService } from 'src/app/storage/session-storage.service';
import { SaleFunctions } from 'src/app/utils/saleFuntions';


@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent extends SaleFunctions {
  @ViewChild('client', { static: true }) clientElement?: ElementRef;
  @ViewChild('productsList') productsListElement?: ElementRef;
  selectInfo: SelectInfo = {
    label: 'Tipo de venta',
    optionName:['option'],
    definitionOption: 'value',
    required: true
  }
  selectOptions = [
    { option: 'Seleccione el tipo de venta', value: '' },
    { option: 'Contado', value: 'Contado' },
    { option: 'Crédito', value: 'Crédito' }
  ]

  constructor(protected override fb: FormBuilder, 
    protected override router: Router,
    public override comunicatorSvc: ComunicatorComponetsService,
    protected override salesService: VentasService,
    protected override changeDetectorRef: ChangeDetectorRef,
    protected override activatedRoute: ActivatedRoute,
    protected override sessionStorageService:SessionStorageService) {
    super(comunicatorSvc, router,fb,activatedRoute,changeDetectorRef,salesService,sessionStorageService);
  }  
  ngOnInit() {
    this.initForm()
    this.initForm()
    this.setCurrencies()
    this.setProducts()
    this.setClients()
    this.subscribeToCurrencyChanges()
    this.subscribeToAlertResponse()
    this.subscribeToAlertListProducts()
  }
  
 
  subscribeToAlertListProducts() {
    this.subscriptions.push(this.comunicatorSvc.getInfoAlertListProducts().subscribe(response => {
      if (!response || response.showAlert !== true || response.actionType !== 'venta') {
        this.productsListElement?.nativeElement.close()
        return
      }
      this.msjListProducts = response
      this.productsListElement?.nativeElement.showModal()
      this.changeDetectorRef.detectChanges()
    }))
  }
 
  receiveMessageAvailableProducts(response: any) {
    if (!(response instanceof Object)) {
      this.msjListProducts.showAlert = false;
      this.comunicatorSvc.setInfoAlertListProducts(this.msjListProducts);
      return;
    }

    let ResponseAlert: ResponseAlert = {
      type: 'availableProducts',
      response: response
    };
    this.comunicatorSvc.setResponseAlert(ResponseAlert);
  }

  

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
