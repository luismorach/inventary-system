import { ChangeDetectionStrategy, ChangeDetectorRef, Component, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Building, Currency, ResponseAlert, SelectInfo } from 'src/app/interfaces/interfaces';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { EmpresaService } from '../service/empresa.service';
import { CoinsService } from '../service/coins.service';
import { Subscription, } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-datos-de-la-empresa',
  templateUrl: './datos-de-la-empresa.component.html',
  styleUrls: ['./datos-de-la-empresa.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatosDeLaEmpresaComponent extends DinamicInput {
  formBuilding!: FormGroup;
  building!: Building;
  allCurrencies: Currency[] = []
  secondariesCoins: Currency[] = []
  auxSecondariesCoins: Currency[] = []
  secondaryCoin?: Currency
  mainCoin?: Currency
  auxMainCoin?: Currency
  type: string = ''
  subscriptions: Subscription[] = []
  selectInfoCurrencies: SelectInfo = {
    label: 'seleccione la moneda principal',
    optionName: ['currency'],
    definitionOption: 'currency_code',
    required: true
  }
  selectInfoSecondariesCurrencies: SelectInfo = {
    label: 'seleccione las monedas secundarias',
    optionName: ['currency'],
    definitionOption: 'currency_code',
    required: false
  }

  selectInfoDocument: SelectInfo = {
    label: 'Tipo de documento',
    optionName: ['option'],
    definitionOption: 'value',
    required: true
  }
  selectOptionsDocument = [
    { option: 'Seleccione el tipo de documento', value: '' },
    { option: 'V-', value: 'V-' },
    { option: 'E-', value: 'E-' },
    { option: 'P-', value: 'P-' },
    { option: 'J-', value: 'J-' },
    { option: 'G-', value: 'G-' }
  ]

  constructor(private fb: FormBuilder,
    private buildingSvc: EmpresaService,
    private coinSvc: CoinsService, private route: ActivatedRoute,
    public override comunicatorSvc: ComunicatorComponetsService, private ref: ChangeDetectorRef) {
    super(comunicatorSvc);

  }

  ngOnInit() {
    this.initForm()
    this.setCurrencies()
    this.setBuilding()
    this.subscribeToAlertResponse()
    this.subscribeToPrimaryCurrencyChange()
    this.subscribeToSecondariesCurrencyChange()
  }
  initForm() {
    this.formBuilding = this.fb.group({
      document_type: ['V-'],
      document_number: ['', [Validators.required, Validators.pattern(/^[0-9]+$/),Validators.maxLength(20)]],
      name: ['', [Validators.required,Validators.maxLength(50)]],
      currency_code: ['', [Validators.required,Validators.maxLength(30)]],
      address: ['',[Validators.maxLength(150)]],
      phone_number: ['', [Validators.pattern(/^[0-9]+$/),Validators.maxLength(15)]],
      email: ['', [Validators.email]],
      email_password:['',[Validators.required]],
      secondary_currency: ['']
    });

  }
  subscribeToPrimaryCurrencyChange() {
    this.subscriptions.push(this.formBuilding.controls['currency_code'].valueChanges
      .subscribe(currency_code => {
        const currency = this.allCurrencies.find((currency) => currency.currency_code === currency_code)
        if (currency) {
          this.auxMainCoin = currency;
          this.type = 'changeCoin';
          this.changePrimaryCoin(currency)
        }
      }))
  }
  subscribeToSecondariesCurrencyChange() {
    this.subscriptions.push(this.formBuilding.controls['secondary_currency'].valueChanges
      .subscribe(currency => {
        console.log(currency)
        this.changeCurrency(currency)
      }))
  }

  setCurrencies() {
    const currenciesData = this.route.snapshot.data['currencies'];
    if (currenciesData) {
      this.mainCoin = currenciesData[0][0]
      this.secondariesCoins = currenciesData[1]
      this.allCurrencies = [{
        currency_code: '', currency: 'Selecccione la moneda',
        country: '', country_code: '', language: '', language_code: '', exchange: 0
      }, ...currenciesData[2]]
      this.auxSecondariesCoins = JSON.parse(JSON.stringify(this.secondariesCoins));
    }
  }
  setBuilding() {
    const buildingData = this.route.snapshot.data['building'];
    if (buildingData && buildingData.length > 0) {
      this.building = buildingData[0];
      const { document_type, document_number, name, address, phone_number, email, currency_code,email_password } = this.building;
      this.formBuilding.patchValue({ document_type, document_number, name, address, phone_number, email, currency_code,email_password });
    }
  }
  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }
  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Warning') {
      const action: { [key: string]: any } = {
        changeCoin: this.changeCoin,
        update: this.update
      }
      const handler = action[this.type].bind(this)
      handler(response.response)

    }
  }
  submit() {
    if (this.formBuilding.valid) {
      let building: Building = this.formBuilding.value;
      building.secondariesCoins = this.secondariesCoins;
      this.subscriptions.push(
        this.buildingSvc.setBuilding(building).subscribe({
          next: res => {
            this.msj = res;
            this.building = building;
            this.auxMainCoin = this.mainCoin;
            this.auxSecondariesCoins = JSON.parse(JSON.stringify(this.secondariesCoins));
            this.showModal('Success');
            this.ref.detectChanges();
          }
        })
      );
    }
  }
  clean() {
    this.formBuilding.reset({
      document_number: '',
      name: '',
      address: '',
      phone_number: '',
      email: '',
      name_tax: '',
      tax_rate: ''
    });
  }
validateUpdate() {

    let result = { isValid: true, msj: '' };

    const formValue = this.formBuilding.value;
    const buildingValue = this.building;
  
    if (
      formValue.document_type === buildingValue.document_type &&
      formValue.document_number === buildingValue.document_number &&
      formValue.name === buildingValue.name &&
      formValue.address === buildingValue.address &&
      formValue.phone_number === buildingValue.phone_number &&
      formValue.email === buildingValue.email &&
      formValue.currency_code === buildingValue.currency_code &&
      formValue.email_password==buildingValue.email_password &&
      JSON.stringify(this.secondariesCoins) === JSON.stringify(this.auxSecondariesCoins)
    ) {
      return { isValid: false, msj: 'No ha modificado los datos' };
    }

    if (this.formBuilding.invalid) {
      return { isValid: false, msj: 'Existen datos inválidos' };
    }

    for (const element of this.secondariesCoins) {
      if (element.exchange === 0) {
        return {
          isValid: false,
          msj: 'La tasa de cambio de las monedas secundarias no puede ser 0'
        };
      }
    }

    return result;
}

  update(value: boolean) {
    if (value) {
      let building: Building = this.formBuilding.value;
      building.secondariesCoins = this.secondariesCoins;
      this.buildingSvc.updateBuilding(this.building.id_building, building).subscribe({
        next: res => {
          this.msj = res;
          this.building = building;
          this.auxMainCoin = this.mainCoin;
          this.auxSecondariesCoins = [...this.secondariesCoins]; // Faster way to clone array
          this.showModal('Success');
          this.ref.detectChanges()
        }
      });
    }
  }

  changePrimaryCoin(coin: Currency) {
    let search = this.secondariesCoins.find((element) => element.currency_code ===
      coin.currency_code)
    if (search !== undefined) {
      this.showModalWarning('La moneda que intenta colocar como moneda principal ya esta registrada ' +
        'como moneda secundaria, si continua se eliminará como moneda secundaria y se ' +
        'establecerá como moneda principal ¿desea continuar?')
    } else {
      this.mainCoin = coin
    }
  }
  changeCurrency(currency_code: any) {
    this.secondaryCoin = this.allCurrencies.find((Element) => Element.currency_code === currency_code)
  }
  addSecondaryCoin() {
    if (this.mainCoin === undefined) {
      throw new Error('Debe añadir primero la moneda principal')
    }
    if (this.secondaryCoin && (this.secondariesCoins.find(
      (currency) => currency.currency_code === this.secondaryCoin?.currency_code) !== undefined)) {
      throw new Error('Esta moneda ya se encuentra añadida')

    }
    if (this.secondaryCoin && this.secondaryCoin.currency_code === this.mainCoin?.currency_code) {
      throw new Error('Esta moneda se encuentra seleccionada como moneda principal, ' +
        'por tanto no se puede añadir como moneda secundaria')
    }
    if (this.secondaryCoin) {
      this.secondaryCoin.exchange = 0
      this.secondariesCoins.push(this.secondaryCoin)
    }

  }


  changeCoin(value: boolean) {
    let search = this.secondariesCoins.find((element) => element.currency_code ===
      this.auxMainCoin?.currency_code)
    if (value && search) {
      this.deleteSecondaryCoin(search)
      this.mainCoin = this.auxMainCoin
    } else {
      this.formBuilding.get('currency_code')?.setValue(this.mainCoin?.currency_code)
    }
    this.ref.detectChanges()
    return ''
  }
  deleteSecondaryCoin(coin: Currency) {
    //Obtengo el indice del elemento que voy a eliminar
    let index = this.secondariesCoins.indexOf(coin)
    //elimino el elemento de mi lista de monedas secundarias
    this.secondariesCoins.splice(index, 1)
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }

}
