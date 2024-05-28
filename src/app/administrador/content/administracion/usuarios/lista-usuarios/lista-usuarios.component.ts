import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResponseAlert, SignUp, TableColumn, TableInfo, TableResponse, User } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicTable } from 'src/app/utils/DinamicTable';
import { UsuariosService } from '../service/usuarios.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';
import { SessionStorageService } from 'src/app/storage/session-storage.service';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent extends DinamicComponent {

  users: User[] = [];
  userToDelete!: User;
  subscriptions: Subscription[] = []
  tableInfo: TableInfo = {
    tableTitle: 'Usuarios Registrados',
    searchField: 'names_user',
    enablePagination: true,
    enableSearch:true
  }

  tableColumns: TableColumn[] = [
    { columnLabel: 'Número de documento', definition: ['document_type_user', 'document_number_user'], columnType: '' },
    { columnLabel: 'Nombre', definition: ['names_user', 'last_names_user'], columnType: '' },
    { columnLabel: 'Cargo', definition: ['range_user'], columnType: '' },
    { columnLabel: 'Télefono', definition: ['phone_number_user'], columnType: '' },
    { columnLabel: 'Género', definition: ['gander_user'], columnType: '' },
    { columnLabel: 'Estado', definition: ['state_user'], columnType: '' },
    { columnLabel: 'Email', definition: ['email_user'], columnType: '' },
    { columnLabel: '', definition: ['fa fa-arrows-rotate update'], columnType: 'update' },
    { columnLabel: '', definition: ['fa fa-trash-can delete'], columnType: 'delete' },
  ]

  constructor(protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router, private route: ActivatedRoute,
    private usersSvc: UsuariosService,private sessionStorageService:SessionStorageService) {
    super(comunicatorSvc, router)
  }
  ngOnInit() {
    this.setTitleAndIcon(4,"fas fa-clipboard-list fa-fw")
    this.setUsers()
    this.subscribeToAlertResponse()

  }
  setUsers() {
    const data = this.route.snapshot.data;
    if (data['users']) {
      this.users = data['users'];
      this.deleteMyAccountFromList()
    }
  }
  deleteMyAccountFromList() {
    const account = this.sessionStorageService.getItem<SignUp>('user')
    if (account) {
      let indexMyAccount=-1
      const myUser = this.users.find((user) => user.id_user === Number(account.id_user))
      if (myUser)
        indexMyAccount=this.users.indexOf(myUser)
      this.users.splice(indexMyAccount,1)
    }
  }
  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }

  redirectToUpdate(data: User) {
    this.router.navigate(['/administrador/administracion/usuarios/actualizar usuario/' + data.id_user])
  }
  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Warning' && response.response)
      this.deleteUser(this.userToDelete)
  }

  deleteUser(data: User) {
    this.usersSvc.deleteUser(data.id_user).subscribe({
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
        this.userToDelete = response.value
        this.showModalWarning('El usuario sera eliminado del sistema y al hacerlo se eliminarán ' +
          'todas las compras, ventas y devoluciones asociadas al mismo ¿desea continuar?')
        break

    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
