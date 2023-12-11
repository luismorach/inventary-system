import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { coin, product } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicTable } from 'src/app/utils/DinamicTable';
import { ProductosService } from './service/productos.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CoinsService } from '../../configuraciones/service/coins.service';
import { Alert } from 'src/app/utils/Alert';

@Component({
  selector: 'app-productos-en-almacen',
  templateUrl: './productos-en-almacen.component.html',
  styleUrls: ['./productos-en-almacen.component.css']
})
export class ProductosEnAlmacenComponent extends DinamicTable {
  tableSearch!: FormGroup;
  data$!: Subscription;
  products: product[] = [];
  title: string[] = [];
  currentData: product[] = [];
  productToDelete!: product;
  coin!: coin

  //Elemento donde se insertaran los numeros 
  //de paginas para la paginacion
  @ViewChild('pagination', { static: false }) override pagination?: ElementRef;
  //Elemento antes del cual se comenzaran a insertar las paginas
  @ViewChild('next', { static: false }) override next?: ElementRef;
  //Elemento que muestra la informacion acerca de la cantidad de paginas mostradas, y filtradas
  @ViewChild('dataTables_info', { static: false }) override info?: ElementRef;
  //Elemento que tiene todas las filas de la tabla de la vista
  @ViewChild('rows', { static: false }) row?: ElementRef;
  //Elemento modal para mostrar alertas
  @ViewChild('popup', { static: true }) override popUp?: ElementRef;

  constructor(private fb: FormBuilder,
    public override renderer: Renderer2,
    private comunicatorSvc: ComunicatorComponetsService, private routes: Router,
    private productosSvc: ProductosService, private coinsSvc: CoinsService) {
    super(renderer)
  }
  ngOnInit() {
    let title: string[] = [];
    let ruta;
    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2);
      title.push("fa fa-boxes fa-fw");//aañado el icono del titulo al array
      title.push(decodeURI(ruta).toUpperCase());//añado el titulo al array
      this.comunicatorSvc.setTitleComponent(title);
    });
/* 
     this.coinsSvc.getAllCoins().subscribe({
      next: res => {
        res.forEach((data: any,index:number) => {
          const formatter = new Intl.NumberFormat(data.language_code+'-'+data.country_code, {
            style: 'currency',
            minimumFractionDigits: 2,
            currency: data.currency_code,
          })
          console.log(index+' '+formatter.format(1)+' '+data.country)
        })

      }
    })  */
     const formatter = new Intl.NumberFormat('en-ZW', {
      style: 'currency',
      minimumFractionDigits: 2,
      currency: 'ZWD'
    })
    console.log(formatter.format(1)) 
    this.coinsSvc.getMainCoin().subscribe({
      next: res => {
        if (res instanceof Array) {
          this.coin = res[0]
        }
      }
    })
    this.data$ = this.productosSvc.getProductos().subscribe({
      next: res => { this.currentData = res; this.products = res },
      error: (error: HttpErrorResponse) => {
        this.error(error)
      },
      complete: () => {
        //inserto la cantidad de paginas al DOM segun la cantidad de datos que tengo
        this.createPages(this.tableSearch, this.currentData, this.products)
        //Me suscribo al observer para obtener la lista de usuarios actuales
        //Si se filtran los datos, me devolvera lao usuarios filtradas
        //si no, me devolvera todas los usuarios
        this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
      }
    });

    this.tableSearch = new FormGroup({
      search: new FormControl(),
      numberRows: new FormControl('10')
    });
  }

  public error(error: HttpErrorResponse) {
    this.changeModal(this.comunicatorSvc.errorServer(error))
    this.popUp?.nativeElement.showModal()
  }
  redirectToUpdate(data: product) {
    this.routes.navigate(['/productos/actualizar producto/' + data.id_product])
  }
  delete(data: product) {
    this.popUp?.nativeElement.close()
    if (this.popUp?.nativeElement.children[1].textContent === '¿Estás seguro?') {

      //elimino la caja de mi base de datos
      this.productosSvc.deleteProducto(data.id_product).subscribe({
        next: res => {
          this.changeModal(res);
          this.popUp?.nativeElement.showModal();
        },
        error: (error: HttpErrorResponse) => {
          this.changeModal(this.comunicatorSvc.errorServer(error))
          this.popUp?.nativeElement.showModal()
        },
        complete: () => {
          //Obtengo el indice del elemento que voy a eliminar
          let index = this.products.indexOf(data)
          //elimino el elemento de mi lista de productos totales
          this.products.splice(index, 1)
          //elimino el elemento de mi lista de productos actuales
          index = this.currentData.indexOf(data)
          this.currentData.splice(index, 1)
          //elimino la fila de mi tabla en la vista
          let values = this.getValuesToPipe(this.tableSearch)
          let rowToDelete = index - (values.numberRows * values.indexCurrentPage)
          this.renderer.removeChild(this.row?.nativeElement, this.row?.nativeElement.children[rowToDelete])
          //renderizo la paginacion una vez mas, para que se actualice
          this.createPages(this.tableSearch, this.currentData, this.products)
        }
      })

    }
  }
  ngOnDestroy() {
    this.data$.unsubscribe();
  }

}
