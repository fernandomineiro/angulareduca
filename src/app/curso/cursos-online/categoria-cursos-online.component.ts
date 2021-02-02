import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { trigger, state, style, transition, animate } from '@angular/animations'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'


import { Curso } from '../curso.model'
import { CursosService } from '../cursos.service'
import { Categoria } from '../../categorias/categorias.model'
import { CategoriasService } from '../../categorias/categorias.service'

import { Observable, from, of } from 'rxjs'
import { switchMap, tap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators'
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  styles: [`
    .card-image { width: 100%; } 
    .list .padding-5 { width: 100%; }
    #mobile_navbar { background-color: #DBDADA !important; }
  `],
  selector: 'mt-categoria-cursos-online',
  templateUrl: './categoria-cursos-online.component.html'
})

export class CategoriaCursosOnlineComponent implements OnInit {
  IMG_URL = environment.img_url
  cursos:any;
  categorias: Categoria[]
  favorites: any
  cursosAluno: any;

  constructor(
      private cursosService: CursosService,
      private categoriasService: CategoriasService,
      private headerService: HeaderService,
      private route: ActivatedRoute,
      private configuracoesStore: ConfiguracoesStore,
  ) { }

  ngOnInit() {

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    try {
      var banner = 'categoria/'+this.route.snapshot.params['id']
      this.headerService.getBanner(environment.faculdade_id, banner).subscribe((ApiResponse) => {
        this.headerService.changeBanner.next(ApiResponse.items);
      });
      this.cursosService.getFavorites(localStorage.getItem('usuario_id')).subscribe(favorites => {
        this.favorites = favorites;
        this.cursosService.getCursosOnlinePorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
          this.cursosAluno = cursosAluno.items;
          this.cursosService.getCursosRecentes(1).subscribe((ApiResponse) => {
            this.cursos = ApiResponse.items;
          });
        });
        
      
      })


      this.categoriasService.getCategorias(environment.faculdade_id).subscribe((ApiResponse) => {
        this.categorias = ApiResponse.items;
      });

    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }

  

}
