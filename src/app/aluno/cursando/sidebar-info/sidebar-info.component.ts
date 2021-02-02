import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { SidebarInfo } from './sidebar-info.model';
import { AlunoService } from '../../aluno.service';
import { ActivatedRoute } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { CursosService } from 'src/app/curso/cursos.service';

@Component({
  selector: 'app-sidebar-info',
  templateUrl: './sidebar-info.component.html',
  styleUrls: ['./sidebar-info.component.css']
})
export class SidebarInfoComponent implements OnInit {

  constructor(
      private alunoService: AlunoService,
      private route: ActivatedRoute,
      private cursoService: CursosService
  ) { }

  sidebarInfo: any;
  curso;

  ngOnInit() {    
    this.route.paramMap.subscribe(params => {
      // parameter should be the id course
      this.alunoService.getSidebarInfo(
          Number(params.get('id')),
          Number(localStorage.getItem('usuario_id'))
      ).subscribe((sidebarInfo) => {
        this.sidebarInfo = sidebarInfo.data;
        console.log($(".certificado-info").text());
        var text = $(".certificado-info").text().slice(0,-1);
        $(".certificado-info").text(text);

        this.alunoService.tempo_finalizar.next(this.sidebarInfo.tempo_finalizar);
        this.alunoService.getProgressoConclusao(Number(localStorage.getItem('usuario_id')), Number(params.get('id')))
          .subscribe((ApiResponse) => {
            this.sidebarInfo.percent = ApiResponse.percentual_conclusao*100;
            console.log("sidebar percent", this.sidebarInfo.percent);  
          });          
      });
      this.cursoService.cursoById(params.get('id')).subscribe( response => {
        this.curso = response.data;
        console.log(response.data);
      });

    });

    try {
    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }

  conclusaoInfo(tipoCurso): string {
    var text = ''
    if(tipoCurso == 1){
      text += ' 100% das aulas;';
    }
    if(tipoCurso == 2){
      var textFrequencia = this.sidebarInfo.criterios.frequencia_minima? " "+this.sidebarInfo.criterios.frequencia_minima+'% das aulas presenciais;' : '';
      text += textFrequencia;
    }
    if(tipoCurso == 4){
      text += ' 100% das aulas;';
      var textFrequencia = this.sidebarInfo.criterios.frequencia_minima? " "+this.sidebarInfo.criterios.frequencia_minima+'% das aulas presenciais;' : '';
      text += textFrequencia;
    }

    var textTrabalho = this.curso.trabalho? ' entrega do TCC;' : '';
    text += textTrabalho;
    var textQuestionario = this.curso.quiz_id != null ? ' conclusão do questionário;' : '';
    text += textQuestionario;
    
    text = text.slice(0, -1) + '.';

    return text;
  }

}
