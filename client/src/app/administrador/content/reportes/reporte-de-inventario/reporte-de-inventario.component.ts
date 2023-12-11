import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { ProductosService } from '../../productos/productos-en-almacen/service/productos.service';
import { all_coins, building, product } from 'src/app/interfaces/interfaces';
import { Columns, ITable, Img, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper'
import { EmpresaService } from '../../configuraciones/service/empresa.service';
import { CoinsService } from '../../configuraciones/service/coins.service';
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
export class ReporteDeInventarioComponent extends DinamicInput {
  formGenerateReport!: FormGroup;
  products: product[] = []
  empresa!: building
  coins:all_coins[]=[]
  constructor(private fb: FormBuilder,
    private comunicatorSvc: ComunicatorComponetsService,
    private routes: Router,
    private productsSvc: ProductosService,
    private empresaSvc: EmpresaService,
    private coinsSvc:CoinsService) {
    super();
  }
  ngOnInit() {

    let title: string[] = [];
    let ruta;
    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2);
      title.push(decodeURI(ruta).toUpperCase());//añado el titulo al array
      title.push("fas fa-box-open fa-fw");//aañado el icono del titulo al array
      this.comunicatorSvc.setTitleComponent(title);
    })
    this.coinsSvc.getAllCoins().subscribe(res=>{
      if (res instanceof Array)
        this.coins = res
    })
    this.productsSvc.getProductos().subscribe(res => {
      if (res instanceof Array)
        this.products = res
    })
    this.formGenerateReport = this.fb.group({
      campSearch: new FormControl('')
    })
    this.empresaSvc.getBuildings().subscribe(res => {
      if (res instanceof Array) {
        this.empresa = res[0]
      }
    })
  }

  createPDF() {
    const pdf = new PdfMakeWrapper();
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
    //pdf.add(this.createTables())
    pdf.add(this.createProv())
    pdf.create().open()
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
    let other = this.products.map((product: product, index: number) => [
      index + 1, product.barcode, product.name + ' ' + product.mark + ' ' + product.model,
      this.comunicatorSvc.currencyFormatter(product.sell_price),
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
    this.products.sort((a: product, b: product) => {
      if (ordenar === 'Nombre (descendente)') {
        return this.ordenar_descendente(a.name,b.name)
      } else if (ordenar === 'Nombre (ascendente)') {
        return this.ordenar_ascendente(a.name, b.name)
      } else if (ordenar === 'Stock (ascendente)') {
        return this.ordenar_ascendente(a.exist_quantity, b.exist_quantity)
      } else {
        return this.ordenar_descendente(a.exist_quantity, b.exist_quantity)
      }
    });

  }
  ngOnDestroy(){
    this.createPDF()
  }
  createProv(): ITable {
    return new Table([
      this.prov().header,
      ...this.prov().body
    ]).alignment('center').fontSize(8).widths([15,100,30,80,30,80,30,80]).heights(rowIndex => {
      return rowIndex === 0 ? 13 : 0
    }).layout({
      fillColor(rowIndex: number | undefined, node: any, columnIndex: number | undefined): string {
        return rowIndex === 0 ? '#cccccc' : ''
      },
    }).end
    
  }
  prov() {
    let aux = ['N°', 'pais', 'codigo del pais', 'idioma','codigo del idioma', 'moneda',
    'codigo de moneda','example'];
    let other = this.coins.map((coin: all_coins, index: number) => [
      index + 1,coin.country,coin.country_code,coin.language,coin.language_code,coin.currency,
      coin.currency_code,this.currencyFormatter(coin.language_code,coin.country_code,coin.currency_code,1)
    ])
    return { header: aux, body: other }
  }
  currencyFormatter(languague_code:string,country_code:string,currency_code:string,value: number) {
    const formatter = new Intl.NumberFormat(languague_code+'-'+country_code, {
      style: 'currency',
      minimumFractionDigits: 2,
      currency: currency_code,
    })
    return formatter.format(value)
  }
}
