import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesVentaComponent } from './detalles-venta.component';

describe('DetallesVentaComponent', () => {
  let component: DetallesVentaComponent;
  let fixture: ComponentFixture<DetallesVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesVentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
