import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaCajaComponent } from './nueva-caja.component';

describe('NuevaCajaComponent', () => {
  let component: NuevaCajaComponent;
  let fixture: ComponentFixture<NuevaCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevaCajaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
