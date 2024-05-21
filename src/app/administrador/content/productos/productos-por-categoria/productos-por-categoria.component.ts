import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Product, ProductByCategory } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-productos-por-categoria',
  templateUrl: './productos-por-categoria.component.html',
  styleUrls: ['./productos-por-categoria.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductosPorCategoriaComponent extends DinamicComponent {
  categories: Category[] = [];
  currentCategory!: Category
  productByCategory: ProductByCategory[] = []
  currentProducts!: Product[]
  selected: boolean = false
  constructor(protected override router: Router,
    protected override comunicatorSvc: ComunicatorComponetsService,
    private route: ActivatedRoute) {
    super(comunicatorSvc, router)
  }

  ngOnInit() {
    this.setTitleAndIcon(3, "fas fa-box fa-fw")
    this.setCategories()
    this.setSelectedCategory()
  }

  setCategories() {
    this.productByCategory = this.route.snapshot.data['categories'] || [];
  }
  setSelectedCategory() {
    if (this.route.snapshot.data['category']) {
      const categoryData = this.route.snapshot.data['category'];
      if (categoryData && categoryData.length > 0) {
        this.selectedCategory(categoryData[0]);
      }
    }
  }
    selectedCategory(category: Category) {
      this.selected = true;
      const foundProductByCategory = this.productByCategory.find((res) => res.category.id_category === category.id_category);
      this.currentProducts = (foundProductByCategory) ? foundProductByCategory.products : [];
      this.currentCategory = category;
    }

    ngOnDestroy() {
    }
  }
