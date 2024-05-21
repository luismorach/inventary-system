import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexGeneralComponent } from './kardex-general.component';

describe('KardexGeneralComponent', () => {
  let component: KardexGeneralComponent;
  let fixture: ComponentFixture<KardexGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KardexGeneralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
