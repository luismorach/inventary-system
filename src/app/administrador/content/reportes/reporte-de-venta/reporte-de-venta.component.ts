import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { VentasService } from '../../ventas/service/ventas.service';
import { Currency, Building, Register, report, Sell, User } from 'src/app/interfaces/interfaces';
import { CoinsService } from '../../configuraciones/service/coins.service';
import { EmpresaService } from '../../configuraciones/service/empresa.service';
import { Columns, ITable, Img, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { concat } from 'rxjs'
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';
var pdfFonts = require("pdfmake/build/vfs_fonts"); // fonts provided for pdfmake

// If any issue using previous fonts import. you can try this:
// import pdfFonts from "pdfmake/build/vfs_fonts";

// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);

@Component({
  selector: 'app-reporte-de-venta',
  templateUrl: './reporte-de-venta.component.html',
  styleUrls: ['./reporte-de-venta.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporteDeVentaComponent extends DinamicComponent {
  subscriptions: Subscription[] = []
  date = new Date()
  reportes: any[] = []
  reportesPagos: any[] = []
  reportesByDate: any[] = []
  reportesPagosByDate: any[] = []
  currencies: Currency[] = []
  mainCurrency!: Currency
  empresa!: Building
  formGenerateReport!: FormGroup;

  constructor(protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router,
    private ventasSvc: VentasService,
    private empresaSvc: EmpresaService,
    private fb: FormBuilder,
    private coinsSvc: CoinsService, private ref: ChangeDetectorRef) {
    super(comunicatorSvc, router);
  }
  ngOnInit() {
    this.setTitleAndIcon(3, "fas fa-hand-holding-usd fa-fw")
    this.getBuilding()
    this.getPays()
    this.getSells()
    this.getMainCurrency()
    this.initForm()
  }
  getBuilding() {
    this.subscriptions.push(this.empresaSvc.getBuildings().subscribe(res => this.empresa = res[0]))
  }
  getPays() {
    this.subscriptions.push(this.ventasSvc.getPaysByDate(this.date, this.date).subscribe(pagos => {
      let aux: any = pagos
      this.reportesPagos = pagos
      this.currencies = aux
      this.ref.detectChanges()
    }))
  }

  getSells() {
    this.subscriptions.push(this.ventasSvc.getSellBydate(this.date, this.date).subscribe(sell => {
      let aux: any = sell
      this.reportes = aux
      this.ref.detectChanges()
    }))
  }
  getMainCurrency() {
    this.subscriptions.push(this.coinsSvc.getMainCurrency()
      .subscribe(res => { this.mainCurrency = res[0]; this.ref.detectChanges() }))
  }
  initForm() {
    this.formGenerateReport = this.fb.group({
      initialDate: new FormControl('', [Validators.required,
      Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]),
      endDate: new FormControl('', [Validators.required,
      Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]),
    })
  }
  calculateTotals(reportes: any) {
    let values = { sells: 0, total_sell: 0, total_costos: 0, ganancias: 0, coin: '' }
    reportes.forEach((reporte: any) => {
      values.sells += Number(reporte.sells)
      values.total_sell += Number(Number(reporte.total_sell).toFixed(2))
      values.total_costos += Number(Number(reporte.costos).toFixed(2))
      values.ganancias += Number(Number(reporte.total_sell - reporte.costos).toFixed(2))
      values.coin = reporte.coin
    })
    return values
  }
  createPDF(tipo: string) {
    const pdf = new PdfMakeWrapper();
    pdf.info({
      title:'Reporte de venta',
      author:'Luis Mora',
      subject:'reporte',
    })
    this.createHeaderPDF(pdf)
    tipo === 'reporte de hoy' ? this.dataPdf(pdf) : this.dataPdfByDate(pdf)
    try {
      pdf.create().open()
    } catch (error: any) {
      throw new Error(error)
    }
  }
  createHeaderPDF(pdf: PdfMakeWrapper) {
    pdf.add(
      new Columns([
        new Txt(this.empresa.name).fontSize(12).lineHeight(1.4).end,
        ''
      ]).end)
    pdf.add(
      new Columns([
        new Txt(this.empresa.document_type + ' ' + this.empresa.document_number + '\n' +
          'Dirección: ' + this.empresa.address + '\n' + 'Télefono:' + this.empresa.phone_number + '\n' +
          'Email: ' + this.empresa.email).fontSize(8).end,
        ''
      ]).end)
  }
  dataPdf(pdf: PdfMakeWrapper) {
    pdf.add(new Txt('Reporte de venta (' +
      new Intl.DateTimeFormat('es-CL').format(this.date) + ')').alignment('center')
      .margin([0, 50, 0, 20]).fontSize(10).end)
    pdf.add(this.createTables(this.extractDataSell.bind(this, this.reportes)))
    pdf.add(new Txt('').margin([0, 50, 0, 0]).end)
    pdf.add(this.createTables(this.extractDataTotals.bind(this, this.reportes)))
    pdf.add(new Txt('').margin([0, 50, 0, 0]).end)
    pdf.add(this.createTables(this.extractDataCoin.bind(this, this.reportesPagos)))
  }

  dataPdfByDate(pdf: PdfMakeWrapper) {
    let initialDate = new Date(this.formGenerateReport.get('initialDate')?.value+'T00:00:00')
    let endDate = new Date(this.formGenerateReport.get('endDate')?.value+'T00:00:00')
    pdf.add(new Txt('Reporte de venta (' +
      new Intl.DateTimeFormat('es-CL').format(initialDate) +
      ' al ' + new Intl.DateTimeFormat('es-CL').format(endDate) + ')').alignment('center')
      .margin([0, 50, 0, 20]).fontSize(10).end)
    pdf.add(this.createTables(this.extractDataSell.bind(this, this.reportesByDate)))
    pdf.add(new Txt('').margin([0, 50, 0, 0]).end)
    pdf.add(this.createTables(this.extractDataTotals.bind(this, this.reportesByDate)))
    pdf.add(new Txt('').margin([0, 50, 0, 0]).end)
    pdf.add(this.createTables(this.extractDataCoin.bind(this, this.reportesPagosByDate)))
  }
  createTables(funcion: Function): ITable {
    return new Table([
      funcion(this.reportes, this.comunicatorSvc.currencyFormatter, this.calculateTotals).header,
      ...funcion(this.reportes, this.comunicatorSvc.currencyFormatter).body
    ]).alignment('center').fontSize(8).widths('*').heights(rowIndex => {
      return rowIndex === 0 ? 13 : 0
    }).layout({
      fillColor(rowIndex: number | undefined, node: any, columnIndex: number | undefined): string {
        return rowIndex === 0 ? '#cccccc' : ''
      },
    }).end
  }
  extractDataSell(reportes: any) {
    let aux = ['Caja', 'Vendedor', 'Ventas realizadas', 'Total en ventas', 'Costos de ventas', 'Ganancias'];
    let other = reportes.map((reporte: any) => [
      reporte.name_register, reporte.names_user + ' ' + reporte.last_names_user,
      reporte.sells,
      this.comunicatorSvc.currencyFormatter(reporte.total_sell, this.mainCurrency),
      this.comunicatorSvc.currencyFormatter(reporte.costos, this.mainCurrency),
      this.comunicatorSvc.currencyFormatter(reporte.total_sell - reporte.costos, this.mainCurrency)
    ])
    return { header: aux, body: other }
  }
  extractDataTotals(reportes: any) {
    let aux = ['Total ventas realizadas', 'Total en ventas', 'Total costos de ventas', 'Total ganancias'];
    let other = reportes.map((reporte: any) => [
      this.calculateTotals(reportes).sells,
      this.comunicatorSvc.currencyFormatter(this.calculateTotals(reportes).total_sell, this.mainCurrency),
      this.comunicatorSvc.currencyFormatter(this.calculateTotals(reportes).total_costos, this.mainCurrency),
      this.comunicatorSvc.currencyFormatter(this.calculateTotals(reportes).total_sell -
        this.calculateTotals(reportes).total_costos, this.mainCurrency)
    ])

    other = other.splice(0, 1)
    return { header: aux, body: other }
  }
  extractDataCoin(pays: any) {
    let aux = ['Moneda', 'Total en transacciones eléctronicas', 'Total en efectivo'];
    let other = pays.map((pay: any, index: number) => [
      pay.currency + ' ' + pay.currency_code,
      this.comunicatorSvc.currencyFormatter(pay.transaccion, this.currencies[index]),
      this.comunicatorSvc.currencyFormatter(pay.efectivo, this.currencies[index]),
    ])
    return { header: aux, body: other }
  }

  getReportsByDate() {
    this.reportesByDate = []
    let initialDate = new Date(this.formGenerateReport.get('initialDate')?.value+'T00:00:00')
    let endDate = new Date(this.formGenerateReport.get('endDate')?.value+'T00:00:00')
    const sell = this.ventasSvc.getSellBydate(initialDate, endDate)
    const pays = this.ventasSvc.getPaysByDate(initialDate, endDate)
    const concatenar = concat(sell, pays)

    this.subscriptions.push(concatenar.subscribe({
      next: res => {
        this.reportesByDate.push(res)
      },
      complete: () => {
        this.reportesPagosByDate = this.reportesByDate[1]
        this.reportesByDate = this.reportesByDate[0]
        console.log(this.reportesByDate)
        if (this.reportesByDate.length > 0)
          this.createPDF('reporte por fecha')
        else
          throw new Error('No existen ventas para el periodo específicado')
      }
    }))
  }

  checkDates() {
    let result = { isValid: false, msj: '' }
    if (this.formGenerateReport.get('initialDate')?.invalid) {
      result = { isValid: false, msj: 'La fecha inicial es invalida' }
    } else if (this.formGenerateReport.get('endDate')?.invalid) {
      result = { isValid: false, msj: 'La fecha final es invalida' }
    } else {
      result = { isValid: true, msj: '' }
    }
    return result
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
