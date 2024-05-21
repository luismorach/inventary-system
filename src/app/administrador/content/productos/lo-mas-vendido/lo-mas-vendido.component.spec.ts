import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoMasVendidoComponent } from './lo-mas-vendido.component';

describe('LoMasVendidoComponent', () => {
  let component: LoMasVendidoComponent;
  let fixture: ComponentFixture<LoMasVendidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoMasVendidoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoMasVendidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
