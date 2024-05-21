import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesKardexComponent } from './detalles-kardex.component';

describe('DetallesKardexComponent', () => {
  let component: DetallesKardexComponent;
  let fixture: ComponentFixture<DetallesKardexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesKardexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesKardexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
