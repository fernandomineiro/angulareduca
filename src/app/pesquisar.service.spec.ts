import { TestBed } from '@angular/core/testing';

import { PesquisarService } from './pesquisar.service';

describe('PesquisarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PesquisarService = TestBed.get(PesquisarService);
    expect(service).toBeTruthy();
  });
});
