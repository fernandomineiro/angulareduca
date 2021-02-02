// import { Curso } from 'src/app/trilha-conhecimento/sobre-trilha-conhecimento/sobre-trilha-conhecimento.model';
import { quizResultado } from './../../../quizResultado.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { trigger, state, style, transition, animate } from '@angular/animations'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'

import { CursosService } from '../../../curso/cursos.service'
import { AlunoService } from 'src/app/aluno/aluno.service';

import { Categoria } from '../../../categorias/categorias.model'
// import { Curso } from '../../../curso/curso.model'
import { CategoriasService } from '../../../categorias/categorias.service'

import { Observable, from } from 'rxjs'
import { switchMap, tap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators'
import { HeaderService } from 'src/app/header/header.service'
import { QuizService } from '../../../quiz.service';
import { QuizResultadoService } from 'src/app/quiz-resultado.service';

import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import PNotify from 'pnotify/dist/es/PNotify';
import * as _ from 'underscore';
import $ from 'jquery';

import { environment } from '../../../../environments/environment';


@Component({
  styles: [`
    #mobile_navbar { background-color: #DBDADA !important; }
  `],
  selector: 'mt-questionario',
  templateUrl: './questionario.component.html'
})

export class QuestionarioComponent implements OnInit {

  cursoId: number;
  quizId: number;
  quiz = []
  quizForm: FormGroup;
  situacao: any;
  respondido: boolean = false;
  quizInfo
  aprovado
  percentualAcertoAluno
  tentativas
  gabarito: boolean = false;
  enviarResponse
  desistiu
  isAbleToSubmit:boolean = false;
  IMG_URL = environment.img_url;
  progresso;
  curso;
  certificados;
  certificado;
  existeCertificado:boolean = false;

  PDF_URL = environment.img_url + '/files/certificado/emitidos/';

  constructor(private cursosService: CursosService,
    private categoriasService: CategoriasService,
    private quizService: QuizService,
    private quizResultadoService: QuizResultadoService,
    private alunoService: AlunoService,
    
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    PNotifyButtons; // Initiate the module. Important! 
  }

  ngOnInit() {
    this.quiz= [];
    this.cursoId = this.route.snapshot.root.firstChild.params["id"];
    this.quizId = this.route.snapshot.params["idQuiz"];
    this.isAbleToSubmit = false;
    this.quizService.getQuizSituacao(this.cursoId, this.quizId, localStorage.getItem('usuario_id')).subscribe(apiResponse => {
      this.situacao = apiResponse;
      this.tentativas = this.situacao[0].tentativas;
      console.log(this.situacao);

      if (this.situacao[0].situacao == 'aberto') {        
        this.quizService.getByIds(this.cursoId, this.quizId, localStorage.getItem('usuario_id')).subscribe(apiResponse2 => {
          this.quizInfo = apiResponse2;
          apiResponse2.questaos.forEach((value, i) => {
            value.selected = '';
            var found = _.where(apiResponse2.respostas, { fk_quiz_questao: value.id });
            if (found != undefined) {
              this.quiz.push({ questao: value, alternativas: found });
            }

          });
        });
      }
      else if (this.situacao[0].situacao == 'desistiu') {
        this.alunoService.getProgressoConclusao(Number(localStorage.getItem('usuario_id')),Number(this.cursoId)).subscribe((APIResponse)=>{
          this.progresso = APIResponse;
          console.log("progresso", APIResponse)
        });
        this.cursosService.cursoById(""+this.cursoId).subscribe( response => {
          this.curso = response.data;
          console.log(response.data);
        });
        this.alunoService
          .getCertificadosDisponiveis(Number(localStorage.getItem('usuario_id')))
          .subscribe((certificados) => {
              this.certificados = certificados.items;              
              this.certificados.forEach((value, i) => {                 
                if(value.fk_curso == this.cursoId) {
                  this.existeCertificado = true;
                  this.certificado = value;
                }
              });                          
        });
        this.desistiu = true;
        this.gabarito = true;
        this.respondido = true;
        this.situacao[0].quizQuestaos.forEach((value, i) => {
          value.selected = '';
          var found = _.where(this.situacao[0].quizRespostas, { fk_quiz_questao: value.id });
          console.log("found else", found);
          if (found != undefined) {
            found.forEach((value2, i2) => {
              if (_.findWhere(this.situacao[0].respostas_corretas, { questao_id: value2.fk_quiz_questao }).alternativa_id == value2.id)
                value2.correct = true;
              else
                value2.correct = false;
            });
            this.quiz.push({ questao: value, alternativas: found });
          }

        });
      }
      else {
        this.alunoService.getProgressoConclusao(Number(localStorage.getItem('usuario_id')),Number(this.cursoId)).subscribe((APIResponse)=>{
          this.progresso = APIResponse;
          console.log("progresso", APIResponse)
        });
        this.cursosService.cursoById(""+this.cursoId).subscribe( response => {
          this.curso = response.data;
          console.log(response.data);
        });
        this.alunoService
          .getCertificadosDisponiveis(Number(localStorage.getItem('usuario_id')))
          .subscribe((certificados) => {
              this.certificados = certificados.items;              
              this.certificados.forEach((value, i) => {                 
                if(value.fk_curso == this.cursoId) {
                  this.existeCertificado = true;
                  this.certificado = value;
                }
              });
        });
        this.aprovado = true;
        this.gabarito = true;
        this.quiz= [];
        this.situacao[0].quizQuestaos.forEach((value, i) => {
          var found = _.where(this.situacao[0].quizRespostas, { fk_quiz_questao: value.id });
          console.log("found else", found);
          if (found != undefined) {
            found.forEach((value2, i2) => {
              if (_.findWhere(this.situacao[0].respostas_corretas, { questao_id: value2.fk_quiz_questao }).alternativa_id == value2.id)
                value2.correct = true;
              else
                value2.correct = false;

              console.log("sadsad",this.situacao[0].acertos,this.situacao[0].erros, value2);
              if ((_.findWhere(this.situacao[0].acertos, { questaoId: value2.fk_quiz_questao }) != undefined && _.findWhere(this.situacao[0].acertos, { questaoId: value2.fk_quiz_questao }).alternativaId == value2.id) ||
                (_.findWhere(this.situacao[0].erros, { questaoId: value2.fk_quiz_questao }) != undefined && _.findWhere(this.situacao[0].erros, { questaoId: value2.fk_quiz_questao }).alternativaId == value2.id))
                value2.selected = true;
              else
                value2.selected = false;
            });
            this.quiz.push({ questao: value, alternativas: found });
          }

        });
      }



      console.log("questões", this.quiz);

    });

  }

  checkIfAbbleToSubmit(){
    this.quiz.every((value, i) => { 
      if(value.questao.selected == null || value.questao.selected == ''){
        this.isAbleToSubmit = false;
        return false;        
      }
      this.isAbleToSubmit = true;
      return true;   
    });
  }

  onSubmit() {
    console.log("respondido", this.quiz);
    var dataToSend = {
      id: this.cursoId,
      fk_usuario: localStorage.getItem('usuario_id'),
      fk_quiz: this.quizId,
      respostas: []
    }
    this.quiz.forEach((value, i) => {
      dataToSend.respostas.push({
        questaoId: Number(value.questao.id),
        alternativaId: Number(value.questao.selected)
      }) 
    });

    console.log("dataToSend", dataToSend);
    this.quizService.enviar(dataToSend).subscribe(response => {
      console.log(response);
      if (response.success) {
        this.enviarResponse = response;
        this.tentativas++;
        this.checkIfApproved(response);
      }
    });

  }

  checkIfApproved(response) {
    this.percentualAcertoAluno = (response.data.qtd_acertos * 100) / this.quizInfo.questaos.length;
    console.log("percent Aluno", this.percentualAcertoAluno, response.data.qtd_acertos, this.quizInfo.questaos.length, this.quizInfo.percentualAcerto[0].percentual_acerto);
    if (this.quizInfo.percentualAcerto[0].percentual_acerto > this.percentualAcertoAluno) {
      this.aprovado = false;
      this.respondido = true;
    }
    else {
      this.aprovado = true;
      this.gabarito = true;    
      window.location.reload();
     
    }
    console.log("checkApproval", this.quiz)

  }

  tentarNovamente() {
    this.respondido = false;
    this.aprovado = undefined;
    this.enviarResponse = undefined;
    this.isAbleToSubmit = false;
    this.quiz.forEach((value, i) => {
      value.questao.selected = null;
    });
  }

  verGabarito() {
    var dataToSend = {
      fk_quiz: this.quizId,
      fk_usuario: localStorage.getItem('usuario_id'),
      id: this.cursoId
    }
    this.quizService.verGabarito(dataToSend).subscribe(response => {
      console.log(response);
      if (response.retorno == 'sucesso') {
        this.respondido = false;
        this.aprovado = undefined;
        this.enviarResponse = undefined;
        this.percentualAcertoAluno = undefined;
        this.situacao = undefined;
        window.location.reload();
      }
    });
  }







}