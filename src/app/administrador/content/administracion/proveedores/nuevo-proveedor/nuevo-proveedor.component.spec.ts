import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoProveedorComponent } from './nuevo-proveedor.component';

describe('NuevoProveedorComponent', () => {
  let component: NuevoProveedorComponent;
  let fixture: ComponentFixture<NuevoProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoProveedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
