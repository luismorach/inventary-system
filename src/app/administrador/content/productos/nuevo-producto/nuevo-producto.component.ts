import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormBuilder,FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Product, Tax, ResponseAlert, ValidationResult, SelectInfo } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { CategoriasService } from '../../administracion/categorias/service/categorias.service';
import { ProductosService } from '../service/productos.service';
import { Subscription } from 'rxjs';
import { ImpuestosService } from '../../configuraciones/service/impuestos.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NuevoProductoComponent extends DinamicComponent {
  formNewProduct!: FormGroup;
  categories!: Category[]
  taxes!: Tax[]
  id_product!: number;
  productToUpdate!: Product
  type: string = ''
  subscriptions: Subscription[] = []
  selectInfoCategories: SelectInfo = {
    label: 'Categoría',
    optionName: ['name'],
    definitionOption: 'id_category',
    required: true
  }
  selectInfoTaxes: SelectInfo = {
    label: 'Impuesto',
    optionName: ['tax_name'],
    definitionOption: 'tax_id',
    required: true
  }
  selectInfoGaranty: SelectInfo = {
    label: 'Garantia',
    optionName: ['option'],
    definitionOption: 'value',
    required: true
  }
  selectOptionsGaranty = [
    { option: 'Seleccione la garantia del producto', value: '' },
    { option: 'Habilitada', value: 'Habilitada' },
    { option: 'Deshabilitada', value: 'Deshabilitada' }
  ]

  selectInfoTimeGaranty: SelectInfo = {
    label: 'Garantia',
    optionName: ['option'],
    definitionOption: 'value',
    required: true
  }
  selectOptionsTimeGaranty = [
    { option: 'Seleccione el tiempo de garantia', value: '' },
    { option: 'Dia/s', value: 'Dia/s' },
    { option: 'Semana/s', value: 'Semana/s' },
    { option: 'Mes/es', value: 'Mes/es' },
    { option: 'Año/s', value: 'Año/s' }
  ]

  handleServerResponse = {
    next: (res: any) => {
      this.msj = res
      this.showModal('Success');
      this.clearFormFields()
    }
  }

  constructor(private fb: FormBuilder,
    protected override comunicatorSvc: ComunicatorComponetsService,
    private categoriesSvc: CategoriasService,
    private impuestosSvc: ImpuestosService,
    private productsSvc: ProductosService,
    protected override router: Router,
    private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef) {
    super(comunicatorSvc, router);
  }
  ngOnInit() {
    this.setTitleAndIcon(3, "fas fa-box fa-fw")
    this.initForm()
    this.setProduct()
    this.setCategories()
    this.setTaxes()
    this.subscribeToAlertResponse()
    this.formNewProduct.controls['garanty'].valueChanges.subscribe(() => this.addValidations())
  }

  initForm() {
    this.formNewProduct = this.fb.group({
      barcode: ['', [Validators.required, Validators.pattern(/^[0-9]+$/),Validators.maxLength(30)]],
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ 0-9\u00f1\u00d1]+$/),
        Validators.maxLength(30)]],
      mark: ['', [Validators.pattern(/^[a-zA-ZÀ-ÿ 0-9\u00f1\u00d1]+$/),Validators.maxLength(30)]],
      model: ['', [Validators.pattern(/^[a-zA-ZÀ-ÿ 0-9\u00f1\u00d1]+$/),Validators.maxLength(30)]],
      discount: ['', [Validators.required,Validators.maxLength(6),Validators.pattern(/^[0-9.]+$/),this.percentValidator()]],
      garanty: ['', [Validators.required]],
      time_garanty: [''],
      time_unit: [''],
      id_category: [-1, [Validators.min(0)]],
      tax_id: [-1, [Validators.min(0)]],
      can_expir: ['true']
    });
  }
  setProduct() {
    this.addValidations();
    const data = this.route.snapshot.data;
    if (data['product']) {
      const productData = this.route.snapshot.data['product'][0];
      this.productToUpdate = this.route.snapshot.data['product'][0];
      this.formNewProduct.patchValue({
        barcode: productData.barcode,
        name: productData.name,
        mark: productData.mark,
        model: productData.model,
        discount: productData.discount * 100,
        garanty: productData.garanty,
        can_expir: productData.can_expir.toString(),
        time_garanty: productData.time_garanty,
        time_unit: productData.time_unit,
        id_category: productData.id_category.toString(),
        tax_id: productData.tax_id.toString()
      });
    }
  }
  setCategories() {
    this.subscriptions.push(this.categoriesSvc.getCategories().subscribe(categories => {
      this.categories = [{
        id_category: -1, name: 'Seleccione la categoría para este producto',
        ubication: ''
      }].concat(categories)
      this.changeDetectorRef.detectChanges()
    }))
  }
  setTaxes() {
    this.subscriptions.push(this.impuestosSvc.getTaxes().subscribe(taxes => {
      this.taxes = [{
        tax_id: -1, tax_name: 'Seleccione el impuesto para este producto',
        tax_rate: 0, show_tax: ''
      }].concat(taxes)
      this.changeDetectorRef.detectChanges()
    }

    ))
  }
  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }

  addValidations() {

    if (this.formNewProduct.get('garanty')?.value === 'Habilitada') {
      this.formNewProduct.get('time_unit')?.setValue('')
      this.formNewProduct.get('time_garanty')?.setValue('')
      this.formNewProduct.get('time_unit')?.setValidators([this.zeroValidator(),
      Validators.required, Validators.pattern(/^[0-9]+$/),Validators.maxLength(5)])
      this.formNewProduct.get('time_garanty')?.setValidators([Validators.required])
    } else {
      this.formNewProduct.get('time_unit')?.setValue(0)
      this.formNewProduct.get('time_garanty')?.setValue(null)
      this.formNewProduct.get('time_unit')?.clearValidators()
      this.formNewProduct.get('time_garanty')?.clearValidators()
    }
    this.formNewProduct.get('time_unit')?.updateValueAndValidity()
    this.formNewProduct.get('time_garanty')?.updateValueAndValidity()
    this.changeDetectorRef.detectChanges()
  }

  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Success' && this.type === 'update')
      this.redirectToListProducts()

    if (response.type === 'Warning' && response.response) {
      const action: { [key: string]: any } = {
        create: this.createProduct,
        update: this.updateProduct
      }
      const handler = action[this.type].bind(this)
      handler()
    }
  }
  createProduct() {
    let product = this.formNewProduct.value
    product.discount = product.discount / 100
    this.productsSvc.setProducto(this.formNewProduct.value).subscribe(this.handleServerResponse)
  }
  updateProduct() {
    let product: Product = this.formNewProduct.value
    product.cost = this.productToUpdate.cost;
    product.price = this.productToUpdate.price;
    product.expir = this.productToUpdate.expir
    product.exist_quantity = this.productToUpdate.exist_quantity
    product.discount = product.discount / 100
    this.productsSvc.updateProducto(this.productToUpdate.id_product, product).subscribe(
      this.handleServerResponse)
  }

  validateUpdate(): ValidationResult {
    let validationResult: ValidationResult = { isValid: true, message: '' };
    const formValues = this.formNewProduct.value;
    const productValues: any = this.productToUpdate;

    const keysToCheck = ['barcode', 'name', 'mark', 'model', 'discount', 'garanty', 'time_garanty',
      'time_unit', 'id_category', 'tax_id', 'can_expir']

    const isDataModified = keysToCheck.some(key => {

      if (key === 'discount') {
        return formValues[key] != productValues[key] * 100;
      }
      if (key === 'can_expir') {
        return formValues[key] != productValues[key].toString();
      }
      return formValues[key] != productValues[key];
    });

    if (!isDataModified) {
      validationResult = { isValid: false, message: 'No ha modificado los datos' };
    }

    if (this.formNewProduct.invalid) {
      validationResult = { isValid: false, message: 'Existen datos inválidos' };
    }

    return validationResult;
  }


  redirectToListProducts() {
    this.router.navigate(['/administrador/productos/productos en almacen'])
  }


  clearFormFields() {
    this.formNewProduct.reset({
      garanty: '',
      time_garanty: '',
      id_category: -1,
      tax_id: -1,
      can_expir: 'true'

    })
  }
  //Función que valida que el número no sea cero
  zeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: any = control.value;
      return value == 0 ? { 'invalid': value } : null;
    };
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
