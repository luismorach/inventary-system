import { ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableColumn, TableInfo, TableResponse } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-compras-realizadas',
  templateUrl: './compras-realizadas.component.html',
  styleUrls: ['./compras-realizadas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComprasRealizadasComponent extends DinamicComponent {

  buys: any[] = [];
  date = new Date()
  initialDate: Date = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
  endDate: Date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)
  criterio: string | null = null;
  tableInfo: TableInfo = {
    tableTitle: 'Compras realizadas',
    searchField: '',
    enablePagination: true,
    enableSearch:false
  }
  
  tableColumns!: TableColumn[]

  constructor(
    public override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef) {
    super(comunicatorSvc,router)
  }
  ngOnInit() {
    this.setTitleAndIcon(3,"fas fa-file-invoice-dollar fa-fw")
    this.initDates()
    this.setBuys()
    this.initTable()
  }
  initDates(){
    const initialDate = this.route.snapshot.queryParamMap.get('initialDate')
    const endDate = this.route.snapshot.queryParamMap.get('endDate')
    this.criterio = this.route.snapshot.queryParamMap.get('criterio')
    this.initialDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
    this.endDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)
    if (initialDate && endDate) {
     
      this.initialDate = new Date(initialDate+'T00:00:00'),
      this.endDate = new Date(endDate+'T00:00:00')
    }
  }
  setBuys(){
    if (this.route.snapshot.data['buys']) {
      this.buys = this.route.snapshot.data['buys']
    }
  }
  initTable(){
    this.tableColumns= [
      { columnLabel: 'N° factura', definition: ['id_buy'], columnType: '' },
      { columnLabel: 'Fecha', definition: ['date'], columnType: '',pipeType:'date',options:'dd/MM/yyyy' },
      { columnLabel: 'Hora', definition: ['time'], columnType: '',pipeType:'date',options:'HH:mm:ss aaaa'},
      { columnLabel: 'Proveedor', definition: ['name_provider'], columnType: ''},
      { columnLabel: 'Usuario', definition: ['names_user','last_names_user'], columnType: '',},
      { columnLabel: 'Total', definition: ['total_buy'], columnType: '',pipeType:'currency',options:this.buys },
      { columnLabel: '', definition: ['fas fa-shopping-bag fa-fw buy_detail'], columnType: 'buy_detail' },
    ]
  }
  redirectToDetallesCompra(tableResponse:TableResponse) {
    this.router.navigate(['/administrador/compras/detalles compra/'+tableResponse.value.id_buy])
  }

 
}
