import { TestBed } from '@angular/core/testing';

import { PermissoesService } from './permissoes.service';

describe('PermissoesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PermissoesService = TestBed.get(PermissoesService);
    expect(service).toBeTruthy();
  });
});
