import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, Repayment, Sell, SellProduct, User, Payment, Register, Client, Currency, ResponseAlert, TableColumn, TableInfo, TableResponse, SignUp } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { VentasService } from '../service/ventas.service';
import { DevolucionesService } from '../../devoluciones/service/devoluciones.service';
import { Location } from '@angular/common';
import { SaleFunctions } from 'src/app/utils/saleFuntions';
import { FormBuilder } from '@angular/forms';
import { SessionStorageService } from 'src/app/storage/session-storage.service';

@Component({
  selector: 'app-detalles-venta',
  templateUrl: './detalles-venta.component.html',
  styleUrls: ['./detalles-venta.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DetallesVentaComponent extends SaleFunctions {

  user: User = {
    id_user: 0, document_type_user: '', document_number_user: '123', range_user: '',
    names_user: '', last_names_user: '', phone_number_user: 12, gander_user: '', id_register: 12,
    email_user: '', password_user: '', state_user: '',
  }
  user_sell!: User
  currency!: Currency
  client!: Client
  register_sell!: Register
  repayments: Repayment[] = []
  indexElementToBack!: number
  dataSourceProducts: any[] = []
  dataSourcePayments: any[] = []
  dataSourceRepayments: any[] = []
  tableInfoProducts: TableInfo = {
    tableTitle: 'Productos comprados',
    searchField: '',
    enablePagination: false,
    enableSearch: false
  }
  tableInfoPayments: TableInfo = {
    tableTitle: 'Pagos realizados',
    searchField: '',
    enablePagination: false,
    enableSearch: false
  }
  tableInfoRepayments: TableInfo = {
    tableTitle: 'Devoluciones realizadas',
    searchField: '',
    enablePagination: false,
    enableSearch: false
  }
  tableColumnsProducts!: TableColumn[]
  tableColumnsPayments!: TableColumn[]
  tableColumnsRepayments!: TableColumn[]

  constructor(protected override router: Router,
    public override comunicatorSvc: ComunicatorComponetsService,
    protected override activatedRoute: ActivatedRoute,
    protected override salesService: VentasService,
    private location: Location,
    private devolucionesSvc: DevolucionesService,
    protected override fb: FormBuilder,
    protected override changeDetectorRef: ChangeDetectorRef,
    protected override sessionStorageService:SessionStorageService) {
    super(comunicatorSvc, router, fb, activatedRoute, changeDetectorRef, salesService,sessionStorageService);
  }

  ngOnInit() {
    this.setTitleAndIcon(3, "fas fa-coins fa-fw")
    this.setDetailsSell()
    this.setDetailsRepayments()
    this.setUser()
    this.initTableProducts()
    this.initTablePayments()
    this.initTableRepayments()
    this.subscribeToAlertResponse()
  }

  setDetailsSell() {
    let data = this.activatedRoute.snapshot.data;
    const sellData = data['sells'];
    const productsData = sellData.productsSell;

    const paysData = JSON.parse(JSON.stringify(sellData.pays));

    if (sellData) {
      this.sell = sellData.sell;
      this.user_sell = sellData.sell;
      this.client = sellData.sell;
      this.currency = sellData.sell;
      this.register_sell = sellData.sell;

      this.products = productsData
      this.taxes = productsData;
      this.sellProducts = productsData;

      this.payments = paysData;
    }
  }
  setDetailsRepayments() {
    const data = this.activatedRoute.snapshot.data;
    const repaymentsData = data['repayments'];

    if (repaymentsData) {
      this.repayments = repaymentsData;
    }
  }

  setDataSourceProducts() {
    this.dataSourceProducts = this.sellProducts.map((sellProduct, i: number) => ({
      ...sellProduct,
      discountValue: sellProduct.discount_product * sellProduct.sell_price,
      subTotal: this.calculateSubtotal(i)
    }));
  }
  setDataSourceRepayments() {
    this.dataSourceRepayments = this.repayments.map(repayment => ({
      ...repayment,
      name_product: this.getProductByRepayment(repayment)
    }));
  }
  setDataSourcePayments() {
    console.log(this.payments)
    this.dataSourcePayments = this.payments.map(payment => ({
      ...payment,
    }));
  }
  initTableProducts() {
    this.setDataSourceProducts();
    this.tableColumnsProducts = [
      { columnLabel: 'Código de barra', definition: ['barcode'], columnType: '' },
      { columnLabel: 'Producto', definition: ['name', 'mark', 'model'], columnType: '' },
      { columnLabel: 'Cantidad', definition: ['quantity_products'], columnType: '' },
      { columnLabel: 'Precio de venta', definition: ['sell_price'], columnType: '', pipeType: 'currency', options: this.currency },
      { columnLabel: 'Descuento', definition: ['discount_product'], columnType: '', pipeType: 'percent', options: '1.1-1' },
      { columnLabel: 'valor de descuento', definition: ['discountValue'], columnType: '', pipeType: 'currency', options: this.currency },
      { columnLabel: 'Impuesto', definition: ['tax_name', 'tax_rate'], columnType: '', pipeType: 'percent', options: '1.1-1' },
      { columnLabel: 'Sub total', definition: ['subTotal'], columnType: '', pipeType: 'currency', options: this.currency },
      { columnLabel: '', definition: ["fas fa-truck-loading fa-fw update"], columnType: 'repayment' }
    ];
  }
  initTablePayments() {
    this.setDataSourcePayments()
    this.tableColumnsPayments = [
      { columnLabel: 'Fecha', definition: ['date'], columnType: '', pipeType: 'date', options: 'dd/MM/yyyy' },
      { columnLabel: 'Tipo de venta', definition: ['type'], columnType: '' },
      {
        columnLabel: 'Monto', definition: ['mount'], columnType: '', pipeType: 'currency',
        options: [this.dataSourcePayments, this.currency]
      },
      { columnLabel: 'Referencia', definition: ['reference'], columnType: '' },
      { columnLabel: 'Vendedor', definition: ['names_user', 'last_names_user'], columnType: '' },
      { columnLabel: 'Caja', definition: ['name_register'], columnType: '' },
    ];
  }
  initTableRepayments() {
    this.setDataSourceRepayments();
    this.tableColumnsRepayments = [
      { columnLabel: 'Fecha', definition: ['date'], columnType: '', pipeType: 'date', options: 'dd/MM/yyyy' },
      { columnLabel: 'Producto', definition: ['name_product'], columnType: '' },
      { columnLabel: 'Cantidad', definition: ['quantity'], columnType: '' },
      { columnLabel: 'Precio de venta', definition: ['sell_price'], columnType: '', pipeType: 'currency', options: this.currency },
      { columnLabel: 'Total', definition: ['total'], columnType: '', pipeType: 'currency', options: this.currency },
      { columnLabel: 'Vendedor', definition: ["names_user", "last_names_user"], columnType: '' },
      { columnLabel: 'Caja', definition: ["name_register"], columnType: '' },
    ];
  }
  setUser() {
    let user=this.sessionStorageService.getItem<SignUp>('user')

    this.user.names_user = user?.names_user || '';
    this.user.id_user = Number(user?.id_user);
    this.user.register = {
      id_register:  Number(user?.id_register),
      name_register: user?.name_register || '',
      state_register: ''
    };
  }

  override calculateSubtotal(index: number) {
    const selectedProduct = this.sellProducts[index];
    const price = selectedProduct.sell_price;
    const discountPercent = this.products[index].discount;
    const discountValue = Number((price * discountPercent).toFixed(2))
    const quantity = this.sellProducts[index].quantity_products;
    const priceWithDiscount = price - discountValue;
    const subtotal = Number((priceWithDiscount * quantity).toFixed(2));
    return subtotal;
}
override calculateTaxAmount(taxRate: number): number {
  let taxableAmount = 0;

  const filteredProducts = this.sellProducts.filter((product:SellProduct) => product.tax_rate > 0 && product.tax_rate === taxRate);
  taxableAmount = filteredProducts.reduce((total, product) => {
      const price = product.sell_price;
      const discountPercent = this.products[this.sellProducts.indexOf(product)].discount;
      const discountValue = Number((price * discountPercent).toFixed(2))
      const quantity = this.sellProducts[this.sellProducts.indexOf(product)].quantity_products;
      const priceWithDiscount = price - discountValue;
      return total + (product.tax_rate * priceWithDiscount) * quantity;
  }, 0);

  return taxableAmount;
}
  showModalQuantityBack(tableResponse: TableResponse) {
    this.indexElementToBack = tableResponse.index
    this.showModalQuantity('Realizar Devolución (' + tableResponse.value.name + ' ' + tableResponse.value.mark + ' ' + tableResponse.value.model + ')')
  }
  override handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Quantity' && Number(response.response)) {
      this.validateRepayment(Number(response.response))
    }
    if (response.type === 'pay' && response.response instanceof Object)
      this.registerPayment(response.response as Payment)
  }

  override registerPayment(pay: Payment) {
    
    let convertedTotalPaid = -1
    let convertedTotalSell = 0
    this.sell.total_paid = Number(this.sell.total_paid) +
      Number(this.comunicatorSvc.converterToMainCoin(pay.mount, pay.exchange));
    pay.id_user = this.user.id_user;
    pay.date = new Date();

    if (pay.currency && this.user.register) {
      this.dataSourcePayments.push({
        ...pay,...pay.currency,...this.user,...this.user.register
      })
    }
    

    if (pay.currency) {
      convertedTotalPaid = this.comunicatorSvc.converter(this.sell.total_paid,  pay.currency,this.currency);
      convertedTotalSell = this.comunicatorSvc.converter(this.sell.total_sell, pay.currency,this.currency);
    }

    console.log(convertedTotalPaid,convertedTotalSell)
    if (pay.currency && convertedTotalPaid >= convertedTotalSell) {
      this.showModalPayment({ totalAmount: 0, totalPaid: 0, showAlert: false });
      this.sell.state = 'Cancelado';
    }

    this.salesService.setPay(this.sell, pay).subscribe(res => {
      this.msj = res;
      this.showModal('Success');
      this.changeDetectorRef.detectChanges();
    });
  }

  validateDateGaranty() {
    let today = new Date();
    let dateSell: Date = new Date(this.sell.time || new Date());
    let dateExpirGaranty = new Date(dateSell);

    if (this.products[this.indexElementToBack].garanty === 'Habilitada') {
      const timeUnit = this.products[this.indexElementToBack].time_unit;
      const timeGaranty: string = this.products[this.indexElementToBack].time_garanty
      const timeUnitMultiplier: any = {
        'Dia/s': 1,
        'Semana/s': 7,
        'Mes/es': 1,
        'Año/s': 1
      };
      const multiplier = timeUnitMultiplier[timeGaranty];

      if (multiplier) {
        switch (timeGaranty) {
          case 'Dia/s':
            dateExpirGaranty.setDate(dateSell.getDate() + (timeUnit * multiplier));
            break;
          case 'Semana/s':
            dateExpirGaranty.setDate(dateSell.getDate() + (timeUnit * multiplier));
            break;
          case 'Mes/es':
            dateExpirGaranty.setMonth(dateSell.getMonth() + (timeUnit * multiplier));
            break;
          case 'Año/s':
            dateExpirGaranty.setFullYear(dateSell.getFullYear() + (timeUnit * multiplier));
            break;
        }
      }
    }

    return (today > dateExpirGaranty);
  }
  validateRepayment(newQuantity: number) {
    let content = ''
    if (newQuantity > (this.sellProducts[this.indexElementToBack].quantity_products -
      this.sellProducts[this.indexElementToBack].quantity_back)) {
      content = 'La cantidad a devolver es mayor a la registrada en la venta'
    } else if (this.products[this.indexElementToBack].time_garanty === null) {
      content = 'No se puede realizar devolución de este producto, el mismo no posee garantia'
    } else if (this.validateDateGaranty()) {
      content = 'La garantia del producto ha caducado'
    } else {
      this.registerRepayment(newQuantity)
    }
    if (content !== '') {
      this.msj.description = content
      throw new Error(content)
    }
  }

  registerRepayment(newQuantity: number) {
    const sellProduct = this.sellProducts[this.indexElementToBack];
    const product = this.products[this.indexElementToBack];

    const sellPrice = sellProduct.sell_price;
    const buyPrice = sellProduct.buy_price;
    const newSellQuantity = sellProduct.quantity_back + newQuantity;
    const newExistQuantity = product.exist_quantity + newQuantity;

    const total = newQuantity * sellPrice;
    const weightedAveragesSell = this.setWeightedAveragesSell(newQuantity);
    const weightedAveragesBuy = this.setWeightedAveragesBuy(newQuantity);

    const repayment: Repayment = {
      type: 'Devolución de venta',
      date: new Date(),
      id_sell: this.sell.id_sell,
      quantity: newQuantity,
      sell_price: sellPrice,
      buy_price: buyPrice,
      total: total,
      currency_code: this.sell.currency_code,
      exchange: this.sell.exchange,
      exist_quantity: newExistQuantity,
      weighted_averages_sell: weightedAveragesSell,
      weighted_averages_buy: weightedAveragesBuy,
      id_user: this.user.id_user,
      id_product: sellProduct.id_product,
    };

    sellProduct.quantity_back = newSellQuantity;
    product.exist_quantity = newExistQuantity;

    repayment.weighted_averages_sell = isNaN(repayment.weighted_averages_sell) ? 0 : repayment.weighted_averages_sell;
    // repayment.weighted_averages_sell = this.comunicatorSvc.converterToSecondaryCoin(repayment.weighted_averages_sell, this.sell.exchange);
    this.saveRepayment(repayment);
  }
  setWeightedAveragesSell(newQuantity: number) {
    const product = this.products[this.indexElementToBack];
    const productPrice = product.price;
    const existingQuantity = product.exist_quantity;
    const sellProduct = this.sellProducts[this.indexElementToBack];
    const sellPrice = sellProduct.sell_price;
    const exchangeRate = this.sell.exchange;

    return Number((((productPrice * existingQuantity) +
      (this.comunicatorSvc.converterToMainCoin(sellPrice, exchangeRate) * newQuantity)) /
      (existingQuantity + newQuantity)).toFixed(2));
  }

  setWeightedAveragesBuy(newQuantity: number) {
    const product = this.products[this.indexElementToBack];
    const existingQuantity = product.exist_quantity;
    const productCost = product.cost;
    const sellProduct = this.sellProducts[this.indexElementToBack];
    const buyPrice = sellProduct.buy_price;
    const exchangeRate = this.sell.exchange;

    const newWeightedAverage = Number((((productCost * existingQuantity) +
      (this.comunicatorSvc.converterToMainCoin(buyPrice, exchangeRate) * newQuantity)) /
      (existingQuantity + newQuantity)).toFixed(2));

    return newWeightedAverage;
  }
  saveRepayment(repayment: Repayment) {
    this.devolucionesSvc.setRepaymentSell(repayment).subscribe(res => {
      this.repayments.push(Object.assign(repayment, this.user, this.user.register));
      this.dataSourceRepayments = [];
      this.setDataSourceRepayments();
      this.msj = res;
      this.showModal('Success');
      this.changeDetectorRef.detectChanges();
    });
  }


  override calculateDiscountOnSale() {
    return Number((this.sell.discount * this.calculatePartialTotal()).toFixed(2))
  }
  calculateSaleCost() {
    return this.sellProducts.reduce((total, product: SellProduct) => total + (product.buy_price * product.quantity_products), 0);
  }

  redirectToVentasRealizadas() {
    this.location.back()
  }
  getProductByRepayment(repayment: Repayment) {
    let name_product = ''
    this.products.forEach((product: Product) => {
      if (product.id_product === repayment.id_product) {
        name_product = product.name + ' ' + product.mark + ' ' + product.model
      }
    })
    return name_product
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
