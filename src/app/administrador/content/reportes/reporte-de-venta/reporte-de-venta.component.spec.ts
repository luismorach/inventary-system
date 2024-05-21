import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDeVentaComponent } from './reporte-de-venta.component';

describe('ReporteDeVentaComponent', () => {
  let component: ReporteDeVentaComponent;
  let fixture: ComponentFixture<ReporteDeVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteDeVentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDeVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
