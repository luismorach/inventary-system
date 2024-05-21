import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Register, ResponseAlert, ValidationResult, SelectInfo } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { UsuariosService } from '../service/usuarios.service';
import { CajasService } from '../../cajas/service/cajas.service';
import { Subscription } from 'rxjs';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent extends DinamicComponent {
  formNewUser!: FormGroup;
  id_user!: number;
  userToUpdate!: User
  registers!: Register[]
  type: string = ''
  subscriptions: Subscription[] = []
  @Input() account!: User
  @Input() isOpenModal!: User
  selectInfoTypeDocument: SelectInfo = {
    label: 'Tipo de documento',
    optionName: ['option'],
    definitionOption: 'value',
    required: true
  }
  selectOptionsTypeDocument = [
    { option: 'Seleccione el tipo de documento', value: '' },
    { option: 'V-', value: 'V-' },
    { option: 'E-', value: 'E-' },
    { option: 'P-', value: 'P-' },
    { option: 'J-', value: 'J-' },
    { option: 'G-', value: 'G-' }
  ]
  selectInfoRange: SelectInfo = {
    label: 'Cargo',
    optionName: ['option'],
    definitionOption: 'value',
    required: true
  }
  selectOptionsRange = [
    { option: 'Seleccione el cargo del usuario', value: '' },
    { option: 'Administrador', value: 'Administrador' },
    { option: 'Cajero', value: 'Cajero' },
  ]
  selectInfoCashRegister: SelectInfo = {
    label: 'Caja',
    optionName: ['name_register'],
    definitionOption: 'id_register',
    required: true
  }
  selectInfoState: SelectInfo = {
    label: 'Estado de la cuenta',
    optionName: ['option'],
    definitionOption: 'value',
    required: true
  }
  selectOptionsState = [
    { option: 'Seleccione el estado del usuario', value: '' },
    { option: 'Habilitado', value: 'Habilitado' },
    { option: 'Deshabilitado', value: 'Deshabilitado' }
  ]
  handleServerResponse = {
    next: (res: any) => {
      this.msj = res
      this.showModal('Success');
    }
  }

  constructor(private fb: FormBuilder,
    protected override router: Router,
    protected override comunicatorSvc: ComunicatorComponetsService,
    private route: ActivatedRoute,
    private usersSvc: UsuariosService,
    private cajasSvc: CajasService,
    private changeDetectorRef: ChangeDetectorRef) {
    super(comunicatorSvc, router);
  }
  ngOnChanges(changes: SimpleChanges) {
    //comprueba si el componente recibe una cuenta para ser actualizado
    if (changes['account'] && this.formNewUser) {
      this.userToUpdate = this.account
      this.setValuesForm()
    }
    //comprueba si el componente es abierto en forma de modal
    if (changes['isOpenModal'] && this.formNewUser) {
      this.setOrClearSubscriptionAlertIfOpen(changes['isOpenModal'].currentValue)
    }
  }
  setOrClearSubscriptionAlertIfOpen(isOpen: boolean) {
    if (isOpen) {
      this.subscriptions.push(this.comunicatorSvc.getResponseAlert()
        .subscribe(res => this.handleAlertResponse(res)))
    } else {
      this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
      this.cleanUpdateAccount()
    }
  }
  ngOnInit() {
    if(!this.isOpenModal)
      this.setTitleAndIcon(4,"fa fa-user-tie fa-fw" )
    this.initForm()
    this.setUser()
    this.subscribeToAlertResponse()
   
  }

  initForm() {
    this.formNewUser = this.fb.group({
      document_type_user: ['', [Validators.required]],
      document_number_user: ['', [Validators.required, 
        Validators.pattern(/^[0-9]+$/), Validators.maxLength(20)]],
      names_user: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ \u00f1\u00d1]+$/),Validators.maxLength(30)]],
      last_names_user: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ \u00f1\u00d1]+$/),Validators.maxLength(30)]],
      range_user: [''],
      phone_number_user: ['', [Validators.pattern(/^[0-9]+$/),Validators.maxLength(15)]],
      id_register: [-1],
      gander_user: ['Masculino'],
      state_user: [''],
      current_password: ['',Validators.maxLength(20)],
      password_user: ['', [Validators.required,Validators.maxLength(20)]],
      repeat_password_user: ['', [Validators.required,Validators.maxLength(20)]],
      email_user: ['', [Validators.email]],
    })
    this.formNewUser.get('repeat_password_user')?.setValidators(
      [this.equalsValidator(this.formNewUser, 'password_user'),Validators.required,Validators.maxLength(20)])
    this.formNewUser.get('password_user')?.setValidators(
      [this.equalsValidator(this.formNewUser, 'repeat_password_user'),Validators.required,Validators.maxLength(20)])

      this.formNewUser.controls['range_user'].valueChanges.subscribe(() => this.changeRange())
  }

  setUser() {
    const userData = this.route.snapshot.data['user'];
    if (userData) {
      this.userToUpdate = userData[0];
      this.setValuesForm();
    }
  }


  setValuesForm() {
    const formControls = this.formNewUser.controls;
    const userToUpdate = this.userToUpdate;

    formControls['range_user'].setValue(userToUpdate.range_user);
    this.changeRange();
    formControls['document_type_user'].setValue(userToUpdate.document_type_user);
    formControls['document_number_user'].setValue(userToUpdate.document_number_user);
    formControls['names_user'].setValue(userToUpdate.names_user);
    formControls['last_names_user'].setValue(userToUpdate.last_names_user);
    formControls['state_user'].setValue(userToUpdate.state_user);
    formControls['gander_user'].setValue(userToUpdate.gander_user);
    formControls['phone_number_user'].setValue(userToUpdate.phone_number_user);
    formControls['email_user'].setValue(userToUpdate.email_user);
    formControls['id_register'].setValue(userToUpdate.id_register);

    const urlSplit = this.router.url.split('/');
    console.log(urlSplit)
    if (urlSplit[4] && urlSplit[4].includes('usuario')) {
      formControls['password_user'].clearValidators();
      formControls['repeat_password_user'].clearValidators();
      this.disableControls();
    }

    if (this.account || urlSplit[4].includes('cuenta')) {
      formControls['current_password'].setValidators([Validators.required]);
      formControls['state_user'].disable();
      formControls['range_user'].disable();
    }
  }
  subscribeToAlertResponse() {
    if (this.isOpenModal === undefined) {
      this.subscriptions.push(
        this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
      );
    }
  }
  disableControls() {
    const formControls = this.formNewUser.controls;
    ['document_type_user', 'document_number_user', 'names_user', 'last_names_user',
      'gander_user', 'phone_number_user', 'email_user'].forEach(controlName => {
        formControls[controlName]?.disable();
      });
  }

  changeRange() {
    if (this.formNewUser.get('range_user')?.value.includes('Cajero')) {
      this.cajasSvc.getRegisters().subscribe(res => {
        this.registers = [{ name_register: 'Seleccione la caja del usuario', state_register: '', id_register: -1}].concat(res)
        this.changeDetectorRef.detectChanges()
      })
        
      this.formNewUser.get('id_register')?.setValidators(Validators.min(0))
      this.formNewUser.get('id_register')?.setValue( -1)
    } else {
      this.formNewUser.get('id_register')?.clearValidators()
      this.formNewUser.get('id_register')?.setValue(0)
    }
  }

  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Success' && this.type === 'update' && this.title[1].includes('USUARIO'))
      this.redirectToListUsers()
    if (response.type === 'Success' && this.type === 'update' &&
      (this.title[1].includes('CUENTA') || this.account))
      this.cleanUpdateAccount()
    if (response.type === 'Success' && this.type === 'create')
      this.clearFormFields()
    if (response.type === 'Warning' && response.response) {
      const action: { [key: string]: any } = {
        create: this.createUser,
        update: this.updateUser
      }
      const handler = action[this.type].bind(this)
      handler()
    }
  }
  createUser() {
    console.log(this.formNewUser.value)
    this.usersSvc.setUser(this.formNewUser.value).subscribe(this.handleServerResponse)
  }
  updateUser() {
    if (this.account || this.router.url.includes('cuenta')) {
      this.usersSvc.updateAccount(Number(this.userToUpdate.id_user),
        this.formNewUser.value).subscribe(this.handleServerResponse)
    } else {
      this.usersSvc.updateUser(Number(this.userToUpdate.id_user),
        this.formNewUser.value).subscribe(this.handleServerResponse)
    }
  }

  validateUpdate(): ValidationResult {

    let validationResult: ValidationResult = { isValid: true, message: '' };
    const userValues: any = this.userToUpdate;
    const keysToCheck=['document_type_user','document_number_user','names_user','last_names_user',
    'range_user','state_user','gander_user','id_register','phone_number_user','email_user'
    ]
    const isDataModified = keysToCheck.some(key =>
      this.formNewUser.get(key)?.value != userValues[key]
    );

    if (!isDataModified) {
      validationResult = { isValid: false, message: 'No ha modificado los datos' };
    }

    if ((this.router.url.includes('cuenta') || this.account) &&
      this.formNewUser.get('current_password')?.value !== '' &&
      this.formNewUser.get('password_user')?.value !== '' &&
      this.formNewUser.get('repeat_password')?.value !== '') {
      validationResult = { isValid: true, message: '' };
    }

    if (this.formNewUser.invalid) {
      validationResult = { isValid: false, message: 'Existen datos invalidos' };
    }

    return validationResult
  }

  redirectToListUsers() {
    this.router.navigate(['/administrador/administracion/usuarios/lista usuarios'])
  }

  clearFormFields() {
    this.formNewUser.reset({
      document_type_user: '',
      range_user:'',
      state_user:'',
      id_client:-1,
      gander_user:'Masculino'
    });
    this.type = '';
    this.changeDetectorRef.detectChanges()
  }
  cleanUpdateAccount() {
    this.formNewUser.patchValue({
      current_password: '',
      repeat_password_user: '',
      password_user: ''
    });
    this.formNewUser.markAsUntouched();
    this.formNewUser.markAsPristine();
    this.type = '';
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
