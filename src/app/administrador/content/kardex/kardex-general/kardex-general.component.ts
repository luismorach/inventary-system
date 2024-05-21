import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { Kardex, Currency, TableColumn, TableInfo, TableResponse } from 'src/app/interfaces/interfaces';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-kardex-general',
  templateUrl: './kardex-general.component.html',
  styleUrls: ['./kardex-general.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class KardexGeneralComponent extends DinamicComponent {
  kardex: Kardex[] = []
  mainCoin!: Currency
  date = new Date()
  initialDate: Date = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
  endDate: Date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)
  criterio!: string | null;
  tableInfo: TableInfo = {
    header:[
      {label:'',rowSpan:1,colSpan:3},
      {label:'Entradas',rowSpan:1,colSpan:3},
      {label:'Salidas',rowSpan:1,colSpan:3},
      {label:'Saldo',rowSpan:1,colSpan:3},
      {label:'',rowSpan:2,colSpan:1},
    ],
    tableTitle: 'Kardex general',
    searchField: '',
    enablePagination: true,
    enableSearch: false
  }

  tableColumns!: TableColumn[]
  
  constructor(
    public override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router,
    private route: ActivatedRoute, private ref: ChangeDetectorRef) {
    super(comunicatorSvc,router)
  }
  ngOnInit() {
    this.setTitleAndIcon(3,"fas fa-pallet fa-fw")
    this.initDates()
    this.setMainCurrency()
    this.setKardex()
    this.initTable()
  }
  initDates(){
    const initialDate = this.route.snapshot.queryParamMap.get('initialDate')
    const endDate = this.route.snapshot.queryParamMap.get('endDate')
    this.criterio = this.route.snapshot.queryParamMap.get('barcode')
    this.initialDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
    this.endDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)
    if (initialDate && endDate) {
      this.initialDate = new Date(initialDate),
        this.endDate = new Date(endDate)
    }
  }
  getQuantity(type:string,value:number){
    if(type.includes('Devolución'))
      return value*-1
    return value
  }
  setKardex(){
    const kardexData=this.route.snapshot.data['kardex'];
    if (kardexData) {
      this.kardex = kardexData.map((kardex:any)=>({
        ...kardex, 
        quantityOnBuy:(kardex.type.includes('compra'))?this.getQuantity(kardex.type,kardex.quantity_products):undefined,
        priceOnBuy:(kardex.type.includes('compra'))?kardex.sell_price:undefined,
        totalOnBuy:(kardex.type.includes('compra'))?kardex.quantity_products*kardex.sell_price:undefined,
        quantityOnSale:(kardex.type.includes('venta'))?this.getQuantity(kardex.type,kardex.quantity_products):undefined,
        priceOnSale:(kardex.type.includes('venta'))?kardex.sell_price:undefined,
        totalOnSale:(kardex.type.includes('venta'))?kardex.quantity_products*kardex.sell_price:undefined,
        total:kardex.exist*kardex.weighted_averages_sell
      }))
    }
  }
  setMainCurrency(){
    if (this.route.snapshot.data['mainCurrency']) {
      this.mainCoin = this.route.snapshot.data['mainCurrency'][0]
    }
  }
  initTable() {
    
    this.tableColumns = [
      { columnLabel: 'Detalle', definition: ['type'], columnType: '' },
      { columnLabel: 'Producto', definition: ['name','mark','model'], columnType: '' },
      { columnLabel: 'Cantidad', definition: ['quantityOnBuy'], columnType: '' },
      { columnLabel: 'Costo', definition: ['priceOnBuy'], columnType: '',pipeType:'currency',
      options:[this.kardex,this.mainCoin] },
      { columnLabel: 'Total', definition: ['totalOnBuy'], columnType: "",pipeType:'currency',
      options:[this.kardex,this.mainCoin] },
      { columnLabel: 'Cantidad', definition: ['quantityOnSale'], columnType: '',},
      { columnLabel: 'Costo', definition: ['priceOnSale'], columnType: '',pipeType:'currency',
      options:[this.kardex,this.mainCoin] },
      { columnLabel: 'Total', definition: ['totalOnSale'], columnType: "",pipeType:'currency',
      options:[this.kardex,this.mainCoin] },
      { columnLabel: 'Cantidad', definition: ['exist'], columnType: ''},
      { columnLabel: 'Costo', definition: ['weighted_averages_sell'], columnType: '',pipeType:'currency',
      options:this.mainCoin },
      { columnLabel: 'Total', definition: ['total'], columnType: "",pipeType:'currency',
      options:this.mainCoin },
      {
        columnLabel: '', definition: ["fas fa-pallet fa-fw update"],columnType: 'kardex_detail'
      },
    ]
  }

  redirectToDetallesKardex(tableResponse:TableResponse) {
    this.router.navigate(['/administrador/kardex/detalles kardex/'+tableResponse.value.type+'/'+
    tableResponse.value.id_operation+'/'+tableResponse.value.id_product])
  }

  
}
