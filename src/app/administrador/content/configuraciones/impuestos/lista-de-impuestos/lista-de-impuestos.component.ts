import { ChangeDetectionStrategy,Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResponseAlert, TableColumn, TableInfo, TableResponse, Tax } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { ImpuestosService } from '../../service/impuestos.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-lista-de-impuestos',
  templateUrl: './lista-de-impuestos.component.html',
  styleUrls: ['./lista-de-impuestos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaDeImpuestosComponent extends DinamicComponent {


  taxes: Tax[] = [];
  comunicatorData!: Subscription
  taxToDelete!: Tax
  subscriptions: Subscription[] = []
  tableInfo: TableInfo = {
    tableTitle: 'Impuestos registrados',
    searchField: 'tax_name',
    enablePagination: true,
    enableSearch: true
  }

  tableColumns: TableColumn[] = [
    { columnLabel: 'Nombre del impuesto', definition: ['tax_name'], columnType: '' },
    { columnLabel: 'Porcentaje del impuesto', definition: ['tax_rate'], columnType: '',
    pipeType:'percent',options:'1.1-1' },
    { columnLabel: 'Mostrar impuesto', definition: ['show_tax'], columnType: '' },
    { columnLabel: '', definition: ['fa fa-arrows-rotate update'], columnType: 'update' },
    { columnLabel: '', definition: ['fa fa-trash-can delete'], columnType: 'delete' },
  ]


  constructor(
    protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router, private route: ActivatedRoute,
    private impuestosSvc: ImpuestosService) {
    super(comunicatorSvc, router)
  }
  ngOnInit() {
    this.setTitleAndIcon(3, "fas fa-clipboard-list fa-fw")
    this.setTaxes()
    this.subscribeToAlertResponse()
  }
  setTaxes() {
    const taxesData = this.route.snapshot.data['taxes']
    if (taxesData) {
      this.taxes = taxesData
    }
  }

  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }

  redirectToUpdate(data: Tax) {
    this.router.navigate(['/administrador/configuraciones/actualizar impuesto/' + data.tax_id])
  }
  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Warning' && response.response) {
      this.delete(this.taxToDelete)
    }
  }
  processTableResponse(response: TableResponse) {
    switch (response.responseType) {
      case 'update':
        this.redirectToUpdate(response.value)
        break
      case 'delete':
        this.taxToDelete = response.value
        this.showModalWarning('El impuesto sera eliminado del sistema y al hacerlo se eliminarán ' +
          'todos los productos asociados al mismo ¿desea continuar?')
        break
    }
  }

  delete(data: Tax,) {
    this.subscriptions.push(this.impuestosSvc.deleteTax(data.tax_id).subscribe({
      next: res => {
        this.msj = res
        this.showModal('Success');
      }
    }))
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }

}
