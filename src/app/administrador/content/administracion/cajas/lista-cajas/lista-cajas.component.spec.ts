import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCajasComponent } from './lista-cajas.component';

describe('ListaCajasComponent', () => {
  let component: ListaCajasComponent;
  let fixture: ComponentFixture<ListaCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaCajasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
