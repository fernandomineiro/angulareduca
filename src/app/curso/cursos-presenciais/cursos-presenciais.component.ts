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
import $ from 'jquery';
import { Input } from '@angular/core';
import {Options} from 'ng5-slider';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  styles: [`
    #mobile_navbar { background-color: rgba(255, 255, 255, .7) !important; }
    .grid .cursos-first-square{
      height:490px !important;
    }
    .list #cursos_adicionados_recentemente_link,
    .list #cursos_promocoes_link,
    .list #cursos_mais_vendidos_link{
      width:100% !important;
    }
    .grid #cursos_adicionados_recentemente_link,
    .grid #cursos_promocoes_link,
    .grid #cursos_mais_vendidos_link{
      padding:5px;
    }
    #page-cursos .item{
      margin: 0 !important;
    }
    .cursos-first-square .title{
      font-size:35px !important;
    }
    @media (max-width:991px){
      #page-cursos #cursos_promocoes, #page-cursos #cursos_mais_vendidos, #page-cursos #cursos_adicionados_recentemente{
        justify-content: space-around;
        display: flex;
      }
      #cursos_adicionados_recentemente_link,
      #cursos_promocoes_link,
      #cursos_mais_vendidos_link{
        display:none;
      }
    }

  `],
  selector: 'mt-cursos-presenciais',
  templateUrl: './cursos-presenciais.component.html'
})

export class CursosPresenciaisComponent implements OnInit {
  IMG_URL = environment.img_url
  cursosPresenciais: Curso[]
  categorias: Categoria[]
  favorites: any
  cursosAluno:any
  cursosAdicionadosRecentemente
  cursosEmPromocao
  cursosMaisVendidos
  currentViewType = 'grid'
  priceValue = 0
  dataSearch = {
    
  };
  isMobile = false;
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
        const confNavColor =
            state.configuracao.tiposCursosAtivos.header_primario ? state.configuracao.tiposCursosAtivos.header_primario : '#FFFFFF';
        this.headerService.changeNavColor.next(confNavColor);
      });

      this.headerService.selectedItem.next('cursos');
      this.headerService.getBanner(environment.faculdade_id, 'cursospresenciais').subscribe((ApiResponse) => {
        this.headerService.changeBanner.next(ApiResponse.items);
      });
    }      
    try {

      this.cursosService.getFavorites(localStorage.getItem('usuario_id')).subscribe(favorites => {
        this.favorites = favorites;
        this.cursosService.getCursosPresenciaisPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
          this.cursosAluno = cursosAluno.items;
          console.log("cursos",cursosAluno);
          this.cursosService.getCursosRecentes(2).subscribe((ApiResponse1) => {
            this.cursosAdicionadosRecentemente = ApiResponse1.items;

          });
          this.cursosService.getCursosEmPromocao(2).subscribe((ApiResponse2) => {
            this.cursosEmPromocao = ApiResponse2.items;
          });
    
          this.cursosService.getCursosMaisVendidos(2).subscribe((ApiResponse3) => {
            this.cursosMaisVendidos = ApiResponse3.items;
          });
    
          this.categoriasService.getCategorias(environment.faculdade_id).subscribe((ApiResponse4) => {
            this.categorias = ApiResponse4.items;
          });

        });

      }); 
      
      this.categoriasService.getCategorias(environment.faculdade_id).subscribe((ApiResponse) => {
        this.categorias = ApiResponse.items;
      });


    } catch (error) {
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
          fk_cursos_tipo : 2,
        };
        break;
      case 'price':
        this.priceValue = $(value.target).val();
        this.dataSearch = {
          price : value,
          fk_cursos_tipo : 1,
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
