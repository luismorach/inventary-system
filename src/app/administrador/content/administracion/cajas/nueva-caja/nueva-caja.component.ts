import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { CajasService } from '../service/cajas.service';
import { Register, ResponseAlert, SelectInfo, ValidationResult } from 'src/app/interfaces/interfaces';
import { Subscription } from 'rxjs';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-nueva-caja',
  templateUrl: './nueva-caja.component.html',
  styleUrls: ['./nueva-caja.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NuevaCajaComponent extends DinamicComponent{

  newRegister!: FormGroup;
  registerToUpdate!: Register
  type: string = ''
  subscriptions: Subscription[] = []
  
  selectInfo: SelectInfo = {
    label: 'Estado de la caja',
    optionName:['option'],
    definitionOption: 'value',
    required: true
  }
  selectOptions = [
    { option: 'Seleccione el estado de la caja', value: '' },
    { option: 'Habilitada', value: 'Habilitada' },
    { option: 'Deshabilitada', value: 'Deshabilitada' }
  ]
  handleServerResponse = {
    next: (res: any) => {
      this.msj = res
      this.showModal('Success')
      this.clearFormFields()
    }
  }
  constructor(private fb: FormBuilder, 
    protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router, private route: ActivatedRoute,
    private cashierService: CajasService,
    private changeDetertorRef:ChangeDetectorRef) {
    super(comunicatorSvc,router);

  }

  ngOnInit() {
    this.setTitleAndIcon(4,"fa-solid fa-cash-register fa-fw")
    this.initForm()
    this.setRegister()
    this.subscribeToAlertResponse()
  }

initForm() {
  this.newRegister = this.fb.group({
    name_register: ['',  [Validators.required,Validators.pattern(/^[a-zA-ZÀ-ÿ 0-9\u00f1\u00d1]+$/),
       Validators.maxLength(30)]],
    state_register: ['',[Validators.required]],
  });
}
  setRegister() {
    if (this.route.snapshot.data['register']) {
      this.registerToUpdate = this.route.snapshot.data['register'][0]
      this.newRegister.get('name_register')?.setValue(this.registerToUpdate.name_register)
      this.newRegister.get('state_register')?.setValue(this.registerToUpdate.state_register)
    }
  }
  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }
  
  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Success' && this.type === 'update')
      this.redirectToRegisterList()

    if (response.type === 'Warning' && response.response) {
      const action: { [key: string]: any } = {
        create: this.createCashRegister,
        update: this.updateCashRegister
      }
      const handler = action[this.type].bind(this)
      handler()
    }
  }
  createCashRegister() {
    this.cashierService.setRegister(this.newRegister.value).subscribe(this.handleServerResponse)
  }
  updateCashRegister() {
    const id = Number(this.registerToUpdate.id_register);
    const updatedValue = this.newRegister.value;

    this.cashierService.updateRegister(id, updatedValue).subscribe(this.handleServerResponse);
  }
  validateUpdate(): ValidationResult {
    let validationResult: ValidationResult = { isValid: true, message: '' };

    const nameRegisterValue = this.newRegister.get('name_register')?.value;
    const stateRegisterValue = this.newRegister.get('state_register')?.value;

    if (nameRegisterValue === this.registerToUpdate.name_register &&
      stateRegisterValue === this.registerToUpdate.state_register) {
      validationResult = { isValid: false, message: 'No ha modificado los datos' };
    }

    if (this.newRegister.invalid) {
      validationResult = { isValid: false, message: 'Existen datos inválidos' };
    }

    return validationResult;
  }

  clearFormFields() {
    this.newRegister.reset({state_register:''})
    this.changeDetertorRef.detectChanges()
  }

  redirectToRegisterList() {
    this.router.navigate(['/administrador/administracion/cajas/lista cajas'])
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
