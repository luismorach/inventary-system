import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoClienteComponent } from './nuevo-cliente.component';

describe('NuevoClienteComponent', () => {
  let component: NuevoClienteComponent;
  let fixture: ComponentFixture<NuevoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
