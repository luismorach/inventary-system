import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, mergeMap } from 'rxjs';
import { Currency, Repayment, TableColumn, TableInfo, TableResponse, User } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicTable } from 'src/app/utils/DinamicTable';
import { DevolucionesService } from '../service/devoluciones.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-devoluciones-realizadas',
  templateUrl: './devoluciones-realizadas.component.html',
  styleUrls: ['./devoluciones-realizadas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevolucionesRealizadasComponent extends DinamicComponent {
  date = new Date()
  initialDate: Date = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
  endDate: Date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)
  criterio: string | null = null;
  repayments: Repayment[] = []
  subscriptions: Subscription[] = []
  tableInfo: TableInfo = {
    tableTitle: 'Devoluciones realizadas',
    searchField: '',
    enablePagination: true,
    enableSearch: false
  }

  tableColumns!: TableColumn[]

  constructor(
    protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router,
    private route: ActivatedRoute, private ref: ChangeDetectorRef) {
    super(comunicatorSvc, router)
  }
  ngOnInit() {
    this.setTitleAndIcon(3, "fas fa-people-carry fa-fw")
    this.initDates()
    this.setRepayments()
    this.initTable()

  }
  initDates() {
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
  initTable() {

    this.tableColumns = [
      { columnLabel: 'N° factura', definition: ['ticket'], columnType: '' },
      { columnLabel: 'Fecha', definition: ['date'], columnType: '', pipeType: 'date', options: 'dd/MM/yyyy' },
      { columnLabel: 'Hora', definition: ['time'], columnType: '', pipeType: 'date', options: 'HH:mm:ss aaaa' },
      { columnLabel: 'Tipo', definition: ['type'], columnType: '' },
      { columnLabel: 'Cantidad', definition: ['quantity'], columnType: "" },
      { columnLabel: 'Total', definition: ['total'], columnType: '', pipeType: 'currency', options: this.repayments },
      { columnLabel: 'Vendedor', definition: ['names_user', 'last_names_user'], columnType: '', },
      {
        columnLabel: '', definition: ['fas fa-cart-plus fa-fw update', "fas fa-shopping-bag fa-fw buy_detail"],
        columnType: 'repayment_detail', options: ['type', 'Devolución de venta']
      },
    ]
  }
  setRepayments() {
    const repayments = this.route.snapshot.data['repayments'];
    if (repayments) {
      this.repayments = repayments.map((repayment: any, i: number) => ({
        ...repayment, ticket: (repayment.id_buy) ? repayment.id_buy : repayment.id_sell
      }))
      console.log(repayments)
    }
  }

  processTableResponse(response: TableResponse) {
    if (response.value.type === 'Devolución de compra')
      this.redirectToDetallesCompra(response.value)
    else
      this.redirectToDetallesVenta(response.value)
  }

  redirectToDetallesVenta(repayment: Repayment) {
    this.router.navigate(['/administrador/ventas/detalles venta/' + repayment.id_sell])
  }
  redirectToDetallesCompra(repayment: Repayment) {
    this.router.navigate(['/administrador/compras/detalles compra/' + repayment.id_buy])
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
