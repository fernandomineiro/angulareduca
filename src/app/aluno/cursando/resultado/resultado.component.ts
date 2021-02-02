import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { trigger, state, style, transition, animate } from '@angular/animations'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'

import { Curso } from '../../../curso/curso.model'
import { CursosService } from '../../../curso/cursos.service'

import { Categoria } from '../../../categorias/categorias.model'
import { CategoriasService } from '../../../categorias/categorias.service'

import { Observable, from } from 'rxjs'
import { switchMap, tap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators'
import { HeaderService } from 'src/app/header/header.service'
import {ConfiguracoesStore} from '../../../stores/configuracoes.store';

@Component({
  styles: [`
    #mobile_navbar { background-color: #DBDADA !important; }
  `],
  selector: 'mt-resultado',
  templateUrl: './resultado.component.html'
})

export class ResultadoComponent implements OnInit {

  curso: any
  route: any;

  sucesso: any;

  constructor(private cursosService: CursosService, 
              private categoriasService: CategoriasService, 
              private router: Router,
              private headerService: HeaderService, private configuracoesStore: ConfiguracoesStore,
  ) { }

  ngOnInit() {

    this.headerService.selectedItem.next('user');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    this.cursosService.cursoById(this.route.snapshot.params['id'])
      .subscribe((ApiResponse) => {
        this.curso = ApiResponse.data;
      });
  }

  aprovado(){
    this.sucesso = true;
  } 
  
  reprovado(){
    this.sucesso = false;
  }   
}
