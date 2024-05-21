import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription} from 'rxjs';
import { Currency, Product, ResponseAlert, TableColumn, TableInfo, TableResponse } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { ProductosService } from '../service/productos.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-productos-en-almacen',
  templateUrl: './productos-en-almacen.component.html',
  styleUrls: ['./productos-en-almacen.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductosEnAlmacenComponent extends DinamicComponent {
  tableSearch!: FormGroup;
  products: Product[] = [];
  productToDelete!: Product;
  mainCurrency?: Currency
  subscriptions:Subscription[]=[]
  tableInfo: TableInfo = {
    tableTitle: 'Productos en el almacen',
    searchField: 'name',
    enablePagination: true,
    enableSearch:true
  }
  
  tableColumns!: TableColumn[]

  constructor(public override comunicatorSvc: ComunicatorComponetsService, 
    protected override router: Router,
    private productosSvc: ProductosService,
    private ref:ChangeDetectorRef,
    private route:ActivatedRoute) {
    super(comunicatorSvc,router)
  }
  ngOnInit() {
    this.setTitleAndIcon(3,"fa fa-boxes fa-fw")
    this.setMainCurrency()
    this.setProducts()
    this.initTable()
    this.subscribeToAlertResponse()
  }
  setProducts(){
    const data = this.route.snapshot.data;
    if (data['products']) {
      this.products = data['products'];
    }
  }
setMainCurrency(){
    const mainCurrency = this.route.snapshot.data['mainCurrency'];
    if (mainCurrency) {
      this.mainCurrency = mainCurrency[0];
    } 
}
initTable(){
  this.tableColumns= [
    { columnLabel: 'Código de barra', definition: ['barcode'], columnType: '' },
    { columnLabel: 'Descripción', definition: ['name','mark','model'], columnType: '' },
    { columnLabel: 'Precio de compra', definition: ['cost'], columnType: '',
        pipeType:'currency',options:this.mainCurrency },
    { columnLabel: 'Precio de venta', definition: ['price'], columnType: '',
        pipeType:'currency',options:this.mainCurrency },
    { columnLabel: 'Descuento', definition: ['discount'], columnType: '',
        pipeType:'percent',options:'1.2-2' },
    { columnLabel: 'Vendidos', definition: ['sell_quantity'], columnType: '' },
    { columnLabel: 'Existente', definition: ['exist_quantity'], columnType: '' },
    { columnLabel: '', definition: ['fa fa-arrows-rotate update'], columnType: 'update' },
    { columnLabel: '', definition: ['fa fa-trash-can delete'], columnType: 'delete' },
  ]
}
  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }
  
  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Warning' && response.response)
      this.deleteProduct(this.productToDelete)
  }

  redirectToUpdate(data: Product) {
    this.router.navigate(['/administrador/productos/actualizar producto/' + data.id_product])
  }
  deleteProduct(data: Product) {
      this.productosSvc.deleteProducto(data.id_product).subscribe({
        next: res => {
          this.msj = res
          this.showModal('Success');
        }
      })
  }
  processTableResponse(response: TableResponse) {
    switch (response.responseType) {
      case 'update':
        this.redirectToUpdate(response.value)
        break
      case 'delete':
        this.productToDelete = response.value
        this.showModalWarning('El producto sera eliminado del sistema y al hacerlo se eliminarán '+
        'todas las compras, ventas y devoluciones asociadas al mismo ¿desea continuar?')
        break

    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription)?subscription.unsubscribe():null)
  }

}
