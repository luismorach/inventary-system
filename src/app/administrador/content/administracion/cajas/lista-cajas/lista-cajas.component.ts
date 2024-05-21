import { ChangeDetectionStrategy,Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Register, ResponseAlert, TableColumn, TableInfo, TableResponse } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { CajasService } from '../service/cajas.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-lista-cajas',
  templateUrl: './lista-cajas.component.html',
  styleUrls: ['./lista-cajas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaCajasComponent extends DinamicComponent{

  registers: Register[] = [];
  registerToDelete!: Register
  subscriptions: Subscription[] = []
  tableInfo:TableInfo={
    tableTitle:'Cajas Registradas',
    searchField:'name_register',
    enablePagination:true,
    enableSearch:true
  }
  tableColumns: TableColumn[] = [
    { columnLabel: 'Nombre de la caja', definition: ['name_register'],columnType:'' },
    { columnLabel: 'Estado', definition: ['state_register'],columnType:'' },
    { columnLabel: '', definition: ['fa fa-arrows-rotate update'],columnType:'update' },
    { columnLabel: '', definition: ['fa fa-trash-can delete'],columnType:'delete' }
  ]

  constructor(protected override comunicatorSvc: ComunicatorComponetsService, 
    protected override router: Router,
    private cajasSvc: CajasService,
    private route: ActivatedRoute) {
      super(comunicatorSvc,router)
  }
  ngOnInit() {
    this.setTitleAndIcon(4,"fas fa-clipboard-list fa-fw")
    this.setRegisters()
    this.subscribeToAlertResponse()
  }
 
  setRegisters(): void {
    const data = this.route.snapshot.data;
    if (data['registers']) {
      this.registers = data['registers'];
    }
  }
  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }

  redirectToUpdate(data: Register) {
    this.router.navigate(['/administrador/administracion/cajas/actualizar caja/' + data.id_register])
  }
  handleAlertResponse(alert: ResponseAlert) {
    if (alert.type === 'Warning' && alert.response) {
      this.deleteRegister(this.registerToDelete);
    }
  }

  deleteRegister(register: Register) {
    this.cajasSvc.deleteRegister(register.id_register).subscribe({
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
        this.registerToDelete = response.value
        this.showModalWarning('La caja sera eliminada del sistema y al hacerlo se eliminarán' +
          'todos los usuarios asociados a la misma ¿desea continuar?', true)
        break
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}

