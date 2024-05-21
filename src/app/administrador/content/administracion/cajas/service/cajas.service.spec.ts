import { TestBed } from '@angular/core/testing';

import { CajasService } from './cajas.service';

describe('CajasService', () => {
  let service: CajasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CajasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
