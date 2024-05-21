import { ChangeDetectionStrategy,Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Currency, BuyProduct, Kardex, Product, Repayment, Sell, SellProduct } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { Location } from '@angular/common';
import { Subscription} from 'rxjs';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-detalles-kardex',
  templateUrl: './detalles-kardex.component.html',
  styleUrls: ['./detalles-kardex.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetallesKardexComponent extends DinamicComponent {
  productOperation!: BuyProduct | SellProduct
  sell!: Sell
  repayment!: Repayment
  ruta!: string
  kardex!: Kardex
  mainCoin!: Currency
  currency!: Currency
  product!: Product
  subscriptions: Subscription[] = []
  constructor(protected override router: Router,
    public override comunicatorSvc: ComunicatorComponetsService,
    private route: ActivatedRoute,
    private location: Location) {
    super(comunicatorSvc,router)
  }
  ngOnInit() {
    this.setTitleAndIcon(3,"fas fa-pallet fa-fw")
    this.setMainCurrency()
    this.setKardex()
  }
  setMainCurrency(){
    if (this.route.snapshot.data['mainCurrency']) {
      this.mainCoin = this.route.snapshot.data['mainCurrency'][0]
    }
  }
  setKardex(){
    if (this.route.snapshot.data['kardex']) {
      this.kardex = this.route.snapshot.data['kardex'].kardex
      this.product = this.route.snapshot.data['kardex'].kardex
      this.currency = this.route.snapshot.data['kardex'].currency[0]
      switch (this.kardex.type) {
        case 'compra':
          this.productOperation = this.route.snapshot.data['productBuy'][0]
          break;
        case 'venta':
          this.productOperation = this.route.snapshot.data['productSell'].productSell[0]
          this.sell = this.route.snapshot.data['productSell'].sell[0]
          break;
        default:
          this.productOperation = this.route.snapshot.data['productRepayment'][0]
          break;
      }
    }
  }

  calcularMontoImponible(price: number) {
    let price_wiht_discount = Number((price - (Number((price * this.productOperation.discount_product).toFixed(2)))).toFixed(2))
    let montoImponible = Number((this.productOperation.tax_rate * price_wiht_discount).toFixed(2))
    return montoImponible
  }
  calcularDescuentoVenta() {
    let price_with_discount = Number(((this.productOperation.sell_price - Number((this.productOperation.sell_price *
      this.productOperation.discount_product).toFixed(2))) * this.productOperation.quantity_products).toFixed(2))
    let discount_sell = price_with_discount * this.sell.discount
    price_with_discount -= discount_sell
    price_with_discount += this.calcularMontoImponible(this.productOperation.sell_price) *
      this.productOperation.quantity_products
    return { price: price_with_discount, value_discount: discount_sell }
  }

  redirectToKardex() {
    this.location.back()
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
