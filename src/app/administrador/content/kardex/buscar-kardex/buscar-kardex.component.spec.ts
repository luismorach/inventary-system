import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarKardexComponent } from './buscar-kardex.component';

describe('BuscarKardexComponent', () => {
  let component: BuscarKardexComponent;
  let fixture: ComponentFixture<BuscarKardexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarKardexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarKardexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
