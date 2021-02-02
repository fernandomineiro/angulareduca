import { Component, OnInit } from '@angular/core';
import { ProfessorService } from 'src/app/professor/professor.service';
import { Professor } from 'src/app/professor/professor.model';

import { Curso } from 'src/app/curso/curso.model';

import { ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import { CursosService } from 'src/app/curso/cursos.service';

import * as _ from 'underscore';
import { ConfiguracoesStore } from '../stores/configuracoes.store';


@Component({
  selector: 'app-professor',
  templateUrl: '../professor/professor-sobre.component.html',
  styleUrls: ['../professor/professor-sobre.component.css']
})
export class ProfessorSobreComponent implements OnInit {

  constructor(
      private professorService: ProfessorService,
      private route: ActivatedRoute,
      private headerService: HeaderService,
      private cursosService: CursosService,
      private configuracoesStore: ConfiguracoesStore,
  ) { }
  
  professor: Professor;
  cursos: Curso[];
  IMG_URL = environment.s3_url;
  favorites: any;
  cursosAluno: any;
  cursosAlunoPresencial: any;
  cursosAlunoRemoto: any;
  configuracoes
  ngOnInit() {

    this.headerService.selectedItem.next('professores');
    this.configuracoesStore.state$.subscribe(state => {
      this.configuracoes = state.configuracao;
      const navColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(navColor);
    });

    // tslint:disable-next-line:variable-name
    const professor_id = Number(this.route.snapshot.params['id']);
    const faculdade_id = Number(environment.faculdade_id);

    this.cursosService.getFavorites(localStorage.getItem('usuario_id')).subscribe(favorites => {
      this.favorites = favorites;
    });

    this.cursosService.getCursosOnlinePorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
      this.cursosAluno = cursosAluno.items;
    });

    this.cursosService.getCursosPresenciaisPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAlunoPresencial) => {
      this.cursosAlunoPresencial = cursosAlunoPresencial.items;
    });

    this.cursosService.getCursosRemotosPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAlunoRemoto) => {
      this.cursosAlunoRemoto = cursosAlunoRemoto.items;
    });

    //this.professorService.getCursosByProfessorId(professor_id).subscribe((apiResponse) => {
    //  this.cursos = apiResponse.items;
    //});

    this.professorService.getCursosByProfessorIdAndFaculdadeID(professor_id, faculdade_id).subscribe((apiResponse) => {
      this.cursos = apiResponse.items;
    });
    

    try {

      this.professorService.getById(professor_id).subscribe((apiResponse) => {
        this.professor = apiResponse.data[0];
      });

    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }

  countOnline() {
    return _.where(this.cursos, {fk_cursos_tipo : 1}).length;
  }

  countRemoto() {
    return _.where(this.cursos, {fk_cursos_tipo : 4}).length;
  }

  countPresencial() {
    return _.where(this.cursos, {fk_cursos_tipo : 2}).length;
  }

}
