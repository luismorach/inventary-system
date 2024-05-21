import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResponseAlert, TableColumn, TableInfo, TableResponse } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicTable } from 'src/app/utils/DinamicTable';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent extends DinamicTable {
  tableSearch!: FormGroup;
  currentData: any[] = [];
  elementToRemove!: any
  subscriptions: Subscription[] = []
  f=()=>3
  @Input() tableInfo: TableInfo = {
    tableTitle: '', searchField: '',
    enablePagination: false, enableSearch: false
  };
  @Input() dataSource: any[] = [];
  @Input() footer: any[] = [];
  @Input() tableColumns: TableColumn[] = [];

  @Output() actionEvent = new EventEmitter<TableResponse>();
  @ViewChild('pagination', { static: false }) override pagination?: ElementRef;
  @ViewChild('next', { static: false }) override next?: ElementRef;
  @ViewChild('dataTables_info', { static: false }) override info?: ElementRef;
  @ViewChild('rows', { static: false }) row?: ElementRef;

  constructor(public override renderer: Renderer2,
    protected override comunicatorSvc: ComunicatorComponetsService,
    protected override ref: ChangeDetectorRef,
  private formBuilder:FormBuilder) {
    super(renderer, ref, comunicatorSvc)

  }

  ngOnInit() {
    this.initForm()
    this.subscribeToAlertResponse()
  }

initForm() {
  this.tableSearch = this.formBuilder.group({
    search: '',
    numberRows: '10',
    campSearch: this.tableInfo.searchField,
    pagination: this.tableInfo.enablePagination
  });
}
  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }
  getClass(data:any,definition:string){
    let value=data[definition]
   
    if(this.tableInfo.tableTitle==='Kardex general'){
      value=(Number.isNaN(Number(value)))?'string':Number(value)
      return {'delete':data.type.includes('Devolución')&&(typeof(value)==='number')}
    }
    return {'update':value==='Cancelado','delete':value==='Pendiente'}
  }
  ngAfterViewInit() {
    if (this.dataSource.length > 0 && this.tableInfo.enablePagination) {
      this.currentData = JSON.parse(JSON.stringify(this.dataSource));
      this.createPages(this.tableSearch, this.currentData, this.dataSource);
      this.setFirstPageAstheCurrentPage()
    }
  }
  setFirstPageAstheCurrentPage() {
    this.subscriptions.push(this.comunicatorSvc.getData().subscribe(response => {
      if (this.tableSearch.get('search')?.value !== '') {
        this.indexCurrentPage = 0; // Set the first page as the current page
      }
      this.currentData = response;
    }));
  }

  removeElement(data: any) {
    console.log(data)
    if (this.tableInfo.enablePagination) {
      const dataIndex = this.dataSource.indexOf(data);
      this.dataSource.splice(dataIndex, 1);

      const currentDataIndex = this.currentData.indexOf(data);
      this.currentData.splice(currentDataIndex, 1);

      const values = this.getValuesToPipe(this.tableSearch);
      const rowToDeleteIndex = currentDataIndex - (values.numberRows * values.indexCurrentPage);
      console.log(rowToDeleteIndex)
      this.removeTableRow(rowToDeleteIndex);

      this.refreshDataSource();
    }
    this.ref.detectChanges()
  }
  removeTableRow(rowToDelete: number) {
    this.renderer.removeChild(this.row?.nativeElement, this.row?.nativeElement.children[rowToDelete])
  }

  refreshDataSource() {
    // Create pages based on search criteria and data
    this.createPages(this.tableSearch, this.currentData, this.dataSource)
   
  }

  handleAlertResponse(alertResponse: ResponseAlert) {
    if (alertResponse.type === 'Success') {
      this.removeElement(this.elementToRemove);
    }
  }

  getParametersToPipe(data:any, column: TableColumn) {
    let index=this.dataSource.indexOf(data)
    if (column.options instanceof Array && column.options[0]instanceof Array) {
      let currency=[column.options[0][index],column.options[1]]
      return currency
    }  
     if (column.options instanceof Array) {
      return column.options[index]
    } 
   
    return column.options

  }
  getIcon(column: TableColumn,index:number){
    if(column.definition.length>1){
      if(this.dataSource[index][column.options[0]]===column.options[1])
        return column.definition[0]
      else
        return column.definition[1]
    }
    return column.definition[0]
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
