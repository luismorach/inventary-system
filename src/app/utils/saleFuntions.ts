import { ActivatedRoute, Router } from "@angular/router";
import { ComunicatorComponetsService } from "../services/comunicator/comunicator-componets.service";
import { DinamicComponent } from "./DinamicComponent";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ChangeDetectorRef, ElementRef, ViewChild } from "@angular/core";
import { Subscription, map } from "rxjs";
import { Product, Tax, Client, Currency, Payment, SellProduct, Building, Sell, SelectInfo, ResponseAlert, SignUp } from "../interfaces/interfaces";
import { VentasService } from "../administrador/content/ventas/service/ventas.service";
import { SessionStorageService } from "../storage/session-storage.service";

export class SaleFunctions extends DinamicComponent {
    sellForm!: FormGroup;
    products: Product[] = [];
    taxes: Tax[] = [];
    clients: Client[] = [];
    selectedCurrency!: Currency;
    payments: Payment[] = [];
    sellProducts: SellProduct[] = [];
    currencies: Currency[] = [];
    selectedBuilding!: Building;
    mainCurrency!: Currency;
    availableProducts: Product[] = [];
    selectedProduct!: Product;
    subscriptions: Subscription[] = [];
    cashRegisterName: string | null = sessionStorage.getItem('name_register');
    sell: Sell = {
        id_sell: 0,
        total_sell: 0,
        currency_code: '',
        exchange: 0,
        state: '',
        type_sell: '',
        sell_products: this.sellProducts,
        total_paid: 0,
        discount: 0,
        id_user: 20,
        id_client: 2,
        pays: this.payments,
    };
    selectInfoClients: SelectInfo = {
        label: 'Cliente',
        optionName: ['names_client', 'last_names_client'],
        definitionOption: 'id_client',
        required: true
    }
    selectInfoCurrencies: SelectInfo = {
        label: 'Divisa',
        optionName: ['currency'],
        definitionOption: 'currency_code',
        required: true
    }
    constructor(
        protected override comunicatorSvc: ComunicatorComponetsService,
        protected override router: Router,
        protected fb: FormBuilder,
        protected activatedRoute: ActivatedRoute,
        protected changeDetectorRef: ChangeDetectorRef,
        protected salesService: VentasService,
        protected readonly sessionStorageService:SessionStorageService) {
        super(comunicatorSvc, router)
    }
    initForm() {
        this.sellForm = this.fb.group({
            barcode: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
            productQuantity: ['', [Validators.pattern(/^[0-9]+$/)]],
            client: [''],
            currency_code: [''],
            type_sell: ['Contado'],
            discount: ['', [Validators.pattern(/^[0-9.]+$/), this.percentValidator()]],
        });
    }
    subscribeToCurrencyChanges() {
        this.subscriptions.push(
            this.sellForm.controls['currency_code'].valueChanges.pipe(
                map(selectedCode => this.currencies.find(currency => currency.currency_code === selectedCode))
            ).subscribe(selectedCurrency => {
                if (selectedCurrency) {
                    this.selectedCurrency = selectedCurrency;
                }
            })
        );
    }

    setProducts() {
        const productsData = this.activatedRoute.snapshot.data['products'];
        if (productsData) {
            this.availableProducts = productsData;
        }
    }
    setCurrencies() {
        const currenciesData = this.activatedRoute.snapshot.data['currencies'];
        if (currenciesData) {
            const { currencies, mainCurrency } = currenciesData;
            const mainCurrencyItem = mainCurrency[0];

            this.currencies = [{
                currency_code: '', currency: 'Selecccione la divisa',
                country: '', country_code: '', language: '', language_code: '', exchange: 0
            }
            ].concat(currencies)

            this.mainCurrency = mainCurrencyItem;
            this.selectedCurrency = mainCurrencyItem;
            this.sellForm.get('currency_code')?.setValue(mainCurrencyItem.currency_code);
            this.selectedCurrency = mainCurrency[0]
        }
    }

    setClients() {
        const clientsData = this.activatedRoute.snapshot.data['clients'];
        if (clientsData) {
            this.clients = [{
                document_type: '', document_number: 9, address_provider: '',
                names_client: 'Selecione el cliente', name_boss: '', phone_number: 8, email: '',
                id_provider: -1
            }, ...clientsData];
            this.sellForm.get('client')?.setValue(0);
        }
    }
    subscribeToAlertResponse() {
        this.subscriptions.push(
            this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
        );
    }

    handleAlertResponse(response: ResponseAlert) {
        switch (response.type) {
            case 'Success':
                if (this.msj.title.includes('Pago Registrado')) {
                    const lastPayment = this.payments[this.payments.length - 1];
                    const payCurrency = this.currencies.find(element => element.currency_code === lastPayment.currency_code);
                    if (payCurrency &&
                        this.comunicatorSvc.converter(this.sell.total_paid, this.mainCurrency, payCurrency) >=
                        this.comunicatorSvc.converter(this.calculateTotalAmount(), this.mainCurrency, payCurrency)) {
                        this.registerSale();
                    }
                }
                break;

            case 'availableProducts':
                if (response.response instanceof Object) {
                    this.selectedProduct = response.response as Product;
                }
                break;

            case 'Quantity':
                const quantityResponse = Number(response.response);
                if (quantityResponse) {
                    this.validateProduct(this.selectedProduct, quantityResponse, '',
                        this.checkEnoughExistence.bind(this), this.addProduct.bind(this));
                }
                break;

            case 'pay':
                if (response.response instanceof Object) {
                    this.registerPayment(response.response as Payment);
                }
                break;

            default:
                break;
        }
    }
    open(alert: ElementRef | undefined) {
        alert?.nativeElement.showModal()
    }
    updateClientList(newClient: Client, client: ElementRef | undefined) {
        this.clients.push(newClient)
        this.sellForm.get('client')?.setValue(newClient.id_client)
        client?.nativeElement.close()
    }
    getProduct() {
        let product = this.availableProducts.find((res) => res.barcode === this.sellForm.get('barcode')?.value)
        return product
    }
    getQuantity() {
        let quantity: number = (this.sellForm.get('productQuantity')?.value === '') ?
            1 : Number((this.sellForm.get('productQuantity')?.value))
        return quantity
    }
    checkAdded(product: Product) {
        this.selectedProduct = product
        const isAdded = this.products.includes(product)
        if (isAdded) {
            this.msj.description = 'Este producto ya se encuentra agregado a la venta'
        }
        return isAdded
    }
    checkEmptyExistence(product: Product): boolean {
        const noExistence = product.exist_quantity === 0
        if (noExistence) {
            this.msj.description = 'No hay existencias de este producto para vender'
        }
        return noExistence
    }
    checkEnoughExistence(product: Product, quantity: number): boolean {
        const isQuantityExceedingExistence = quantity > product.exist_quantity;
        if (isQuantityExceedingExistence) {
            this.msj.description = 'La cantidad a ingresar del producto es superior a la existente';
        }
        return isQuantityExceedingExistence;
    }

    checkProductExistence(product: Product | undefined): boolean {
        const productDoesNotExist = product === undefined;
        if (productDoesNotExist) {
            this.msj.description = 'No existe un producto con ese código de barras';
        }
        return productDoesNotExist;
    }
    validateProduct(product: Product | undefined, quantity: number, message: string, ...validators: any) {
        for (let validator of validators) {
            if (validator.name.includes('Quantity')) {
                validator(message);
            } else if (validator(product, quantity)) {
                throw new Error(this.msj.description);
            }
        }
    }

    addProduct(product: Product, quantity: number) {
        const newSellProduct = {
            id_sell: 0,
            id_product: product.id_product,
            buy_price: product.cost,
            sell_price: product.price,
            discount_product: product.discount,
            tax_rate: product.tax_rate,
            quantity_products: quantity,
            exist_products: product.exist_quantity,
            quantity_back: 0
        };

        this.sellProducts.push(newSellProduct);
        this.products.push(product);
        this.addTaxes(product as any);
        this.showProductModal(false)
        this.changeDetectorRef.detectChanges();

        return false;
    }
    showProductModal(show: boolean) {
        this.showProductsListAlert({
            showAlert: show,
            currentProducts: this.products,
            productsList: this.availableProducts,
            actionType: 'venta'
        });
    }
    addTaxes(tax: Tax) {
        this.taxes.push(tax)
    }

    calculateSubtotal(index: number) {
        const selectedProduct = this.products[index];
        const price = selectedProduct.price;
        const discountPercent = selectedProduct.discount;
        const discountValue = Number((price * discountPercent).toFixed(2))
        const quantity = this.sellProducts[index].quantity_products;
        const priceWithDiscount = price - discountValue;
        const subtotal = Number((priceWithDiscount * quantity).toFixed(2));
        return subtotal;
    }

    calculatePartialTotal(): number {
        return this.products.reduce((total, product, index) => total + this.calculateSubtotal(index), 0);
    }
    calculateDiscountOnSale() {
        const discountPercentage = Number(this.sellForm.get('discount')?.value) / 100;
        const totalAmount = this.calculatePartialTotal();
        const discountAmount = Number((discountPercentage * totalAmount).toFixed(2));
        return discountAmount;
    }

    calculateTaxAmount(taxRate: number): number {
        let taxableAmount = 0;

        const filteredProducts = this.products.filter((product: Product) => product.tax_rate > 0 && product.tax_rate === taxRate);
        taxableAmount = filteredProducts.reduce((total, product) => {
            const price = product.price;
            const discountPercent = product.discount;
            const discountValue = Number((price * discountPercent).toFixed(2))
            const quantity = this.sellProducts[this.products.indexOf(product)].quantity_products;
            const priceWithDiscount = price - discountValue;
            return total + (product.tax_rate * priceWithDiscount) * quantity;
        }, 0);

        return taxableAmount;
    }
    calculateTotalAmount(): number {
        let totalTaxableAmount: number = 0;
        let totalAmount: number = this.calculatePartialTotal();
        let totalDiscount: number = this.calculateDiscountOnSale();

        this.products.forEach((product: Product) => {
            totalTaxableAmount += this.calculateTaxAmount(product.tax_rate);
        });

        return Number((totalAmount + totalTaxableAmount - totalDiscount).toFixed(2));
    }

    deleteProductOnSale(index: number): void {
        this.products.splice(index, 1);
        this.sellProducts.splice(index, 1);
        this.taxes.splice(index, 1);
    }

    validateSale(): { isValid: boolean, msj: string } {
        if (this.products.length === 0) {
            return { isValid: false, msj: 'Agrege productos a la venta' };
        }
        for (let index = 0; index < this.products.length; index++) {
            const product = this.products[index];
            const sellProduct = this.sellProducts[index];

            if (sellProduct.quantity_products === 0) {
                return { isValid: false, msj: 'La cantidad a vender del producto ' + product.name + ' no puede ser 0' };
            }

            if (sellProduct.quantity_products > product.exist_quantity) {
                return { isValid: false, msj: 'La cantidad a vender del producto ' + product.name + ' es mayor a la existente' };
            }
        }

        if (this.sellForm.get('type_sell')?.value === 'Crédito' && this.sellForm.get('client')?.value === 0) {
            return { isValid: false, msj: 'Para realizar una venta al crédito debe seleccionar un cliente' };
        }

        if (this.calculateTotalAmount() < this.sell.total_paid) {
            return { isValid: false, msj: 'EL monto pagado por el cliente es mayor al total a pagar por la venta' };
        }

        if (Number(this.sellForm.get('client')?.value) === 0 && this.sellForm.get('type_sell')?.value === 'Crédito') {
            return { isValid: false, msj: 'Para una venta a crédito debe seleccionar un cliente' };
        }
        if (this.sellForm.get('discount')?.invalid) {
            return { isValid: false, msj: 'El descuento ingresado no es valido' }
        }


        return { isValid: true, msj: '' };
    }

    addPayment() {
        const typeSell = this.sellForm.get('type_sell')?.value;
        if (typeSell === 'Contado') {
            const totalAmount = this.calculateTotalAmount();
            this.showModalPayment({ totalAmount, totalPaid: this.sell.total_paid, showAlert: true });
        } else {
            this.registerSale();
        }
    }
    registerPayment(payment: Payment) {
        this.sell.total_paid += this.comunicatorSvc.converterToMainCoin(payment.mount, payment.exchange);
        payment.id_user = Number(this.sessionStorageService.getItem<SignUp>('user')?.id_user),
        this.payments.push(payment);
        this.msj.title = '¡Pago Registrado!';
        this.msj.description = 'El pago se registró con éxito en el sistema';
        this.showModal('Success');

    }
    registerSale() {
        this.showModalPayment({ totalAmount: this.calculateTotalAmount(), totalPaid: this.sell.total_paid, showAlert: false })

        const totalAmount = this.calculateTotalAmount();
        const discount = (this.sellForm.get('discount')?.value === '') ? 0 : (this.sellForm.get('discount')?.value / 100);
        const typeSell = this.sellForm.get('type_sell')?.value;
        const state = (typeSell === 'Contado') ? 'Cancelado' : 'Pendiente';


        this.sell.total_sell = totalAmount,
            this.sell.id_user = Number(this.sessionStorageService.getItem<SignUp>('user')?.id_user),
            this.sell.currency_code = this.mainCurrency.currency_code,
            this.sell.exchange = this.mainCurrency.exchange,
            this.sell.discount = discount,
            this.sell.type_sell = typeSell,
            this.sell.state = state,
            this.sell.id_client = this.sellForm.get('client')?.value

        this.salesService.setSell(this.sell).subscribe(res => {
            this.msj = res;
            this.showModal('Success');
            this.clearSale();
        });
    }

    closeModal(alert: ElementRef | undefined) {
        alert?.nativeElement.close()
    }
    clearSale() {
        const productsMap = new Map<number, Product>();
        this.availableProducts.forEach((product: Product) => {
            productsMap.set(product.id_product, product);
        });

        this.sellProducts.forEach((sellProduct: SellProduct) => {
            const product = productsMap.get(sellProduct.id_product);
            if (product) {
                product.exist_quantity -= sellProduct.quantity_products;
            }
        });

        this.products = [];
        this.payments = [];
        this.sellProducts = [];
        this.sell.total_paid = 0;
        this.taxes = [];
        this.sellForm.reset({
            currency_code:this.mainCurrency.currency_code,
            type_sell:'Contado',
            client:0,
        })
        this.selectedCurrency=JSON.parse(JSON.stringify(this.mainCurrency))
        this.changeDetectorRef.detectChanges();
    }

}