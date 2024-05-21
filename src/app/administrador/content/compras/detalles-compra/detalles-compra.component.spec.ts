import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesCompraComponent } from './detalles-compra.component';

describe('DetallesCompraComponent', () => {
  let component: DetallesCompraComponent;
  let fixture: ComponentFixture<DetallesCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesCompraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
