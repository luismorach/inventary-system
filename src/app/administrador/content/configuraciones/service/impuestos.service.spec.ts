import { TestBed } from '@angular/core/testing';

import { ImpuestosService } from './impuestos.service';

describe('ImpuestosService', () => {
  let service: ImpuestosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpuestosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
