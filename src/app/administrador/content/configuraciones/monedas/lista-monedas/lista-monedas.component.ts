import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { CoinsService } from '../../service/coins.service';
import { Currency, ResponseAlert, TableColumn, TableInfo, TableResponse } from 'src/app/interfaces/interfaces';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-lista-monedas',
  templateUrl: './lista-monedas.component.html',
  styleUrls: ['./lista-monedas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaMonedasComponent extends DinamicComponent {

  currencies: Currency[] = [];
  subscriptions: Subscription[] = []
  currencyToDelete!: Currency
  tableInfo: TableInfo = {
    tableTitle: 'Monedas registradas',
    searchField: 'currency',
    enablePagination: true,
    enableSearch: true
  }

  tableColumns: TableColumn[] = [
    { columnLabel: 'Divisa', definition: ['currency'], columnType: '' },
    { columnLabel: 'Código de la divisa', definition: ['currency_code'], columnType: '' },
    { columnLabel: 'País', definition: ['country'], columnType: '' },
    { columnLabel: 'Código del país', definition: ['country_code'], columnType: '' },
    { columnLabel: 'ídioma', definition: ['language'], columnType: '' },
    { columnLabel: 'Código del ídioma', definition: ['language_code'], columnType: '' },
    { columnLabel: '', definition: ['fa fa-arrows-rotate update'], columnType: 'update' },
    { columnLabel: '', definition: ['fa fa-trash-can delete'], columnType: 'delete' },
  ]


  constructor(protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router,private route:ActivatedRoute,
    private coinsSvc: CoinsService, private ref: ChangeDetectorRef) {
    super(comunicatorSvc, router)
  }
  ngOnInit() {
    this.setTitleAndIcon(3, "fas fa-clipboard-list fa-fw")
    this.setCurrencies()
    this.subscribeToAlertResponse()
  }
  setCurrencies() {
    const currenciesData=this.route.snapshot.data['currencies']
    if(currenciesData){
      this.currencies = currenciesData
    }
  }
  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }

  redirectToUpdate(data: Currency) {
    this.router.navigate(['/administrador/configuraciones/actualizar moneda/' + data.country_code])
  }
  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Warning' && response.response) {
      this.delete(this.currencyToDelete)
    }
  }
  delete(data: Currency) {
    this.coinsSvc.deleteCurrency(data.language_code, data.currency_code).subscribe({
      next: res => {
        this.msj = res;
        this.showModal('Success');
      }
    })
  }
  processTableResponse(response: TableResponse) {
    switch (response.responseType) {
      case 'update':
        this.redirectToUpdate(response.value)
        break
      case 'delete':
        this.currencyToDelete = response.value
        this.showModalWarning('La moneda sera eliminada del sistema y al hacerlo se eliminarán ' +
          'todas las compras y ventas asociados a la misma ¿desea continuar?')
        break
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
