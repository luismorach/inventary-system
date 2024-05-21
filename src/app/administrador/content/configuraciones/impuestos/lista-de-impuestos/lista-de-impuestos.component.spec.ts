import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDeImpuestosComponent } from './lista-de-impuestos.component';

describe('ListaDeImpuestosComponent', () => {
  let component: ListaDeImpuestosComponent;
  let fixture: ComponentFixture<ListaDeImpuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaDeImpuestosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaDeImpuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
