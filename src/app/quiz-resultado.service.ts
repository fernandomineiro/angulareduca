import { Injectable } from '@angular/core';
import { quizResultado } from './quizResultado.model';

@Injectable({
  providedIn: 'root'
})
export class QuizResultadoService {
  quizResultado: quizResultado;

  constructor() { }
}
