import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { building, coin, alert } from 'src/app/interfaces/interfaces';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { EmpresaService } from '../service/empresa.service';
@Component({
  selector: 'app-datos-de-la-empresa',
  templateUrl: './datos-de-la-empresa.component.html',
  styleUrls: ['./datos-de-la-empresa.component.css']
})
export class DatosDeLaEmpresaComponent extends DinamicInput {
  formBuilding!: FormGroup;
  building!: building;
  coinsUsed: coin[] = []

  @ViewChild('popup', { static: true }) override popUp?: ElementRef;
  coins = [{ name: 'Dólar Americano USD', symbol: '$' },
  { name: 'Dolar canadiense CAD', symbol: '$' },
  { name: 'Peso mexicano MXN', symbol: '$' },
  { name: 'Florín AWG', symbol: 'ƒ' },
  { name: 'Bajan Dollar BBD', symbol: '$' },
  { name: 'Dólar de las Bermudas BMD', symbol: '$' },
  { name: 'Dólar de las Bahamas BSD', symbol: '$' },
  { name: 'Peso dominicano DOP', symbol: '$' },
  { name: 'Dólar jamaiquino JMD', symbol: '$' },
  { name: 'Quetzal guatemalteco GTQ', symbol: 'Q' },
  { name: 'Balboa panameño PAB', symbol: 'B/.' },
  { name: 'Dólar caribeño XCD', symbol: '$' },
  { name: 'Euro EUR', symbol: '€' },
  { name: 'Libra esterlina GBP', symbol: '£' },
  { name: 'Carrera georgiana GEL', symbol: '₾' },
  { name: 'Lev búlgaro BGN', symbol: 'лв' },
  { name: 'Franco suizo CHF', symbol: 'CHF' },
  { name: 'Corona danesa DKK', symbol: 'kr' },
  { name: 'Corona de la República Checa CZK', symbol: 'Kč' },
  { name: 'Kuna croata HRK', symbol: 'kn' },
  { name: 'Florín húngaro HUF', symbol: 'ft' },
  { name: 'Corona noruega NOK', symbol: 'kr' },
  { name: 'Rublo ruso	RUB', symbol: '₽' },
  { name: 'Zloty polaco PLN', symbol: 'zł' },
  { name: 'Leu rumano RON', symbol: 'lei' },
  { name: 'Corona sueca SEK', symbol: 'kr' },
  { name: 'Grivna ucraniana UAH', symbol: '₴' },
  { name: 'Lira turca TRY', symbol: '₺' },
  { name: 'Peso argentino ARS', symbol: '$' },
  { name: 'Bolivian Boliviano BOB', symbol: 'Bs.' },
  { name: 'Real brasileño BRL', symbol: 'R' },
  { name: 'Chilean Peso CLP', symbol: '$' },
  { name: 'Colombian Peso COP', symbol: '$' },
  { name: 'Peruvian Nuevo Sol PEN', symbol: 'S/.' },
  { name: 'Guaraní paraguayo PYG', symbol: '₲' },
  { name: 'Uruguayan Peso UYU', symbol: '$' },
  { name: 'Venezuelan Bolívar VES', symbol: 'Bs.' },
  { name: 'Yen japonés JPY', symbol: '¥' },
  { name: 'Bangladesh Taka BDT', symbol: '৳' },
  { name: 'Yuan chino CNY', symbol: '¥' },
  { name: 'Dolar de Hong Kong HKD', symbol: '$' },
  { name: 'Rupia india INR', symbol: '₹' },
  { name: 'Riel camboyano KHR', symbol: '៛' },
  { name: 'Pollo LAK', symbol: '₭' },
  { name: 'Rupia de Sri Lanka LKR', symbol: 'රු' },
  { name: 'Rufiyaa MVR', symbol: '.ރ' },
  { name: 'Ringgit malayo MYR', symbol: 'RM' },
  { name: 'Rupia nepalí NPR', symbol: 'रू' },
  { name: 'Peso filipino PHP', symbol: '₱' },
  { name: 'Rupia pakistaní PKR', symbol: '₨' },
  { name: 'Dolar de Singapur SGD', symbol: '$' },
  { name: 'Baht tailandés THB', symbol: '฿' },
  { name: 'Nuevo dólar taiwanés TWD', symbol: '$' },
  { name: 'Dong vietnamita VND', symbol: '₫' },
  { name: 'Dólar australiano AUD', symbol: ' $' },
  { name: 'Dólar fiyiano FJD', symbol: '$' },
  { name: ' Dolar de Nueva Zelanda NZD', symbol: ' $' },
  { name: 'Franco CFP XPF', symbol: ' ₣' },
  { name: 'Libra egipcia EGP', symbol: '£' },
  { name: 'Cedi de Ghana GHS', symbol: '₵' },
  { name: 'Dalasi 	Gambia 	GMD', symbol: 'D' },
  { name: 'Chelín keniano KES', symbol: 'Sh' },
  { name: 'Dirham marroquí MAD', symbol: 'DH' },
  { name: 'Ariary malgache MGA', symbol: 'Ar' },
  { name: 'Rupia de Mauricio MUR', symbol: '₨' },
  { name: 'Dólar de Namibia NAD', symbol: '$' },
  { name: 'Naira nigeriana NGN', symbol: '₦' },
  { name: 'Rupia SCR', symbol: '₨' },
  { name: 'Tunisian Dinar TND', symbol: 'DT' },
  { name: 'Chelín ugandés UGX', symbol: 'Sh' },
  { name: 'Franco CFA BEAC XAF', symbol: 'Fr' },
  { name: 'Franco CFA BCEA XOF', symbol: 'Fr' },
  { name: 'Rand sudafricano ZAR', symbol: 'Br' },
  { name: 'Dírham de los Emiratos Árabes Unidos AED', symbol: 'د.إ' },
  { name: 'Nuevo sheqel israelí ILS', symbol: '₪&' },
  { name: 'Libra siria SYP', symbol: '£' },
  { name: 'Dinar jordano JOD', symbol: 'د.ا' },
  { name: 'Dinar kuwaití KWD', symbol: ' د.ك' },
  { name: 'Libra libanesa LBP', symbol: 'ل.ل' },
  { name: 'Rial omaní OMR', symbol: ' ر.ع.' },
  { name: 'Rial de Qatar QAR', symbol: ' ر.ق' },
  { name: 'Riyal saudí SAR', symbol: 'ر.س,' },
  ]
  constructor(private fb: FormBuilder,
    private buildingSvc: EmpresaService,
    public override renderer: Renderer2) {
    super();

  }

  ngOnInit() {
    
    console.log(this.coins.length)
    this.buildingSvc.getBuildings().subscribe({
      next: res => {
        this.formBuilding.get('document_type')?.setValue(res[0].document_type);
        this.formBuilding.get('document_number')?.setValue(res[0].document_number);
        this.formBuilding.get('name')?.setValue(res[0].name);
        this.formBuilding.get('address')?.setValue(res[0].address);
        this.formBuilding.get('phone_number')?.setValue(res[0].phone_number);
        this.formBuilding.get('email')?.setValue(res[0].email);
        this.formBuilding.get('name_tax')?.setValue(res[0].name_tax);
        this.formBuilding.get('tax_rate')?.setValue('' + res[0].tax_rate * 100);
        this.formBuilding.get('show_tax')?.setValue('' + res[0].show_tax);
        this.building = res[0];
      }
    })
    this.formBuilding = this.fb.group({
      document_type: new FormControl(''),
      document_number: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      name: new FormControl('', [Validators.required]),
      coin: new FormControl(''),
      address: new FormControl(''),
      phone_number: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
      email: new FormControl('', [Validators.email]),
      name_tax: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]),
      tax_rate: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      show_tax: new FormControl(false)
    })
  }
  submit() {
    if (this.formBuilding.valid)
      console.log("registrd")
  }
  clean() {
    this.formBuilding.get('document_number')?.setValue('');
    this.formBuilding.get('name')?.setValue('');
    this.formBuilding.get('address')?.setValue('');
    this.formBuilding.get('phone_number')?.setValue('');
    this.formBuilding.get('email')?.setValue('');
    this.formBuilding.get('name_tax')?.setValue('');
    this.formBuilding.get('tax_rate')?.setValue('');
  }
  validarUpdate() {
    if (this.formBuilding.get('document_type')?.value === this.building.document_type &&
      this.formBuilding.get('document_number')?.value === this.building.document_number &&
      this.formBuilding.get('name')?.value === this.building.name &&
      this.formBuilding.get('address')?.value === this.building.address &&
      this.formBuilding.get('phone_number')?.value === this.building.phone_number &&
      this.formBuilding.get('email')?.value === this.building.email &&
      this.formBuilding.get('name_tax')?.value === this.building.name_tax &&
      this.formBuilding.get('tax_rate')?.value === '' + (this.building.tax_rate * 100) &&
      this.formBuilding.get('show_tax')?.value === '' + this.building.show_tax) {
      let msj: alert = {
        icon: '',
        title: '¿Estás seguro?',
        content: 'No ha modificado los datos de la empresa ¿desea continuar?'
      }
      this.changeModal(msj)
      this.popUp?.nativeElement.showModal()
    } else {
      this.update()
    }
  }
  update() {
    let msj: alert = {
      icon: '',
      title: '¿Estás seguro?',
      content: 'cambio?'
    }
    this.changeModal(msj)
    this.popUp?.nativeElement.showModal()
  }
  acept() {

  }
}
