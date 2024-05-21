import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Currency, ResponseAlert } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { CoinsService } from '../../service/coins.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-nueva-moneda',
  templateUrl: './nueva-moneda.component.html',
  styleUrls: ['./nueva-moneda.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NuevaMonedaComponent extends DinamicComponent {

  newCoin!: FormGroup;
  usedClass: string[] = [];
  ruta!: string;
  data!: Subscription
  coinToUpdate!: Currency
  subscriptions: Subscription[] = []
  type: string = ''
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
    protected renderer: Renderer2,
    private coinSvc: CoinsService, private ref: ChangeDetectorRef) {
    super(comunicatorSvc, router);

  }

  ngOnInit() {
    this.setTitleAndIcon(3, "fas fa-coins fa-fw")
    this.initForm()
    this.setCurrency()
    this.subscribeToAlertResponse()
  }

  initForm() {
    this.newCoin = this.fb.group({
      country: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\u00C0-\u017F\s]+$/),Validators.maxLength(15)]],
      country_code: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\u00C0-\u017F]+$/),Validators.maxLength(8)]],
      language: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\u00C0-\u017F]+$/),Validators.maxLength(15)]],
      language_code: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\u00C0-\u017F]+$/),Validators.maxLength(8)]],
      currency: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\u00C0-\u017F]+$/),Validators.maxLength(15)]],
      currency_code: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\u00C0-\u017F]+$/),Validators.maxLength(8)]],
    })
  }
  setCurrency() {
    if (this.route.snapshot.data['currency']) {
      this.coinToUpdate = this.route.snapshot.data['currency'][0]
      this.newCoin.get('country')?.setValue(this.coinToUpdate.country)
      this.newCoin.get('country_code')?.setValue(this.coinToUpdate.country_code)
      this.newCoin.get('language')?.setValue(this.coinToUpdate.language)
      this.newCoin.get('language_code')?.setValue(this.coinToUpdate.language_code)
      this.newCoin.get('currency')?.setValue(this.coinToUpdate.currency)
      this.newCoin.get('currency_code')?.setValue(this.coinToUpdate.currency_code)
    }
  }
  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }

  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Success' && this.type === 'update')
      this.redirectToListcoin()

    if (response.type === 'Warning' && response.response) {
      const action: { [key: string]: any } = {
        create: this.submit,
        update: this.update
      }
      const handler = action[this.type].bind(this)
      handler()

    }
  }
  submit() {
    this.coinSvc.setCurrency(this.newCoin.value).subscribe(this.responseServer)
  }
  validateUpdate() {
    let result = { isValid: true, msj: '' }
    if (this.newCoin.get('country')?.value === this.coinToUpdate.country &&
      this.newCoin.get('country_code')?.value === this.coinToUpdate.country_code &&
      this.newCoin.get('language')?.value === this.coinToUpdate.language &&
      this.newCoin.get('language_code')?.value === this.coinToUpdate.language_code &&
      this.newCoin.get('currency')?.value === this.coinToUpdate.currency &&
      this.newCoin.get('currency_code')?.value === this.coinToUpdate.currency_code) {
      result = { isValid: false, msj: 'No ha modificado los datos' }
    }
    if (this.newCoin.invalid) {
      result = { isValid: false, msj: 'Existen datos invalidos' }
    }
    return result
  }

  clean() {
    this.newCoin.reset();
  }
  update() {
    this.coinSvc.updateCurrency(this.coinToUpdate, this.newCoin.value)
      .subscribe(this.responseServer)
  }

  redirectToListcoin() {
    this.router.navigate(['/administrador/configuraciones/lista monedas'])
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
