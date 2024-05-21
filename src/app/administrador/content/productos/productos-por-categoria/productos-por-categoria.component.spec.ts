import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosPorCategoriaComponent } from './productos-por-categoria.component';

describe('ProductosPorCategoriaComponent', () => {
  let component: ProductosPorCategoriaComponent;
  let fixture: ComponentFixture<ProductosPorCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductosPorCategoriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosPorCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
