import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoImpuestoComponent } from './nuevo-impuesto.component';

describe('NuevoImpuestoComponent', () => {
  let component: NuevoImpuestoComponent;
  let fixture: ComponentFixture<NuevoImpuestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoImpuestoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoImpuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
