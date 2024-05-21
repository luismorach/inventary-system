import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosEnAlmacenComponent } from './productos-en-almacen.component';

describe('ProductosEnAlmacenComponent', () => {
  let component: ProductosEnAlmacenComponent;
  let fixture: ComponentFixture<ProductosEnAlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductosEnAlmacenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosEnAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
