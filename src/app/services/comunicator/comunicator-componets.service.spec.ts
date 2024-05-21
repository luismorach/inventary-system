import { TestBed } from '@angular/core/testing';

import { ComunicatorComponetsService } from './comunicator-componets.service';

describe('ComunicatorComponetsService', () => {
  let service: ComunicatorComponetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComunicatorComponetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
