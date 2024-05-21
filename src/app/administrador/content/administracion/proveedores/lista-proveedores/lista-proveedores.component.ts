import { ChangeDetectionStrategy, Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription} from 'rxjs';
import { Provider, ResponseAlert, TableColumn, TableInfo, TableResponse } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { ProveedoresService } from '../service/proveedores.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-lista-proveedores',
  templateUrl: './lista-proveedores.component.html',
  styleUrls: ['./lista-proveedores.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ListaProveedoresComponent extends DinamicComponent {

  subscriptions:Subscription[]=[]
  providers: Provider[] = [];
  providerToDelete!: Provider;
  tableInfo: TableInfo = {
    tableTitle: 'Proveedores Registrados',
    searchField: 'name_provider',
    enablePagination: true,
    enableSearch:true
  }
  tableColumns: TableColumn[] = [
    { columnLabel: 'Número de documento', definition: ['document_type','document_number'],columnType:'' },
    { columnLabel: 'Nombre del proveedor', definition: ['name_provider'],columnType:'' },
    { columnLabel: 'Dirección', definition: ['address_provider'],columnType:'' },
    { columnLabel: 'Nombre del encargado', definition: ['name_boss'],columnType:'' },
    { columnLabel: 'Télefono', definition: ['phone_number'],columnType:'' },
    { columnLabel: 'Email', definition: ['email'],columnType:'' },
    { columnLabel: '', definition: ['fa fa-arrows-rotate update'],columnType:'update' },
    { columnLabel: '', definition: ['fa fa-trash-can delete'],columnType:'delete' },
  ]

  constructor(protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router,private route:ActivatedRoute,
    private providersSvc: ProveedoresService) {
    super(comunicatorSvc,router)
  }
  ngOnInit() {
    this.setTitleAndIcon(4,"fas fa-clipboard-list fa-fw")
    this.setProviders()
    this.subscribeToAlertResponse()
  }
  setProviders(){
    const data = this.route.snapshot.data;
    if (data['providers']) {
      this.providers = data['providers'];
    }
  }
  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }

  redirectToUpdate(data: Provider) {
    this.router.navigate(['/administrador/administracion/proveedores/actualizar proveedor/'+data.id_provider])
  }
  handleAlertResponse(response:ResponseAlert) {
    if (response.type === 'Warning' && response.response)
      this.deleteProvider(this.providerToDelete)
  }
  
  deleteProvider(data: Provider) {
      this.providersSvc.deleteProvider(data.id_provider).subscribe({
        next: res => {
         this.msj=res
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
        this.providerToDelete = response.value
        this.showModalWarning('El proveedor sera eliminado del sistema y al hacerlo se eliminarán '+
        'todas las compras asociados al mismo ¿desea continuar?')
        break
      
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription)?subscription.unsubscribe():null)
  }
}
