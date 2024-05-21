import { TestBed } from '@angular/core/testing';

import { KardexService } from './kardex.service';

describe('KardexService', () => {
  let service: KardexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KardexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
