import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { ProductosService } from '../../productos/service/productos.service';
import { Currency, Building, Product, SelectInfo } from 'src/app/interfaces/interfaces';
import { Columns, ITable, Img, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper'
import { EmpresaService } from '../../configuraciones/service/empresa.service';
import { CoinsService } from '../../configuraciones/service/coins.service';
import { Subscription } from 'rxjs';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';
var pdfFonts = require("pdfmake/build/vfs_fonts"); // fonts provided for pdfmake

// If any issue using previous fonts import. you can try this:
// import pdfFonts from "pdfmake/build/vfs_fonts";

// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);
@Component({
  selector: 'app-reporte-de-inventario',
  templateUrl: './reporte-de-inventario.component.html',
  styleUrls: ['./reporte-de-inventario.component.css']
})
export class ReporteDeInventarioComponent extends DinamicComponent {
  formGenerateReport!: FormGroup;
  products: Product[] = []
  empresa!: Building
  mainCurrency!: Currency
  subscriptions: Subscription[] = []
  selectInfo: SelectInfo = {
    label: 'Ordenar por',
    optionName:['option'],
    definitionOption: 'value',
    required: true
  }
  
  selectOptions = [
    { option: 'Seleccione la forma de ordenamiento', value: '' },
    { option: 'Nombre (ascendente)', value:'Nombre (ascendente)' },
    { option: 'Nombre (descendente)', value:'Nombre (descendente)' },
    { option: 'Stock (ascendente)', value: 'Deshabilitada' },
    { option: 'Stock (descendente)', value: 'Deshabilitada' }
  ]
  constructor(private fb: FormBuilder,
    protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router,
    private productsSvc: ProductosService,
    private empresaSvc: EmpresaService,
    private coinsSvc: CoinsService) {
    super(comunicatorSvc,router);
  }
  ngOnInit() {
    this.setTitleAndIcon(3,"fas fa-box-open fa-fw")
    this.getMainCurrency()
    this.getProoducts()
    this.getBuilding()
    this.initForm()
  }
getMainCurrency(){
  this.subscriptions.push(this.coinsSvc.getMainCurrency().subscribe(res => this.mainCurrency = res[0]))
}
getProoducts(){
  this.subscriptions.push(this.productsSvc.getProductos().subscribe(res => this.products = res))
}
getBuilding(){
  this.subscriptions.push(this.empresaSvc.getBuildings()
  .subscribe(res => this.empresa = res[0]))
}
initForm(){
  this.formGenerateReport = this.fb.group({
    campSearch: new FormControl('')
  })
}
  createPDF() {
      const pdf = new PdfMakeWrapper();
      pdf.info({
        title:'Reporte de inventario',
        author:'Luis Mora',
        subject:'reporte',
      })
      this.createHeaderPDF(pdf)
      pdf.add(this.createTables())
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
    pdf.add(new Txt('Reporte de inventario general').alignment('center')
      .margin([0, 50, 0, 20]).fontSize(10).end)
  }
  createTables(): ITable {
    return new Table([
      this.extractData().header,
      ...this.extractData().body
    ]).alignment('center').fontSize(8).widths([20, 80, 250, 80, 40]).heights(rowIndex => {
      return rowIndex === 0 ? 13 : 0
    }).layout({
      fillColor(rowIndex: number | undefined, node: any, columnIndex: number | undefined): string {
        return rowIndex === 0 ? '#cccccc' : ''
      },
    }).end
  }
  extractData() {
    this.ordenar()
    let aux = ['N°', 'código', 'Nombre', 'Precio', 'Stock'];
    let other = this.products.map((product: Product, index: number) => [
      index + 1, product.barcode, product.name + ' ' + product.mark + ' ' + product.model,
      this.comunicatorSvc.currencyFormatter(product.price, this.mainCurrency),
      product.exist_quantity
    ])
    return { header: aux, body: other }
  }

  ordenar_ascendente(a: string | number, b: string | number) {
    // A va primero que B
    if (a < b)
      return -1;
    // B va primero que A
    else if (a > b)
      return 1;
    // A y B son iguales
    else
      return 0;
  }
  ordenar_descendente(a: string | number, b: string | number) {
    // A va primero que B
    if (a < b)
      return 1;
    // B va primero que A
    else if (a > b)
      return -1;
    // A y B son iguales
    else
      return 0;
  }
  ordenar() {
    let ordenar = this.formGenerateReport.get('campSearch')?.value
    this.products.sort((a: Product, b: Product) => {
      if (ordenar === 'Nombre (descendente)') {
        return this.ordenar_descendente(a.name, b.name)
      } else if (ordenar === 'Nombre (ascendente)') {
        return this.ordenar_ascendente(a.name, b.name)
      } else if (ordenar === 'Stock (ascendente)') {
        return this.ordenar_ascendente(a.exist_quantity, b.exist_quantity)
      } else {
        return this.ordenar_descendente(a.exist_quantity, b.exist_quantity)
      }
    });

  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }

}
