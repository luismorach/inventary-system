import { ChangeDetectionStrategy, Component} from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, TableColumn, TableInfo } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-lo-mas-vendido',
  templateUrl: './lo-mas-vendido.component.html',
  styleUrls: ['./lo-mas-vendido.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoMasVendidoComponent extends DinamicComponent {

  products: Product[] = [];
  productToDelete!: Product;
  tableInfo: TableInfo = {
    tableTitle: 'Lo más vendido',
    searchField: '',
    enablePagination: true,
    enableSearch:false
  }
  
  tableColumns: TableColumn[] = [
    { columnLabel: 'Código de barra', definition: ['barcode'], columnType: '' },
    { columnLabel: 'Descripción', definition: ['name','mark','model'], columnType: '' },
    { columnLabel: 'Cantidad vendida', definition: ['sell_quantity'], columnType: '' },
    { columnLabel: 'Cantidad existente', definition: ['exist_quantity'], columnType: '' },
   
  ]

  constructor(private fb: FormBuilder,
    protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router, private route: ActivatedRoute,) {
    super(comunicatorSvc, router)
  }
  ngOnInit() {
    this.setTitleAndIcon(3,"fa fa-fire-alt fa-fw")
    this.setProducts()
  }
  setProducts() {
    const data = this.route.snapshot.data;
    if (data['products']) {
      this.products = data['products'];
    }
  }
}
