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

import { environment } from '../../../environments/environment'
import { ActivatedRoute } from '@angular/router';

import * as _ from 'underscore';
import { Router } from '@angular/router';
import $ from "jquery";
import {PesquisaStore} from '../../stores/pesquisa.store';
import {Configuracao} from '../../configuracao.model';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  IMG_URL = environment.img_url

  categorias: Categoria[];
  categoria_id: string;
  slug_categoria: string;
  favorites: any;
  cursosOnlineAluno: any;
  cursosRemotosAluno: any;
  cursosPresenciaisAluno: any;
  cursosOnline;
  cursosRemotos;
  cursosPresenciais;
  currentCategoria;
  currentViewType = 'grid';
  priceValue = 0;
  dataSearch = { };
  tipoatual = 1;
  configuracoes: Configuracao;
  isMobile = false;

  constructor(private cursosService: CursosService,
              private categoriasService: CategoriasService,
              private headerService: HeaderService,
              private route: ActivatedRoute,
              private router: Router,
              private store: PesquisaStore,
              private configuracoesStore: ConfiguracoesStore,
  ) {
    // tslint:disable-next-line:no-shadowed-variable
    this.configuracoesStore.state$.subscribe(state => {
      this.configuracoes = state.configuracao;
    });
  }

  ngOnInit() {  

    this.isMobile = (window.innerWidth < 992) ? true : false;
    this.headerService.selectedItem.next('cursos');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    try {

      /***************************************************************************************
      * Autor: Gabriel Carvalho
      * Data:  04/03/2020
      * como agora a URL das categorias dos cursos serão amigáveis e não mais com ID, irei 
      * pegar o slug da categoria e fazer uma chamada para o end-point da API que receberá 
      * esse slug da categoria como parametro e nos devolverá o id dessa categoria, pensando 
      * em não precisar modificar muito a estrutura que já existia antes.
      ***************************************************************************************/
      this.categoriasService.getIDCategoriaBySlug(this.route.snapshot.params.id).subscribe((ApiResponse) => {
        this.categoria_id = ApiResponse.data['id'];
        this.slug_categoria = ApiResponse.data['slug_categoria'];

        this.headerService.getBannerCategoria(environment.faculdade_id, 'categoria', this.categoria_id)
          .subscribe((ApiResponse) => {
              this.headerService.changeBanner.next(ApiResponse.items);
          });

          this.cursosService.getFavorites(localStorage.getItem('usuario_id')).subscribe(favorites => {
            this.favorites = favorites;
            this.getOnline();
  
            this.categoriasService.getCategorias(environment.faculdade_id).subscribe((ApiResponse) => {
              this.categorias = ApiResponse.items;
              this.currentCategoria = _.findWhere(this.categorias, { id: Number(this.categoria_id)});
            });
          });

      });
      
    } catch (error) {
      console.log('==== error ====', error);
    }
  }

  getOnline() {
      this.cursosService.getCursosOnlinePorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
        this.cursosOnlineAluno = cursosAluno.items;
        this.categoriasService.getCursosCategoriaETipo(this.categoria_id,1, this.dataSearch).subscribe((ApiResponse) => {
          this.cursosOnline = ApiResponse.items;
        });
      });
  }

  getRemotos() {
      this.cursosService.getCursosRemotosPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
        this.cursosRemotosAluno = cursosAluno.items;
        this.categoriasService.getCursosCategoriaETipo(this.categoria_id,4, this.dataSearch).subscribe((ApiResponse) => {
          this.cursosRemotos = ApiResponse.items;
        });
      });
  }

  getPresenciais() {
      this.cursosService.getCursosPresenciaisPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
        this.cursosPresenciaisAluno = cursosAluno.items;
        this.categoriasService.getCursosCategoriaETipo(this.categoria_id,2, this.dataSearch).subscribe((ApiResponse) => {
          this.cursosPresenciais = ApiResponse.items;
        });
      });
  }

  tabClick(e) {
    if (e.index == 0) {
      this.tipoatual = 1;
      this.getOnline();
    } else if (e.index == 1) {
        this.tipoatual = 4;
        this.getRemotos();
    } else {
        this.tipoatual = 2
        this.getPresenciais();
    }
  }

  changeViewType(type) {
    console.log('entrei');
    this.currentViewType = type;
  }
  changePrice(value) {
      this.priceValue = $(value.target).val();
  }
  findCursos(type, value) {
    switch (type) {
      case 'sort':  this.dataSearch = {
          sort : value,
      };
      break;
      case 'price':
          this.priceValue = $(value.target).val();
          this.dataSearch = {
              price : $(value.target).val()
          };
      break;
    }
    console.log(this.tipoatual)
    if (this.tipoatual == 1) this.getOnline();
    else if(this.tipoatual == 4) this.getRemotos();
    else this.getPresenciais();
  }

  onResized($event): void {
    this.isMobile = (window.innerWidth < 992) ? true : false;
  }
}
