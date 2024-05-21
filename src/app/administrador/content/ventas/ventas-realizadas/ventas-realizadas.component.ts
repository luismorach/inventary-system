import { ChangeDetectionStrategy, Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { TableColumn, TableInfo, TableResponse} from 'src/app/interfaces/interfaces';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';
@Component({
  selector: 'app-ventas-realizadas',
  templateUrl: './ventas-realizadas.component.html',
  styleUrls: ['./ventas-realizadas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VentasRealizadasComponent extends DinamicComponent {

  date = new Date()
  initialDate: Date = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
  endDate: Date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)
  criterio: string | null = null;
  sales: any[] = []
  tableInfo: TableInfo = {
    tableTitle: 'Ventas realizadas',
    searchField: '',
    enablePagination: true,
    enableSearch:false
  }
  
  tableColumns!: TableColumn[]


  constructor( protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router,
    private route: ActivatedRoute) {
    super(comunicatorSvc,router)

  }
  ngOnInit() {
    this.setTitleAndIcon(3,"fas fa-coins fa-fw")
    this.initDates()
    this.setSales()
    this.initTable()
  }
  initDates(){
    const initialDate = this.route.snapshot.queryParamMap.get('initialDate')
    const endDate = this.route.snapshot.queryParamMap.get('endDate')
    this.criterio = this.route.snapshot.queryParamMap.get('criterio')
    this.initialDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
    this.endDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)
    if (initialDate && endDate) {
      this.initialDate = new Date(initialDate),
        this.endDate = new Date(endDate)
    }
  }
  initTable(){
    this.tableColumns= [
      { columnLabel: 'N° factura', definition: ['id_sell'], columnType: '' },
      { columnLabel: 'Fecha', definition: ['date'], columnType: '',pipeType:'date',options:'dd/MM/yyyy' },
      { columnLabel: 'Hora', definition: ['time'], columnType: '',pipeType:'date',options:'HH:mm:ss aaaa'},
      { columnLabel: 'Cliente', definition: ['names_client','last_names_client'], columnType: ''},
      { columnLabel: 'Vendedor', definition: ['names_user','last_names_user'], columnType: '',},
      { columnLabel: 'Total', definition: ['total_sell'], columnType: '',pipeType:'currency',options:this.sales },
      { columnLabel: 'Estado', definition: ['state'], columnType: ""},
      { columnLabel: '', definition: ['fas fa-cart-plus fa-fw update'], columnType: 'sale_detail' },
    ]
  }

setSales(){
    const sellsData = this.route.snapshot.data['sells'];
    if (sellsData) {
        this.sales = sellsData;
    }
}

  redirectToDetallesVenta(tableResponse:TableResponse) {
    console.log(tableResponse)
    this.router.navigate(['/administrador/ventas/detalles venta/'+tableResponse.value.id_sell])
  }

}
