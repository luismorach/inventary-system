import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef,ViewChild } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { VentasService } from '../service/ventas.service';
import { SaleFunctions } from 'src/app/utils/saleFuntions';
import { SessionStorageService } from 'src/app/storage/session-storage.service';

@Component({
  selector: 'app-nueva-venta',
  templateUrl: './nueva-venta.component.html',
  styleUrls: ['./nueva-venta.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NuevaVentaComponent extends SaleFunctions {
  date = new Date()
  @ViewChild('client', { static: true }) clientElement?: ElementRef;
  
  constructor(protected override fb: FormBuilder, protected override router: Router,
    public override comunicatorSvc: ComunicatorComponetsService,
    protected override salesService: VentasService,
    protected override changeDetectorRef: ChangeDetectorRef,
    protected override activatedRoute: ActivatedRoute,
    protected override sessionStorageService:SessionStorageService) {
    super(comunicatorSvc, router,fb,activatedRoute,changeDetectorRef,salesService,sessionStorageService);
  }

  ngOnInit() {
    this.setTitleAndIcon(3, "fas fa-cart-plus fa-fw")
    this.initForm()
    this.setCurrencies()
    this.setProducts()
    this.setClients()
    this.subscribeToCurrencyChanges()
    this.subscribeToAlertResponse()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  } 
}
