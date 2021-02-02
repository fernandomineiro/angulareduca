import { quizResultado } from './../quizResultado.model';
import { Component, OnInit } from '@angular/core';
import { QuizResultadoService } from '../quiz-resultado.service';

@Component({
  selector: 'app-quiz-nao-aprovado',
  templateUrl: './quiz-nao-aprovado.component.html',
  styleUrls: ['./quiz-nao-aprovado.component.css']
})
export class QuizNaoAprovadoComponent implements OnInit {

  resultado= new quizResultado();
  respostas_corretas: number;
  respostas_erradas: number;
  alunoName: string;


  constructor(
    private quizResultadoService: QuizResultadoService
  ) {}

  ngOnInit() {
    this.alunoName= localStorage.nome;
    this.resultado= this.quizResultadoService.quizResultado;

    // this.result.curso= this.resultado.curso;
    this.respostas_corretas= this.resultado.qtd_acertos/(this.resultado.qtd_acertos+ this.resultado.qtd_erros)*100;
    this.respostas_erradas= this.resultado.qtd_erros/(this.resultado.qtd_acertos+ this.resultado.qtd_erros)*100;
  }

}
