import { TestBed, async, inject } from '@angular/core/testing';

import { PermissoesGuard } from './permissoes.guard';

describe('PermissoesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissoesGuard]
    });
  });

  it('should ...', inject([PermissoesGuard], (guard: PermissoesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
