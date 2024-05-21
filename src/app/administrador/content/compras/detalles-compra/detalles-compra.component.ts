import { ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { Buy, BuyProduct, Product, Provider, User, Repayment, Currency, ResponseAlert, TableInfo, TableColumn, TableResponse, SignUp } from 'src/app/interfaces/interfaces';
import { Location } from '@angular/common';
import { DevolucionesService } from '../../devoluciones/service/devoluciones.service';
import { Subscription } from 'rxjs';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';
import { SessionStorageService } from 'src/app/storage/session-storage.service';

@Component({
  selector: 'app-detalles-compra',
  templateUrl: './detalles-compra.component.html',
  styleUrls: ['./detalles-compra.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetallesCompraComponent extends DinamicComponent {
  userBuy!: User
  providerBuy!: Provider
  dataSourceProducts: any[] = []
  dataSourceRepayments: any[] = []
user: User = {
    id_user: 0,
    document_type_user: '',
    document_number_user: 123,
    range_user: '',
    names_user: '',
    last_names_user: '',
    phone_number_user: 12,
    gander_user: '',
    id_register: 12,
    email_user: '',
    password_user: '',
    state_user: '',
  }
  buy!: Buy
  currency!: Currency
  buy_products: BuyProduct[] = []
  repayments: Repayment[] = []
  products: Product[] = []
  indexElementToBack!: number
  subscriptions: Subscription[] = []
  tableInfoProducts: TableInfo = {
    tableTitle: 'Productos comprados',
    searchField: '',
    enablePagination: false,
    enableSearch: false
  }
  footerProducts: string[] = []
  tableInfoRepayments: TableInfo = {
    tableTitle: 'Devoluciones realizadas',
    searchField: '',
    enablePagination: false,
    enableSearch: false
  }
  tableColumnsProducts!: TableColumn[]
  tableColumnsRepayments!: TableColumn[]
  constructor(protected override router: Router,
    public override comunicatorSvc: ComunicatorComponetsService,
    private route: ActivatedRoute,
    private location: Location,
    private devolucionesSvc: DevolucionesService,
    private ref: ChangeDetectorRef,
    private sessionStorageService:SessionStorageService) {
    super(comunicatorSvc, router)
  }

  ngOnInit() {
    this.setTitleAndIcon(3, "fas fa-shopping-bag fa-fw")
    this.setBuy()
    this.setProducts()
    this.setRepayments()
    this.setUser()
    this.initTableProducts()
    this.initTableRepayments()
    this.subscribeToAlertResponse()
  }

  setBuy() {
    const buyData = this.route.snapshot.data['buy'];
    if (buyData) {
      const { buy, productsBuy } = buyData;
      this.buy = this.providerBuy = this.userBuy = this.currency = buy;
      this.buy_products = productsBuy;
    }
  }
  setProducts() {
    const productsData = this.route.snapshot.data['products'];
    if (productsData) {
      this.products = productsData;
    }
  }
  setRepayments() {
    const repaymentsData = this.route.snapshot.data['repayments'];
    if (repaymentsData) {
      this.repayments = repaymentsData
    }
  }
  setUser() {
    this.user.names_user = this.sessionStorageService.getItem<SignUp>('user')?.names_user || '';
  }

setDataSourceProducts() {
    this.dataSourceProducts = this.buy_products.map((buy_product, i: number) => ({
      ...this.products[i],
      ...buy_product,
      subTotal: buy_product.buy_price * buy_product.quantity_products
    }));
  }
setDataSourceRepayments() {
    this.dataSourceRepayments = this.repayments.map(repayment => ({
      ...repayment,
      name_product: this.getProduct(repayment)
    }));
}
initTableProducts() {
    this.setDataSourceProducts();
    this.tableColumnsProducts = [
      { columnLabel: 'Código de barra', definition: ['barcode'], columnType: '' },
      { columnLabel: 'Producto', definition: ['name', 'mark', 'model'], columnType: '' },
      { columnLabel: 'Cantidad', definition: ['quantity_products'], columnType: '' },
      { columnLabel: 'Precio de compra', definition: ['buy_price'], columnType: '', pipeType: 'currency', options: this.currency },
      { columnLabel: 'Sub total', definition: ['subTotal'], columnType: '', pipeType: 'currency', options: this.currency },
      { columnLabel: '', definition: ["fas fa-truck-loading fa-fw update"], columnType: 'repayment' }
    ];
}
initTableRepayments() {
    this.tableColumnsRepayments = [
      { columnLabel: 'Fecha', definition: ['date'], columnType: '', pipeType: 'date', options: 'dd/MM/yyyy' },
      { columnLabel: 'Producto', definition: ['name_product'], columnType: '' },
      { columnLabel: 'Cantidad', definition: ['quantity'], columnType: '' },
      { columnLabel: 'Precio de compra', definition: ['buy_price'], columnType: '', pipeType: 'currency', options: this.currency },
      { columnLabel: 'Total', definition: ['total'], columnType: '', pipeType: 'currency', options: this.currency },
      { columnLabel: 'comprador', definition: ["names_user", "last_names_user"], columnType: '' },
    ];
    this.setDataSourceRepayments();
}

  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }
showModalQuantityBack = (tableResponse: TableResponse) => {
    const { value: product, index } = tableResponse;
    this.indexElementToBack = index;
    this.showModalQuantity(`Realizar Devolución (${product.name} ${product.mark} ${product.model})`);
}
  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Quantity' && Number(response.response)) {
      this.validateRepayment(Number(response.response))
    }
  }
validateRepayment(newQuantity: number) {
    const { quantity_products, quantity_back } = this.buy_products[this.indexElementToBack];
    const { exist_quantity } = this.products[this.indexElementToBack];

    if (newQuantity > (quantity_products - quantity_back)) {
      this.showError('La cantidad a devolver es mayor a la registrada en la compra');
    } else if ((exist_quantity - newQuantity) < 0) {
      this.showError('No existe esa cantidad en el almacén, los productos ya han sido vendidos');
    } else {
      this.registerRepayment(newQuantity);
    }
}

private showError(message: string) {
    this.msj.description = message;
    throw new Error(message);
}
registerRepayment(newQuantity: number) {
    let newQuantityBack = this.buy_products[this.indexElementToBack].quantity_back + newQuantity;
    let existQuantity = this.products[this.indexElementToBack].exist_quantity - newQuantity;
    let weightedAveragesSell = Number((((this.products[this.indexElementToBack].price *
        this.products[this.indexElementToBack].exist_quantity) -
        (this.comunicatorSvc.converterToMainCoin(this.buy_products[this.indexElementToBack].sell_price, this.buy.exchange)
            * newQuantity)) / (this.products[this.indexElementToBack].exist_quantity -
                newQuantity)).toFixed(2));
    let weightedAveragesBuy = Number((((this.products[this.indexElementToBack].cost *
        this.products[this.indexElementToBack].exist_quantity) -
        (this.comunicatorSvc.converterToMainCoin(this.buy_products[this.indexElementToBack].buy_price, this.buy.exchange)
            * newQuantity)) /
        (this.products[this.indexElementToBack].exist_quantity -
            newQuantity)).toFixed(2));

    let repayment: Repayment = {
        type: 'Devolución de compra',
        date: new Date(),
        id_buy: this.buy_products[this.indexElementToBack].id_buy,
        quantity: newQuantity,
        buy_price: this.buy_products[this.indexElementToBack].buy_price,
        sell_price: this.buy_products[this.indexElementToBack].sell_price,
        total: newQuantity * this.buy_products[this.indexElementToBack].buy_price,
        currency_code: this.buy.currency_code,
        currency: this.buy.currency,
        user: this.user,
        exchange: this.buy.exchange,
        exist_quantity: existQuantity,
        weighted_averages_sell: weightedAveragesSell,
        weighted_averages_buy: weightedAveragesBuy,
        id_user: Number(this.sessionStorageService.getItem<SignUp>('user')?.id_user),
        id_product: this.buy_products[this.indexElementToBack].id_product,
    }

    this.buy_products[this.indexElementToBack].quantity_back = newQuantityBack;
    this.products[this.indexElementToBack].exist_quantity = existQuantity;
    repayment.weighted_averages_buy = (isNaN(repayment.weighted_averages_buy)) ? 0 : repayment.weighted_averages_buy;
    repayment.weighted_averages_sell = (isNaN(repayment.weighted_averages_sell)) ? 0 : repayment.weighted_averages_sell;

    this.devolucionesSvc.setRepaymentBuy(repayment).subscribe(res => {
        this.repayments.push(Object.assign(repayment, this.user));
        this.dataSourceRepayments = [];
        this.setDataSourceRepayments();
        this.msj = res;
        this.showModal('Success');
        this.ref.detectChanges();
    });
}

calcularTotal() {
    return this.buy_products.reduce((total, buy_product) => 
      total + buy_product.buy_price * buy_product.quantity_products, 0);
}
  redirectToComprasRealizadas() {
    this.location.back()
  }
getProduct(repayment: Repayment) {
    const product = this.products.find(product => product.id_product === repayment.id_product);
    return product ? `${product.name} ${product.mark} ${product.model}` : '';
}
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }

}
