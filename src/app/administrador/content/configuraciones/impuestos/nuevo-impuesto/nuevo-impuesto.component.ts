import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, } from 'rxjs';
import { ResponseAlert, Tax } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { ImpuestosService } from '../../service/impuestos.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-nuevo-impuesto',
  templateUrl: './nuevo-impuesto.component.html',
  styleUrls: ['./nuevo-impuesto.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NuevoImpuestoComponent extends DinamicComponent {

  newTax!: FormGroup;
  taxToUpdate!: Tax
  data!: Subscription
  type: string = ''
  subscriptions: Subscription[] = []
  responseServer = {
    next: (res: any) => {
      this.msj = res
      this.showModal('Success');
      this.clean()
      this.ref.detectChanges()
    }
  }

  constructor(private fb: FormBuilder,
    protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router, private route: ActivatedRoute, 
    private ref: ChangeDetectorRef,
    private impuestosSvc: ImpuestosService) {
    super(comunicatorSvc, router);
  }

  ngOnInit() {
    this.setTitleAndIcon(3, "fa-solid fa-landmark")
    this.initForm()
    this.setTax()
    this.subscribeToAlertResponse()
  }
  initForm() {
    this.newTax = this.fb.group({
      tax_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 \u00C0-\u017F]+$/),,Validators.maxLength(20)]],
      tax_rate: ['', [Validators.required,Validators.maxLength(6), Validators.pattern(/^[0-9.]+$/),this.percentValidator()]],
      show_tax: ['Si']
    })
  }
  setTax() {
    const tax = this.route.snapshot.data['tax']?.[0];
    if (tax) {
      const { tax_name, tax_rate, show_tax } = tax;
      this.taxToUpdate = tax;
      this.newTax.patchValue({ tax_name, tax_rate: tax_rate * 100, show_tax });
    }
  }

  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }

  submit() {
    let tax: Tax = this.newTax.value
    tax.tax_rate = tax.tax_rate / 100
    this.impuestosSvc.setTax(tax).subscribe(this.responseServer)
  }
  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Success' && this.type === 'update')
      this.redirectToListTaxs()

    if (response.type === 'Warning' && response.response) {
      const action: { [key: string]: any } = {
        create: this.submit,
        update: this.update
      }
      const handler = action[this.type].bind(this)
      handler()

    }
  }

  validateUpdate() {
    let result = { isValid: true, msj: '' }
    if (this.newTax.get('tax_name')?.value === this.taxToUpdate.tax_name &&
      this.newTax.get('tax_rate')?.value === this.taxToUpdate.tax_rate &&
      this.newTax.get('show_tax')?.value === this.taxToUpdate.show_tax) {
      result = { isValid: false, msj: 'No ha modificado los datos' }
    }
    if (this.newTax.invalid) {
      result = { isValid: false, msj: 'Existen datos invalidos' }
    }
    return result
  }

clean() {
    this.newTax.reset({show_tax:'Si'})
  }
  update() {
    let tax: Tax = this.newTax.value
    tax.tax_rate = tax.tax_rate / 100
    this.impuestosSvc.updateTax(Number(this.taxToUpdate.tax_id),
      tax).subscribe(this.responseServer)
  }

  redirectToListTaxs() {
    this.router.navigate(['/administrador/configuraciones/lista impuestos'])
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
