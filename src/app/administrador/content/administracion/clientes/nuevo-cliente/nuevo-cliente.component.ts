import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, ResponseAlert, SelectInfo, ValidationResult } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { ClientesService } from '../service/clientes.service';
import { Subscription } from 'rxjs';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NuevoClienteComponent extends DinamicComponent {

  formNewClient!: FormGroup;
  id_client!: number;
  subscriptions: Subscription[] = []
  clientToUpdate!: Client
  type: string = ''
  
  selectInfo: SelectInfo = {
    label: 'Tipo de documento',
    optionName:['option'],
    definitionOption: 'value',
    required: true
  }
  selectOptions = [
    { option: 'Seleccione el tipo de documento', value: '' },
    { option: 'V-', value: 'V-' },
    { option: 'E-', value: 'E-' },
    { option: 'P-', value: 'P-' },
    { option: 'J-', value: 'J-' },
    { option: 'G-', value: 'G-' }
  ]
  handleServerResponse = {
    next: (res: any) => {
      let aux: any = res
      this.formNewClient.get('id_client')?.setValue(aux.id_client)
      this.msj = res
      this.showModal('Success');
    }
  }

  @Output() messageEvent = new EventEmitter<Client>();
  @Input() isOpenModal!: boolean
  constructor(private fb: FormBuilder,
    protected override router: Router,
    protected override comunicatorSvc: ComunicatorComponetsService,
    private route: ActivatedRoute,
    private clientesSvc: ClientesService,
  private ref:ChangeDetectorRef) {
    super(comunicatorSvc, router);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpenModal'] && this.formNewClient) {
      this.setOrClearSubscriptionAlertIfOpen(changes['isOpenModal'].currentValue)
    }
  }
  setOrClearSubscriptionAlertIfOpen(isOpen: boolean) {
    if (isOpen) {
      this.subscriptions.push(this.comunicatorSvc.getResponseAlert()
        .subscribe(res => this.handleAlertResponse(res)))
    } else {
      this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
      this.clearFormFields()
    }
  }

  ngOnInit() {
    if(!this.isOpenModal)
        this.setTitleAndIcon(4,"fa fa-child fa-fw")
    this.initForm()
    this.setClient()
    this.subscribeToAlertResponse()
  }

  initForm() {
    const controlConfig = {
      id_client: [0],
      document_type_client: ['',  [Validators.required]],
      document_number_client: ['',  [Validators.required, Validators.pattern(/^[0-9]+$/),Validators.maxLength(20)]],
      names_client: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ \u00f1\u00d1]+$/),Validators.maxLength(30)]],
      last_names_client: ['',  [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ \u00f1\u00d1]+$/),Validators.maxLength(30)]],
      state_client: ['', [Validators.pattern(/^[a-zA-ZÀ-ÿ \u00f1\u00d1]+$/),Validators.maxLength(50)]],
      city_client: ['', [Validators.pattern(/^[a-zA-ZÀ-ÿ \u00f1\u00d1]+$/),Validators.maxLength(50)]],
      street_client: ['',  [Validators.pattern(/^[a-zA-ZÀ-ÿ \u00f1\u00d1]+$/),Validators.maxLength(50)]],
      phone_number_client: ['',  [Validators.pattern(/^[0-9]+$/),Validators.maxLength(15)]],
      email_client: ['', [Validators.email]],
    };
    this.formNewClient = this.fb.group(controlConfig);
  }
  setClient() {
    const clientToUpdate = this.route.snapshot.data['client']?.[0];
    this.clientToUpdate = clientToUpdate
    if (clientToUpdate) {
      const formControls = this.formNewClient.controls;
      Object.keys(clientToUpdate).forEach(key => {
        if (formControls[key]) {
          formControls[key].setValue(clientToUpdate[key]);
        }
      });
    }
  }
  
  subscribeToAlertResponse() {
    if (this.isOpenModal === undefined) {
      this.subscriptions.push(
        this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
      );
    }
  }

  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Success' && this.type === 'update')
      this.redirectToListClients()

    if (response.type === 'Success' && this.type === 'create') {
      let client: Client = this.formNewClient.value
      this.messageEvent.emit(client);
      this.clearFormFields()
    }
    if (response.type === 'Warning' && response.response) {
      const action: { [key: string]: any } = {
        create: this.createClient,
        update: this.updateClient
      }
      const handler = action[this.type].bind(this)
      handler()
    }
  }
  createClient() {
    this.clientesSvc.setClient(this.formNewClient.value).subscribe(this.handleServerResponse)
  }

  updateClient() {
    this.clientesSvc.updateClient(this.clientToUpdate.id_client,
      this.formNewClient.value).subscribe(this.handleServerResponse)
  }
  validateUpdate(): ValidationResult {
    let validationResult: ValidationResult = { isValid: true, message: '' };
    const formValues = this.formNewClient.value;
    const clientValues: any = this.clientToUpdate;

    const keysToCheck = ['document_type_client', 'document_number_client', 'names_client', 'last_names_client',
      'state_client', 'city_client', 'street_client', 'phone_number_client', 'email_client'];

    const isSame = keysToCheck.every(key => formValues[key] == clientValues[key]);
    if (isSame) {
      validationResult = { isValid: false, message: 'No ha modificado los datos' };
    }

    if (this.formNewClient.invalid) {
      validationResult = { isValid: false, message: 'Existen datos inválidos' };
    }

    return validationResult

  }

  redirectToListClients() {
    this.router.navigate(['/administrador/administracion/clientes/lista clientes'])
  }
  clearFormFields() {
     this.formNewClient.reset({
      document_type_client: '',
    });
    this.type = '';
    this.ref.detectChanges()
    

  }
 
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
