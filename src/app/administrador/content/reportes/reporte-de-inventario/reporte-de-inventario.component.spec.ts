import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDeInventarioComponent } from './reporte-de-inventario.component';

describe('ReporteDeInventarioComponent', () => {
  let component: ReporteDeInventarioComponent;
  let fixture: ComponentFixture<ReporteDeInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteDeInventarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDeInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
