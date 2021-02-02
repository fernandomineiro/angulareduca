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
import { Router } from '@angular/router';
import { PesquisaStore } from 'src/app/stores/pesquisa.store';
import $ from "jquery";
import { Input } from '@angular/core';
import {Options} from 'ng5-slider';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  styles: [`
    .list1 .padding-5 { width: 100%; }
    footer { margin-top: 30px; }
    #mobile_navbar { background-color:rgba(255,255,255,.7) !important; }
    .grid .cursos-first-square{
      height:400px !important;
    }
    .list1 .cursos-first-square{
      max-height: 200px !important;
      width: 100% !important;
        
      }
      .list1 .outter{
        width:100%;
      }
      #page-cursos.cursos-remotos .grid .outter{
        height:100% !important;
      }
      box-shadow cursos-first-square red-background item{
        
        height:420px !important;;
        margin 0 !important;
      }      
      .grid #cursos_adicionados_recentemente_link .cursos-first-square,
      .grid #cursos_promocoes_link .cursos-first-square,
      .grid #cursos_mais_vendidos_link .cursos-first-square{
        height: 420px !important;
      }
      #page-cursos .item{
        margin:0 !important;
      }
      .list .course-card-info{
        width:100%;
      }
      .list .course-payment{
        right: 0;
        top: 10px;
      }
      #cursos_adicionados_recentemente{
        display:flex !important;
      }
      @media (max-width:991px){
          #cursos_promocoes_link,
          #cursos_promocoes_link{
            display:none !important;
          }
          #cursos_adicionados_recentemente,
          #cursos_promocoes,
          #cursos_mais_vendidos{
            justify-content:space-around;
          }
      }
    
  `],
  selector: 'mt-cursos-remotos',
  templateUrl: './cursos-remotos.component.html'
})

export class CursosRemotosComponent implements OnInit {
  IMG_URL = environment.img_url
  cursosRemotos: Curso[]
  categorias: Categoria[]
  favorites:any
  cursosAluno:any
  currentViewType = 'grid'
  priceValue = 0
  dataSearch={
    
  }
  cursosAdicionadosRecentemente
  cursosEmPromocao
  cursosMaisVendidos;
  isMobile = false;
  configuracoes
  @Input()
  isHome;

  constructor(
      private cursosService: CursosService,
      private categoriasService: CategoriasService,
      private headerService: HeaderService,
      private router: Router,
      private store: PesquisaStore,
      private configuracoesStore: ConfiguracoesStore,
  ) { }

  ngOnInit() {
    this.isMobile = (window.innerWidth < 992) ? true : false;
    if (this.isHome != true) {

      this.configuracoesStore.state$.subscribe(state => {
        this.configuracoes = state.configuracao;
        const confNavColor =
            state.configuracao.tiposCursosAtivos.header_primario ? state.configuracao.tiposCursosAtivos.header_primario : '#FFFFFF';
        this.headerService.changeNavColor.next(confNavColor);
      });
      this.headerService.selectedItem.next('cursos');
      this.headerService.getBanner(environment.faculdade_id, 'cursosremotos').subscribe((ApiResponse) => {
        this.headerService.changeBanner.next(ApiResponse.items);
      });
    }   

    try {

      this.cursosService.getFavorites(localStorage.getItem('usuario_id')).subscribe(favorites => {
        this.favorites = favorites;
        this.cursosService.getCursosRemotosPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
          this.cursosAluno = cursosAluno.items;
          console.log('cursos', cursosAluno);
          this.cursosService.getCursosRecentes(4).subscribe((ApiResponse1) => {
            this.cursosAdicionadosRecentemente = ApiResponse1.items;

          });
          this.cursosService.getCursosEmPromocao(4).subscribe((ApiResponse2) => {
            this.cursosEmPromocao = ApiResponse2.items;
          });
    
          this.cursosService.getCursosMaisVendidos(4).subscribe((ApiResponse3) => {
            this.cursosMaisVendidos = ApiResponse3.items;
          });
    
          this.categoriasService.getCategorias(environment.faculdade_id).subscribe((ApiResponse4) => {
            this.categorias = ApiResponse4.items;
          });

        });

      });      
    
  }
    catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }

  changeViewType(type){
    console.log('entrei');
    this.currentViewType = type;
  }
  changePrice(value) {
      this.priceValue = $(value.target).val();
  }
  findCursos(type, value) {
    switch (type) {
      case 'sort':
        this.dataSearch = {
          sort : value,
          fk_cursos_tipo : 4,
        };
        break;
      case 'price':

        this.priceValue = $(value.target).val();
        this.dataSearch = {
          price : value,
          fk_cursos_tipo : 4,
        };
        break;
    }

    this.cursosService.getCursos(this.dataSearch).subscribe(async apiResponse => {
        await this.store.updateCursos(apiResponse.items);
        this.router.navigate(['/pesquisar']);
    });
  }

  onResized($event): void {
    this.isMobile = (window.innerWidth < 992) ? true : false;
  }
}
