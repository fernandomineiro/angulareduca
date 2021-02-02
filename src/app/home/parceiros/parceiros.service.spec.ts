import { TestBed } from '@angular/core/testing';

import { ParceirosService } from './parceiros.service';

describe('ParceirosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParceirosService = TestBed.get(ParceirosService);
    expect(service).toBeTruthy();
  });
});
