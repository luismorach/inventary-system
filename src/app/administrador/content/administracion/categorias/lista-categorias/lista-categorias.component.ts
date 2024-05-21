import { ChangeDetectionStrategy,Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category, ResponseAlert, TableColumn, TableInfo, TableResponse } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { CategoriasService } from '../service/categorias.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-lista-categorias',
  templateUrl: './lista-categorias.component.html',
  styleUrls: ['./lista-categorias.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaCategoriasComponent extends DinamicComponent {
  categories: Category[] = [];
  categoryToDelete!: Category;
  subscriptions: Subscription[] = []
  tableInfo: TableInfo = {
    tableTitle: 'Categorías Registradas',
    searchField: 'name',
    enablePagination: true,
    enableSearch:true
  }
  tableColumns: TableColumn[] = [
    { columnLabel: 'Nombre de la categoria', definition: ['name'],columnType:'' },
    { columnLabel: 'Pasillo o ubicación', definition: ['ubication'],columnType:'' },
    { columnLabel: '', definition: ['fa fa-arrows-rotate update'],columnType:'update' },
    { columnLabel: '', definition: ['fa fa-trash-can delete'],columnType:'delete' },
    { columnLabel: '', definition: ['fab fa-shopify fa-fw style-blue'],columnType:'products' },
  ]


  constructor(protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router, private route: ActivatedRoute,
    private categoriasSvc: CategoriasService) {
    super(comunicatorSvc, router)
  }
  ngOnInit() {
    this.setTitleAndIcon(4,"fas fa-clipboard-list fa-fw")
    this.setCategories()
    this.subscribeToAlertResponse()
  }

  setCategories(): void {
    const data = this.route.snapshot.data;
    if (data['categories']) {
      this.categories = data['categories'];
    }
  }
  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }

  redirectToUpdate(data: Category) {
    this.router.navigate(['/administrador/administracion/categorías/actualizar categoría/' + data.id_category])
  }
  redirectToProductsByCategory(data: Category) {
    this.router.navigate(['/administrador/productos/productos por categoría/' + data.id_category])
  }
  handleAlertResponse(alert: ResponseAlert) {
    if (alert.type === 'Warning' && alert.response) {
      this.deleteCategory(this.categoryToDelete);
    }
  }

  deleteCategory(category: Category) {
    this.categoriasSvc.deleteCategory(category.id_category).subscribe({
      next: res => {
        this.msj = res
        this.showModal('Success');
      }
    })
  }

  processTableResponse(response: TableResponse) {
    switch (response.responseType) {
      case 'update':
        this.redirectToUpdate(response.value)
        break
      case 'delete':
        this.categoryToDelete = response.value
        this.showModalWarning('La categoría sera eliminada del sistema y al hacerlo se eliminarán '+
        'todos los productos asociados a la misma ¿desea continuar?')
        break
      case 'products':
        this.redirectToProductsByCategory(response.value)
        break
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
