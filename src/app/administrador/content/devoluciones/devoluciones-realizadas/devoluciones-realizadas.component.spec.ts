import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionesRealizadasComponent } from './devoluciones-realizadas.component';

describe('DevolucionesRealizadasComponent', () => {
  let component: DevolucionesRealizadasComponent;
  let fixture: ComponentFixture<DevolucionesRealizadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevolucionesRealizadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevolucionesRealizadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
