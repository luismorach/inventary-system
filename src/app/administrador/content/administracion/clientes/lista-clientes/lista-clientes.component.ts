import { ChangeDetectionStrategy, Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Client, ResponseAlert, TableColumn, TableInfo, TableResponse } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { ClientesService } from '../service/clientes.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ListaClientesComponent extends DinamicComponent {
  clients: Client[] = [];
  clientToDelete!: Client;
  subscriptions: Subscription[] = []
  tableInfo: TableInfo = {
    tableTitle: 'Clientes Registrados',
    searchField: 'names_client',
    enablePagination: true,
    enableSearch:true
  }
  tableColumns: TableColumn[] = [
    { columnLabel: 'Documento', definition: ['document_type_client', 'document_number_client'], columnType: '' },
    { columnLabel: 'Nombre', definition: ['names_client', 'last_names_client'], columnType: '' },
    { columnLabel: 'Dirección', definition: ['city_client', 'state_client', 'street_client'], columnType: '' },
    { columnLabel: 'Télefono', definition: ['phone_number_client'], columnType: '' },
    { columnLabel: 'Email', definition: ['email_client'], columnType: '' },
    { columnLabel: '', definition: ['fa fa-arrows-rotate update'], columnType: 'update' },
    { columnLabel: '', definition: ['fa fa-trash-can delete'], columnType: 'delete' },
  ]

  constructor(protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router, private route: ActivatedRoute,
    private clienteSvc: ClientesService) {
    super(comunicatorSvc, router)
  }
  ngOnInit() {
    this.setTitleAndIcon(4,"fas fa-clipboard-list fa-fw")
    this.setClients()
    this.subscribeToAlertResponse()
  }
  setClients(): void {
    const data = this.route.snapshot.data;
    if (data['clients']) {
      this.clients = data['clients'];
    }
  }
  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }

  redirectToUpdate(data: Client) {
    this.router.navigate(['/administrador/administracion/clientes/actualizar cliente/' + data.id_client])
  }
  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Warning' && response.response)
      this.deleteClient(this.clientToDelete)
  }

  deleteClient(data: Client) {
    this.clienteSvc.deleteClient(data.id_client).subscribe({
      next: res => {
        this.msj = res
        this.showModal('Success')
      }
    })
  }
  processTableResponse(response: TableResponse) {
    switch (response.responseType) {
      case 'update':
        this.redirectToUpdate(response.value)
        break
      case 'delete':
        this.clientToDelete = response.value
        this.showModalWarning('El cliente sera eliminado del sistema y al hacerlo se eliminarán '+
        'todas las ventas asociadas al mismo ¿desea continuar?')
        break
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
