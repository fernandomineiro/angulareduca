import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { trigger, state, style, transition, animate } from '@angular/animations'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'

import { Curso } from '../../../curso/curso.model'
import { CursosService } from '../../../curso/cursos.service'

import { Categoria } from '../../../categorias/categorias.model'
import { CategoriasService } from '../../../categorias/categorias.service'

import { Observable, from } from 'rxjs'
import { switchMap, tap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators'
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import {ConfiguracoesStore} from '../../../stores/configuracoes.store';

@Component({
  styles: [`
    .list .padding-5 { width: 100%; }
    footer { margin-top: 30px; }
    #mobile_navbar { background-color:rgba(255,255,255,.7) !important; }
  `],
  selector: 'mt-meus-cursos-remoto',
  templateUrl: './remoto.component.html'
})

export class ProfessorMeusCursosRemotoComponent implements OnInit {
  IMG_URL = environment.img_url
  cursos: Curso[]
  categorias: Categoria[]

  constructor(private cursosService: CursosService,
              private configuracoesStore: ConfiguracoesStore,
              private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.selectedItem.next('user');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_primario ? state.configuracao.tiposCursosAtivos.header_primario : '#FFFFFF';
      this.headerService.changeNavColor.next(confNavColor);
    });
    
    try {

      this.cursosService.getCursosHidridosPorProfessor(1).subscribe((ApiResponse) => {
        this.cursos = ApiResponse.items;
      });

    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }

}
