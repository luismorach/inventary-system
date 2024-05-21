import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, map, mergeMap, switchMap, tap } from 'rxjs';
import { CoinsService } from 'src/app/administrador/content/configuraciones/service/coins.service';
import { AlertPay, Currency, Payment, SelectInfo } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayComponent extends DinamicInput {
  selectInfoCurrencies: SelectInfo = {
    label: 'Divisa',
    optionName: ['currency'],
    definitionOption: 'currency_code',
    required: true
  }
  selectInfoPaymentType: SelectInfo = {
    label: 'Tipo de pago',
    optionName: ['option'],
    definitionOption: 'value',
    required: true
  }

  selectOptionsPaymentType = [
    { option: 'Seleccione el tipo de pago', value: '' },
    { option: 'Transacción eléctronica', value: 'Transacción eléctronica' },
    { option: 'Efectivo', value: 'Efectivo' }
  ]
  @Output() messageEvent = new EventEmitter<Payment | boolean>();
  @Input() message: AlertPay = { totalAmount: 0, showAlert: false, totalPaid: 0 };
  formNewPay!: FormGroup
  mainCurrency!: Currency
  currencyPay!: Currency
  currencies!: Currency[]

  constructor(private fb: FormBuilder,
    protected override comunicatorSvc: ComunicatorComponetsService,
    private coinsSvc: CoinsService, private ref: ChangeDetectorRef) {
    super(comunicatorSvc)
  }

  ngOnInit() {
    this.getCurrencies()
    this.initForm()
  }
  initForm() {
    this.formNewPay = this.fb.group({
      type: ['Transacción eléctronica'],
      currency_code: [''],
      mount: ['0'],
      reference: ['']
    });
   
  }
  subcribeToChangeCurrencies(){
    this.formNewPay.controls['currency_code'].valueChanges.subscribe(currency_code=>{
      let currency= this.currencies.find(currency=>currency.currency_code===currency_code)
      if(currency)
        this.currencyPay=currency
    })
  }
getCurrencies() {
  let DefaultCurrency:Currency[]=[{currency_code:'',currency:'Seleccione la divisa',country_code:'',
  country:'',language:'',language_code:'',exchange:0}]
  this.coinsSvc.getMainCurrency().pipe(
    tap((MainCoin) => {
      this.mainCurrency = MainCoin[0];
      this.currencyPay = MainCoin[0];
      this.formNewPay.get('currency_code')?.setValue(MainCoin[0].currency_code);
    }),
    switchMap((MainCoin) => this.coinsSvc.getsecondariesCoins().pipe(
      map((res) => DefaultCurrency.concat(MainCoin.concat(res)))
    ))
  ).subscribe({
    next:currencies=>this.currencies=currencies,
    complete:()=>this.subcribeToChangeCurrencies()
  });
}

  acceptPay() {
      let pay: Payment = this.formNewPay.value
      if (pay.type === 'Efectivo') {
        pay.reference = null
      }
      const exchange = this.currencyPay.exchange
      pay.exchange = exchange
      pay.currency = this.currencyPay
      const convertedAmount = this.comunicatorSvc.converterToMainCoin(this.formNewPay.get('mount')?.value, exchange)
      this.message.totalPaid += convertedAmount
      this.messageEvent.emit(pay);

      console.log(this.message.totalPaid)
      this.clearFormFields()
  }
  clearFormFields(){
    this.formNewPay.get('mount')?.setValue('0')
    this.formNewPay.get('reference')?.setValue('')
    this.formNewPay.get('type')?.setValue('Transacción eléctronica')
    this.ref.detectChanges()
  }

  cancel() {
    this.messageEvent.emit(false);
  }
  validarPago() {
    let result = { isValid: true, msj: '' }
    if (Number(this.formNewPay.get('mount')?.value) === 0) {
      result = { isValid: false, msj: 'El monto pagado por el cliente no puede ser 0' }
    } else if (this.formNewPay.get('type')?.value.includes('Transacción')) {
      if (Number(this.formNewPay.get('mount')?.value) > Number((this.comunicatorSvc.converter(
        this.message.totalAmount, this.mainCurrency, this.currencyPay) -
        this.comunicatorSvc.converter(this.message.totalPaid, this.mainCurrency, this.currencyPay)).toFixed(2))) {
        result = { isValid: false, msj: 'El monto pagado por el cliente no puede ser mayor al total a pagar' }
      } else if (this.formNewPay.get('reference')?.value === '') {
        result = { isValid: false, msj: 'Debe ingresar la referencia del pago realizado' }
      }
    }
    return result
  }
}
