import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarDevolucionesComponent } from './buscar-devoluciones.component';

describe('BuscarDevolucionesComponent', () => {
  let component: BuscarDevolucionesComponent;
  let fixture: ComponentFixture<BuscarDevolucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarDevolucionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarDevolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
