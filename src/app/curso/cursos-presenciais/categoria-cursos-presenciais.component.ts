import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { trigger, state, style, transition, animate } from '@angular/animations'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'

import { Curso } from '../curso.model'
import { CursosService } from '../cursos.service'

import { Categoria } from '../../categorias/categorias.model'
import { CategoriasService } from '../../categorias/categorias.service'

import { Observable, from } from 'rxjs'
import { switchMap, tap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators'
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  styles: [`
    #mobile_navbar { background-color: #DBDADA !important; }
  `],
  selector: 'mt-categoria-cursos-presenciais',
  templateUrl: './categoria-cursos-presenciais.component.html'
})

export class CategoriaCursosPresenciaisComponent implements OnInit {
  IMG_URL = environment.img_url
  cursosPresenciais: Curso[]
  categorias: Categoria[]
  favorites: any
  cursosAluno:any

  constructor(private configuracoesStore: ConfiguracoesStore, private cursosService: CursosService, private categoriasService: CategoriasService, private headerService: HeaderService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    var banner = 'categoria/'+this.route.snapshot.params['id']
    this.headerService.getBanner(environment.faculdade_id,banner).subscribe((ApiResponse) => {   
      this.headerService.changeBanner.next(ApiResponse.items);
    });
    this.cursosService.getFavorites(localStorage.getItem('usuario_id')).subscribe(favorites => {
      this.favorites = favorites;
      this.cursosService.getCursosPresenciaisPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
        this.cursosAluno = cursosAluno.items;
        this.cursosService.getCursosRecentes(2).subscribe((ApiResponse) => {
          this.cursosPresenciais = ApiResponse.items;
          
        });
      });
      
  
    })
    try {

     

      this.categoriasService.getCategorias(environment.faculdade_id).subscribe((ApiResponse) => {
        this.categorias = ApiResponse.items;
      });

    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }

}
