import { ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { Product, TableColumn, TableInfo } from 'src/app/interfaces/interfaces';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-productos-por-vencimiento',
  templateUrl: './productos-por-vencimiento.component.html',
  styleUrls: ['./productos-por-vencimiento.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductosPorVencimientoComponent extends DinamicComponent {
  products: Product[] = [];
  productToDelete!: Product;
  subscriptions: Subscription[] = []
  tableInfo: TableInfo = {
    tableTitle: 'Productos por vencimiento',
    searchField: '',
    enablePagination: true,
    enableSearch:false
  }
  
  tableColumns: TableColumn[] = [
    { columnLabel: 'Código de barra', definition: ['barcode'], columnType: '' },
    { columnLabel: 'Descripción', definition: ['name','mark','model'], columnType: '' },
    { columnLabel: 'Garantia', definition: ['garanty'], columnType: '' },
    { columnLabel: 'Vencimiento', definition: ['expir'], columnType: '',pipeType:'date',options:'dd-MM-yyyy' },
    { columnLabel: 'Cantidad existente', definition: ['exist_quantity'], columnType: '' },
  ]

  constructor(protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router, private route: ActivatedRoute,
    private ref: ChangeDetectorRef) {
    super(comunicatorSvc,router)
  }
  ngOnInit() {
    this.setTitleAndIcon(3,"fas fa-history fa-fw")
    this.setProducts()
  }
setProducts(){
    this.route.data.subscribe(data => {
      if (data['products']) {
        this.products = data['products'];
      }
    });
}
 

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
