import {Component, OnInit, OnChanges, SimpleChange} from '@angular/core';
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
import { ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { PesquisaStore } from 'src/app/stores/pesquisa.store';
import $ from 'jquery';
import { Input } from '@angular/core';
import { Options } from 'ng5-slider';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';
import { ViewChild } from '@angular/core';
import { LoginService } from 'src/app/security/login/login.service';

@Component({
  styles: [`
    .list .padding-5 { width: 100%; }
    footer { margin-top: 30px; }
    #mobile_navbar { background-color:rgba(255,255,255,.7) !important;}
    .list .itemdiv{
      width:100%
    }  
    .icon-search{
      width:100%;
    }
    .list #cursos_adicionados_recentemente_link,
    .list #cursos_promocoes_link,
    .list #cursos_mais_vendidos_link,
    .list .cursos-first-square{
      width:100% !important;
    }
    .grid #cursos_adicionados_recentemente_link,
    .grid #cursos_promocoes_link,
    .grid #cursos_mais_vendidos_link{
      height: 349px !important;
      padding:5px;
    }
    @media (max-width:991px){
      #cursos_adicionados_recentemente{
        display: flex !important;
      }
      #cursos_adicionados_recentemente_link,
      #cursos_promocoes_link,
      #cursos_mais_vendidos_link{
       display:none !important;

      }    
      #cursos_adicionados_recentemente,
      #cursos_promocoes,
      #cursos_mais_vendidos{
        justify-content:space-around;
      }  
    }
    .list .card-bottom div{
      height:unset !important;
    }
    
  `],
  selector: 'mt-cursos-online',
  templateUrl: './cursos-online.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class CursosOnlineComponent implements OnInit {

  cursosAdicionadosRecentemente: Curso[];
  cursosMaisVendidos: Curso[];
  cursosEmPromocao: Curso[];
  categorias: Categoria[];
  IMG_URL = environment.img_url;
  favorites: any;
  cursosAluno;
  currentViewType = 'grid';
  priceValue = 0;
  dataSearch = {
    
  };
  isMobile = false;
  isMentoria = false;
  coursesMentoria

  @ViewChild('searchBox') searchBox

  @Input()
  isHome;

  constructor(
      private cursosService: CursosService,
      private categoriasService: CategoriasService,
      private headerService: HeaderService,
      private router: Router,
      private store: PesquisaStore,
      private configuracoesStore: ConfiguracoesStore,
      private loginService: LoginService
  ) { 
   
  }


  ngOnInit() {
   
    this.isMobile = (window.innerWidth < 992) ? true : false;
    this.headerService.getBanner(environment.faculdade_id, 'cursosonline').subscribe((ApiResponse) => {
      this.headerService.changeBanner.next(ApiResponse.items);
    });
    if (this.isHome != true) {
      this.headerService.selectedItem.next('cursos');
      this.configuracoesStore.state$.subscribe(state => {
        const confNavColor =
            state.configuracao.tiposCursosAtivos.header_primario ? state.configuracao.tiposCursosAtivos.header_primario : '#FFFFFF';
        this.headerService.changeNavColor.next(confNavColor);
          this.cursosService.getFavorites(localStorage.getItem('usuario_id')).subscribe(favorites => {
            this.favorites = favorites;
            this.cursosService.getCursosOnlinePorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
              this.cursosAluno = cursosAluno.items;
              this.cursosService.getCursosRecentes(1).subscribe((ApiResponse1) => {
                this.cursosAdicionadosRecentemente = ApiResponse1.items;
              });
              this.cursosService.getCursosEmPromocao(1).subscribe((ApiResponse2) => {
                this.cursosEmPromocao = ApiResponse2.items;
              });
        
              this.cursosService.getCursosMaisVendidos(1).subscribe((ApiResponse3) => {
                this.cursosMaisVendidos = ApiResponse3.items;
              });
        
              this.categoriasService.getCategorias(environment.faculdade_id).subscribe((ApiResponse4) => {
                this.categorias = ApiResponse4.items;
              });
    
            });
    
          });
        
      });
      
    
    } 
   
    


  
  }

  changeViewType(type) {
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
          fk_cursos_tipo : this.isMentoria ? 5 : 1,
        };
        break;
      case 'price':

        this.priceValue = $(value.target).val();
        this.dataSearch = {
          price : value,
          fk_cursos_tipo : this.isMentoria ? 5 : 1,
        };
        break;
    }

    if (!this.dataSearch) {
      return;
    }
    console.log("isMentoria", this.isMentoria)
    if(this.isMentoria){
      this.cursosService.getCursosMentoriaSearch(this.dataSearch).subscribe(response=>{
        console.log("response",response);
        this.cursosAdicionadosRecentemente = response.items;
      })      
    }else{
      this.cursosService.getCursos(this.dataSearch).subscribe(async apiResponse => {
        await this.store.updateCursos(apiResponse.items);
        this.router.navigate(['/pesquisar']);
    });
    }
    
  }

  onSubmitSearch(){
    this.cursosService.getCursosMentoriaSearch({search:this.searchBox.nativeElement.value}).subscribe(response=>{
      console.log("response",response);
      this.cursosAdicionadosRecentemente = response.items;
    })   
    
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes: Map<string, SimpleChange> ): void {
    console.log(changes);
  }

  onResized($event): void {
    this.isMobile = (window.innerWidth < 992) ? true : false;
  }

  returnSlideConfig(element, cardWidth) {
    return {
      centerMode: false,
      slidesToShow: Math.floor(($(element).width() / cardWidth)),
      slidesToScroll: Math.floor(($(element).width() / cardWidth)),
      autoplay: true,
      infinite: false,

    };
  }
}
