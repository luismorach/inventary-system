import { ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyProduct, Product, Provider, Buy, Currency, ResponseAlert, SelectInfo, SignUp } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { ComprasService } from '../service/compras.service';
import { Subscription, map } from 'rxjs';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';
import { SessionStorageService } from 'src/app/storage/session-storage.service';
@Component({
  selector: 'app-nueva-compra',
  templateUrl: './nueva-compra.component.html',
  styleUrls: ['./nueva-compra.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NuevaCompraComponent extends DinamicComponent {

  formNewBuy!: FormGroup;
  providers!: Provider[]
  products: Product[] = []
  listProductsToBuy: BuyProduct[] = []
  selectedProduct!: Product
  listProducts: Product[] = []
  date = new Date()
  mainCurrency!: Currency
  currencySelected!: Currency
  currencies!: Currency[]
  subscriptions: Subscription[] = []
  selectInfoProviders: SelectInfo = {
    label: 'Proveedor',
    optionName: ['name_provider'],
    definitionOption: 'id_provider',
    required: true
  }
  selectInfoCurrencies: SelectInfo = {
    label: 'Divisa',
    optionName: ['currency'],
    definitionOption: 'currency_code',
    required: true
  }

  constructor(private fb: FormBuilder,
    protected override router: Router, private route: ActivatedRoute,
    public override comunicatorSvc: ComunicatorComponetsService,
    private comprasServices: ComprasService,
    private ref: ChangeDetectorRef,
    private sessionStorageService:SessionStorageService) {
    super(comunicatorSvc, router);
  }

  ngOnInit() {
    this.setTitleAndIcon(3, "fas fa-shopping-bag fa-fw")
    this.initForm()
    this.setCurrency()
    this.setProviders()
    this.setProducts()
    this.subscribeToAlertResponse()
  }
  initForm() {
    this.formNewBuy = this.fb.group({
      barcode: ['', [Validators.required, Validators.pattern(/^[0-9]+$/),Validators.maxLength(30)]],
      productQuantity: ['', [Validators.pattern(/^[0-9]+$/),Validators.maxLength(10)]],
      currency: [''],
      provider: [-1]
    })
  }
  setCurrency() {
    const currenciesData = this.route.snapshot.data['currencies'];
    if (currenciesData) {
      const { currencies, mainCurrency } = currenciesData;
      const mainCurrencyItem = mainCurrency[0];

      this.currencies = [{
        currency_code: '', currency: 'Selecccione la divisa',
        country: '', country_code: '', language: '', language_code: '', exchange: 0
      }
      ].concat(currencies)

      this.mainCurrency = mainCurrencyItem;
      this.currencySelected = mainCurrencyItem;
      this.formNewBuy.get('currency')?.setValue(mainCurrencyItem.currency_code);
      this.selectCurrency();
    }
  }
  setProviders() {
    const providersData = this.route.snapshot.data['providers'];
    if (providersData) {
      this.providers = [{
        document_type: '', document_number: 9, address_provider: '',
        name_provider: 'Selecione el proveedor', name_boss: '', phone_number: 8, email: '',
        id_provider: -1
      }, ...providersData];
    }
  }
  setProducts() {
    this.listProducts = this.route.snapshot.data['products'] || [];
  }
  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }

  selectCurrency() {
    this.formNewBuy.get('currency')?.valueChanges.pipe(
      map(currencySelected => this.currencies.find(currency => currency.currency_code === currencySelected))
    ).subscribe(currency => {
      if (currency) {
        this.currencySelected = currency;
      }
    });
  }
  getProduct() {
    let barcodeValue = this.formNewBuy.get('barcode')?.value;
    let product = this.listProducts.find((res) => res.barcode === barcodeValue);
    return product;
  }
  getQuantity() {
    let quantity: number = Number(this.formNewBuy.get('productQuantity')?.value) || 1;
    return quantity;
  }

  checkAdded(product: Product) {
    this.selectedProduct = product
    const isAdded = this.products.includes(product)
    if (isAdded) {
        this.msj.description = 'Este producto ya se encuentra agregado a la venta'
    }
    return isAdded
  }

  checkProductExistence(product: Product | undefined) {
    const productDoesNotExist = product === undefined;
    if (productDoesNotExist) {
        this.msj.description = 'No existe un producto con ese código de barras';
    }
    return productDoesNotExist;
  }
  validateProduct(product: Product | undefined, quantity: number, ...validators: any) {
    for (let validator of validators) {
      if (validator(product, quantity)) {
          throw new Error(this.msj.description);
      }
  }
  }

  addProduct(product: Product, quantity: number) {
    const newProduct = {
      id_buy: 0, id_product: product.id_product,
      buy_price: 0, sell_price: 0, weighted_averages_sell: 0, weighted_averages_buy: 0,
      quantity_products: quantity, exist_products: 0, quantity_back: 0,
      discount_product: product.discount, tax_rate: 0
    };

    this.listProductsToBuy.push(newProduct);
    this.products.push(product);
    this.showProductsModal(false)
    this.ref.detectChanges();
    return false;
  }

  calculateSubtotal(product: Product, index: number) {
    const { buy_price, quantity_products } = this.listProductsToBuy[index];
    return buy_price * quantity_products;
  }

  calculateTotal() {
    return this.listProductsToBuy.reduce((total, product) => total + (product.buy_price * product.quantity_products), 0);
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1)
    this.listProductsToBuy.splice(index, 1)
  }

  showProductsModal(show:boolean) {
    this.showProductsListAlert({
      showAlert: show, currentProducts: this.products,
      productsList: this.listProducts, actionType: 'compra'
    })
  }
  validateBuy() {
    if (this.products.length === 0) {
      return { isValid: false, msj: 'Agrege productos a la compra' };
    }

    if (this.formNewBuy.get('provider')?.value === -1) {
      return { isValid: false, msj: 'Debe seleccionar un proveedor' };
    }

    for (let productBuy of this.listProductsToBuy) {
      let product = this.products.find((res) => res.id_product === productBuy.id_product);
      if (product) {
        if (product.expir === null && product.can_expir) {
          return { isValid: false, msj: 'La fecha de vencimiento del ' + product.name + ' es invalida' };
        }
        if (productBuy.quantity_products < 1) {
          return { isValid: false, msj: 'La cantidad del ' + product.name + ' no puede ser 0' };
        }
        if (Number(productBuy.buy_price) === 0) {
          return { isValid: false, msj: 'El precio de compra del producto ' + product.name + ' no puede ser 0' };
        }
        if (Number(productBuy.sell_price) === 0) {
          return { isValid: false, msj: 'El precio de venta del producto ' + product.name + ' no puede ser 0' };
        }
        if (Number(productBuy.sell_price) < Number(productBuy.buy_price)) {
          return { isValid: false, msj: 'El precio de venta del producto ' + product.name + ' no puede ser menor al precio de compra' };
        }
      }
    }

    return { isValid: true, msj: '' };
  }

  handleAlertResponse(response: ResponseAlert) {
    if (response.type ===  'availableProducts' && response.response instanceof Object)
      this.selectedProduct = response.response as Product
    if (response.type === 'Warning' && response.response)
      this.registerBuy()
    if (response.type === 'Quantity' && Number(response.response)) {
      this.addProduct(this.selectedProduct, Number(response.response))
    }
  }

  registerBuy() {
    this.products.forEach((product: Product, index: number) => {
      this.listProductsToBuy[index].exist_products = Number(product.exist_quantity) +
        Number(this.listProductsToBuy[index].quantity_products)
  
      this.listProductsToBuy[index].weighted_averages_sell = Number((((Number(product.price) *
        Number(product.exist_quantity)) +
        (this.comunicatorSvc.converterToMainCoin(Number(this.listProductsToBuy[index].sell_price),
          this.currencySelected.exchange) * Number(this.listProductsToBuy[index].quantity_products))) /
        Number(this.listProductsToBuy[index].exist_products)).toFixed(2))

      this.listProductsToBuy[index].weighted_averages_buy = Number((((Number(product.cost) * Number(product.exist_quantity)) +
        (this.comunicatorSvc.converterToMainCoin(Number(this.listProductsToBuy[index].buy_price), this.currencySelected.exchange) *
          Number(this.listProductsToBuy[index].quantity_products))) /
        this.listProductsToBuy[index].exist_products).toFixed(2))
    })

    let buy: Buy = {
      id_buy: 0,
      total_buy: this.calculateTotal(),
      currency_code: this.formNewBuy.get('currency')?.value.toString(),
      exchange: this.currencySelected.exchange,
      id_provider: Number(this.formNewBuy.get('provider')?.value),
      buy_products: this.listProductsToBuy,
      id_user: Number(this.sessionStorageService.getItem<SignUp>('user')?.id_user),
      user: undefined
    }

    this.comprasServices.setBuy(buy).subscribe(
      res => {
        this.msj = res
        this.showModal('Success')
        this.clean()
      })
  }
  clean() {
    this.formNewBuy.reset({ provider: -1, currency: this.mainCurrency.currency_code })
    this.currencySelected = this.mainCurrency

    this.products.forEach((product: Product, index: number) => {
      let i = this.listProducts.findIndex((res) => res.id_product === product.id_product)
      this.listProducts[i].exist_quantity = this.listProductsToBuy[index].exist_products
      this.listProducts[i].price = this.listProductsToBuy[index].weighted_averages_sell
      this.listProducts[i].cost = this.listProductsToBuy[index].weighted_averages_buy
    })
    this.products = []
    this.listProductsToBuy = []
    this.ref.detectChanges()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
