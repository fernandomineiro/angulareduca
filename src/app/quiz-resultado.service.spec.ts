import { TestBed } from '@angular/core/testing';

import { QuizResultadoService } from './quiz-resultado.service';

describe('QuizResultadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuizResultadoService = TestBed.get(QuizResultadoService);
    expect(service).toBeTruthy();
  });
});
