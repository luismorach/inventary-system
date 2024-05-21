import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Provider, ResponseAlert, SelectInfo, ValidationResult } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { ProveedoresService } from '../service/proveedores.service';
import { Subscription } from 'rxjs';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-nuevo-proveedor',
  templateUrl: './nuevo-proveedor.component.html',
  styleUrls: ['./nuevo-proveedor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NuevoProveedorComponent extends DinamicComponent {

  formNewProvider!: FormGroup;
  subscriptions: Subscription[] = []
  providerToUpdate!: Provider
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
      this.msj = res
      this.showModal('Success');
     
    }
  }

  constructor(private fb: FormBuilder,
    protected override router: Router,
    protected override comunicatorSvc: ComunicatorComponetsService,
    private route: ActivatedRoute,
    private providersSvc: ProveedoresService,
    private changeDetectorRef: ChangeDetectorRef) {
    super(comunicatorSvc, router);
  }

  ngOnInit() {
    this.setTitleAndIcon(4,"fa fa-shipping-fast fa-fw")
    this.initForm()
    this.setProvider()
    this.subscribeToAlertResponse()
  }
  initForm() {
    this.formNewProvider = this.fb.group({
      document_type: ['', Validators.required],
      document_number: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(20)]],
      name_provider: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ \u00f1\u00d1]+$/),Validators.maxLength(30)]],
      address_provider: ['', [Validators.pattern(/^[a-zA-ZÀ-ÿ \u00f1\u00d1]+$/),Validators.maxLength(50)]],
      name_boss: ['', [Validators.pattern(/^[a-zA-ZÀ-ÿ \u00f1\u00d1]+$/),Validators.maxLength(30)]],
      phone_number: ['', [Validators.pattern(/^[0-9]+$/),Validators.maxLength(15)]],
      email: ['', Validators.email],
    });
  }
  setProvider() {
    const providerToUpdate = this.route.snapshot.data['provider']?.[0];
    if (providerToUpdate) {
      this.providerToUpdate = providerToUpdate
      const formControls = this.formNewProvider.controls;
      Object.keys(providerToUpdate).forEach(key => {
        if (formControls[key]) {
          formControls[key].setValue(providerToUpdate[key]);
        }
      });
    }
  }
  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }



  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Success' && this.type === 'update')
      this.redirectToListProviders()

    if (response.type === 'Warning' && response.response) {
      const action: { [key: string]: any } = {
        create: this.createProvider,
        update: this.updateProvider
      }
      const handler = action[this.type].bind(this)
      handler()
    }
  }
  createProvider() {
    this.providersSvc.setProvider(this.formNewProvider.value).subscribe(this.handleServerResponse)
    this.clearFormFields()
  }
  updateProvider() {
    this.providersSvc.updateProvider(Number(this.providerToUpdate.id_provider),
      this.formNewProvider.value).subscribe(this.handleServerResponse)
  }
  validateUpdate(): ValidationResult {
    let validationResult: ValidationResult = { isValid: true, message: '' };
    const formValues = this.formNewProvider.value;
    const providerValues: any = this.providerToUpdate;

    const keysToCheck = ['document_type', 'document_number', 'name_provider', 'address_provider',
      'name_boss', 'phone_number', 'email'];

    const isSame = keysToCheck.every(key => formValues[key] == providerValues[key]);
    if (isSame) {
      validationResult = { isValid: false, message: 'No ha modificado los datos' };
    }

    if (this.formNewProvider.invalid) {
      validationResult = { isValid: false, message: 'Existen datos invalidos' };
    }

    return validationResult;

  }

  redirectToListProviders() {
   
    this.router.navigate(['/administrador/administracion/proveedores/lista proveedores'])
  }
  clearFormFields() {
    this.formNewProvider.reset({
      document_type: '',
    });
    this.type = '';
    this.changeDetectorRef.detectChanges()
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
