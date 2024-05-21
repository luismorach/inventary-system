import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosDeLaEmpresaComponent } from './datos-de-la-empresa.component';

describe('DatosDeLaEmpresaComponent', () => {
  let component: DatosDeLaEmpresaComponent;
  let fixture: ComponentFixture<DatosDeLaEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosDeLaEmpresaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosDeLaEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
