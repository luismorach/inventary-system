import { TestBed } from '@angular/core/testing';

import { DevolucionesServiceService } from './devoluciones.service';

describe('DevolucionesServiceService', () => {
  let service: DevolucionesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevolucionesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
