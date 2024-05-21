import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription, mergeMap } from 'rxjs';
import { CoinsService } from 'src/app/administrador/content/configuraciones/service/coins.service';
import { AlertListProducts, Currency, Product} from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { AlertFunctions } from 'src/app/utils/AlertFuntions';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListProductsComponent extends AlertFunctions {
  subscriptions: Subscription[] = []
  listProducts: Product[] = []
  tableSearch!: FormGroup;
  currencies!: Currency[]
  currencySelectedProducts!: Currency
  mainCurrency!: Currency
  @Input() message: AlertListProducts = { showAlert: false, currentProducts: [], productsList: [], actionType: '' };
  @Output() messageEvent = new EventEmitter<boolean | Product>();

  constructor(protected override comunicatorSvc: ComunicatorComponetsService,
    private currenciesSvc: CoinsService, private ref: ChangeDetectorRef) {
    super(comunicatorSvc)
  }
  ngOnInit() {
    this.tableSearch = new FormGroup({
      search: new FormControl(),
      campSearch: new FormControl('name'),
      currency: new FormControl('')
    });
    let currencies = this.currenciesSvc.getMainCurrency().pipe(mergeMap((MainCoin) => {
      this.mainCurrency = MainCoin[0];
      return this.currenciesSvc.getsecondariesCoins().pipe(mergeMap((res) => [MainCoin.concat(res)]))
    }))

    this.subscriptions.push(currencies.subscribe(res => {
      this.currencies = res;
      this.tableSearch.get('currency')?.setValue(this.mainCurrency.currency_code);
      this.currencySelectedProducts = this.mainCurrency
    }))

  }
  checkAdded(newProduct: Product) {
    let añadido = this.message.currentProducts.find(
      (product:Product) => product.id_product === newProduct.id_product)

    if (añadido) {
      this.msj.description = 'Este producto ya se encuentra agregado a la ' + this.message.actionType
    }
    return añadido
  }

  checkEmptyExistence(product: Product) {
    if (product.exist_quantity === 0) {
      this.msj.description = 'No hay existencias de este producto para vender'
    }
    return (product.exist_quantity === 0)
  }
  addQuantity(product: Product) {
    this.showModalQuantity('Agregar cantidad del producto')
    this.messageEvent.emit(product);

    this.ref.detectChanges()
  }

  checkProduct(product: Product | undefined, ...functions: any) {
    for (let check of functions) {
      if (check(product)) {
        throw new Error(this.msj.description)
      }
    }
  }

  cancel() {
    this.messageEvent.emit(false);
  }

  ngOnChanges() {
    if (this.tableSearch) {
      this.tableSearch.get('search')?.setValue('')
      this.currencySelectedProducts = this.mainCurrency
      this.tableSearch.get('currency')?.setValue(this.mainCurrency.currency_code);
    }
  }
  ngOnDestroy() {

    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }

}
