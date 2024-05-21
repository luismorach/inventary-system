import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosPorVencimientoComponent } from './productos-por-vencimiento.component';

describe('ProductosPorVencimientoComponent', () => {
  let component: ProductosPorVencimientoComponent;
  let fixture: ComponentFixture<ProductosPorVencimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductosPorVencimientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosPorVencimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
